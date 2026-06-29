import { NextResponse } from "next/server";

// נעילת סיסמה בסיסית (Basic Auth) — כדי שהאתר לא יהיה ציבורי.
// אם APP_PASSWORD לא מוגדר (פיתוח מקומי) — פתוח.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req) {
  const pass = process.env.APP_PASSWORD;
  if (!pass) return NextResponse.next();
  const auth = req.headers.get("authorization");
  if (auth && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.split(" ")[1]);
      const pw = decoded.slice(decoded.indexOf(":") + 1);
      if (pw === pass) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("נדרשת התחברות", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Ronny Studio"' },
  });
}
