import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    request.headers.set("x-supabase-user-id", user.id);
    if (user.email) {
      request.headers.set("x-supabase-user-email", user.email);
    }
    if (user.user_metadata?.full_name) {
      request.headers.set("x-supabase-user-name", user.user_metadata.full_name);
    }
    // Update the response with the modified headers
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    // Restore cookies from the original response object if they were modified by setAll
    // (This is a simplified approach, but we can also just recreate the response)
  }

  // Protect dashboard routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/") && 
    !request.nextUrl.pathname.startsWith("/login") && 
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/api/auth");

  if (isDashboardRoute && !user && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (user && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect root to dashboard if logged in, or login if not
  if (request.nextUrl.pathname === "/") {
      if (user) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
          return NextResponse.redirect(new URL("/login", request.url));
      }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
