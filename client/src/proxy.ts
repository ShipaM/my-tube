import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value

  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/auth')

  const isProtectedRoute = ['/subscriptions'].some((route) => pathname.startsWith(route))

  if (isAuthRoute && accessToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (isProtectedRoute && !accessToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/auth/:path*', '/subscriptions'],
}
