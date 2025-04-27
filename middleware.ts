import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For a real app, you would check for a session token here
  // Since we're just simulating authentication for this demo,
  // we'll allow access to the dashboard without verification

  // In a real application, you would do something like:
  // const token = request.cookies.get('auth_token')
  // if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
