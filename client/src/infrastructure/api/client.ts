import { API_CONFIG, AUTH_ENDPOINTS } from '@/modules/auth'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем request-interceptor — срабатывает ПЕРЕД каждым HTTP-запросом
apiClient.interceptors.request.use(
  // config — конфигурация текущего запроса
  (config: InternalAxiosRequestConfig) => {
    // Берём access token из cookies
    const accessToken = Cookies.get('accessToken')

    // Если токен существует и headers уже инициализированы
    if (accessToken && config.headers) {
      // Добавляем Authorization заголовок
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Обязательно возвращаем config, иначе запрос не пойдёт
    return config
  },
  // Если произошла ошибка на этапе формирования запроса
  (error) => {
    return Promise.reject(error)
  }
)

// Флаг: идёт ли сейчас refresh токена
let isRefreshing = false

// Очередь запросов, которые получили 401 во время refresh
let failedQueue: Array<{
  // resolve — продолжить запрос с новым токеном
  resolve: (token: string) => void
  // reject — отклонить запрос, если refresh не удался
  reject: (error: AxiosError) => void
}> = []

// Функция обрабатывает очередь ожидающих запросов
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  // Проходимся по всем сохранённым промисам
  failedQueue.forEach((promise) => {
    if (error) {
      // Если refresh упал — отклоняем все запросы
      promise.reject(error)
    } else if (token) {
      // Если refresh успешен — передаём новый токен
      promise.resolve(token)
    }
  })

  // Очищаем очередь после обработки
  failedQueue = []
}

// Response-interceptor — срабатывает ПОСЛЕ ответа сервера
apiClient.interceptors.response.use(
  // Если ответ успешный — просто возвращаем его
  (response) => response,

  // Если пришла ошибка
  async (error: AxiosError) => {
    // Сохраняем оригинальный запрос
    // _retry — кастомный флаг, чтобы избежать бесконечного цикла
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Если сервер вернул 401 (token expired)
    // и этот запрос ещё не пытался обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Если refresh уже выполняется
      if (isRefreshing) {
        // Ставим текущий запрос в очередь
        return (
          new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            // Когда refresh завершится успешно
            .then((token) => {
              if (originalRequest.headers) {
                // Подставляем новый токен
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              // Повторяем оригинальный запрос
              return apiClient(originalRequest)
            })
            // Если refresh упал
            .catch((err) => {
              return Promise.reject(err)
            })
        )
      }

      // Помечаем запрос как уже ретраенный
      originalRequest._retry = true
      // Говорим системе, что refresh начался
      isRefreshing = true

      try {
        // Отправляем запрос на refresh токена
        const response = await axios.post(
          `${API_CONFIG.baseURL}${AUTH_ENDPOINTS.REFRESH}`,
          {}, // тело пустое
          { withCredentials: true } // cookie с refresh token
        )

        // Получаем новый access token
        const accessToken = response.data.accessToken

        // Сохраняем токен в cookies
        Cookies.set('accessToken', accessToken, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })

        // Продолжаем все запросы из очереди
        processQueue(null, accessToken)

        // Подставляем токен в текущий запрос
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Повторяем оригинальный запрос
        return apiClient(originalRequest)
      } catch (refreshErr) {
        // Если refresh не удался — отклоняем все ожидающие запросы
        processQueue(refreshErr as AxiosError, null)

        // Удаляем токен
        Cookies.remove('accessToken')

        // Редирект на логин
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }

        return Promise.reject(refreshErr)
      } finally {
        // ВАЖНО: сбрасываем флаг refresh
        isRefreshing = false
      }
    }

    // Если ошибка не 401 — просто пробрасываем дальше
    return Promise.reject(error)
  }
)
