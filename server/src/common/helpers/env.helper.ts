export const isDev = (): boolean => process.env.NODE_ENV !== 'production'
export const isProd = (): boolean => process.env.NODE_ENV === 'production'
