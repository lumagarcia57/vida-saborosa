import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')

  if (!token && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/configuracoes'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/configuracoes/:path*"],
}
