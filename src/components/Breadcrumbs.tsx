"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

// ثابت محلي — لا نستورد من imageCatalog (ملف server-side يستخدم node:fs)
const SITE_URL = "https://keifaldiafa.com";

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Map paths to Arabic labels
const pathLabels: Record<string, string> = {
  "/": "الرئيسية",
  "/services": "خدماتنا",
  "/offerings": "تقديماتنا",
  "/portfolio": "معرض الأعمال",
  "/about": "من نحن",
  "/contact": "تواصل معنا",
};

function BreadcrumbsContent({
  items,
  className = "",
}: {
  items?: BreadcrumbItem[];
  className?: string;
}) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs if none provided
  const breadcrumbs: BreadcrumbItem[] = items || generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null;

  return (
    <nav
      aria-label="التنقل التفصيلي"
      className={`max-w-7xl mx-auto px-4 pt-20 pb-2 ${className}`}
    >
      <ol
        className="flex items-center gap-2 text-sm flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li
              key={crumb.href}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {!isLast ? (
                <>
                  <Link
                    href={crumb.href}
                    className="text-[#B8860B]/70 hover:text-[#B8860B] transition-colors duration-200"
                    itemProp="item"
                  >
                    <span itemProp="name">{crumb.label}</span>
                  </Link>
                  <span
                    className="text-[#F5F5DC]/20 select-none"
                    aria-hidden="true"
                  >
                    /
                  </span>
                </>
              ) : (
                /* العنصر الأخير: يحتاج itemProp="item" مع name وإلا يراه Google
                   كـ"Unnamed item" في اختبار النتائج المنسّقة. */
                <span
                  className="text-[#F5F5DC]/50"
                  aria-current="page"
                  itemProp="item"
                  itemScope
                  itemType="https://schema.org/WebPage"
                  itemID={`${SITE_URL}${crumb.href}`}
                >
                  <span itemProp="name">{crumb.label}</span>
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Breadcrumbs(props: { items?: BreadcrumbItem[]; className?: string }) {
  return (
    <Suspense fallback={null}>
      <BreadcrumbsContent {...props} />
    </Suspense>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: "الرئيسية", href: "/" }];

  if (pathname !== "/") {
    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";

    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = pathLabels[currentPath] || segment;
      crumbs.push({ label, href: currentPath });
    }
  }

  return crumbs;
}
