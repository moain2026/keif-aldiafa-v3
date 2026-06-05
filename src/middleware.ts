import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware لتنظيف الروابط القديمة (WordPress) وتوحيد الدومين.
 * يحل مشكلتين كانتا تضرّان أرشفة جوجل:
 *  1. تكرار المحتوى www / non-www  → توحيد على non-www.
 *  2. روابط WordPress القديمة ?page_id=N → تحويل 301 نظيف لصفحات حقيقية
 *     (كانت سابقاً تسبّب حلقة 308 لا نهائية).
 */

// خريطة معرّفات صفحات WordPress القديمة → المسارات الجديدة.
// (عدّلها لو عرفت التطابق الدقيق لكل page_id)
const LEGACY_PAGE_MAP: Record<string, string> = {
  "33": "/",
  "1344": "/services",
  "1497": "/about",
  "1538": "/offerings",
  "1608": "/contact",
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  // 1) توحيد الدومين: www → non-www (301)
  if (host.startsWith("www.")) {
    const target = new URL(url.toString());
    target.host = host.replace(/^www\./, "");
    target.protocol = "https:";
    return NextResponse.redirect(target, 301);
  }

  // 2) روابط WordPress القديمة: ?page_id=N
  const pageId = url.searchParams.get("page_id");
  if (pageId && url.pathname === "/") {
    const dest = LEGACY_PAGE_MAP[pageId] ?? "/";
    const target = new URL(dest, url.origin);
    return NextResponse.redirect(target, 301);
  }

  // 3) روابط WordPress شائعة أخرى
  if (url.searchParams.has("p") && url.pathname === "/") {
    return NextResponse.redirect(new URL("/", url.origin), 301);
  }

  return NextResponse.next();
}

export const config = {
  // نطبّق على كل المسارات ما عدا الأصول الثابتة والـ API
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|images|videos|.*\\.(?:webp|jpg|jpeg|png|svg|ico|woff2?|xml|txt|json)).*)",
  ],
};
