import type { Route } from "next";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: Route;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="mb-5 sm:mb-6">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#102a43] sm:text-4xl">{title}</h1>
      <nav aria-label={`Trilha de ${title}`} className="mt-2">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li className="flex items-center gap-2" key={item.label}>
                {item.href && !isLast ? (
                  <Link className="transition-colors hover:text-blue-700" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-medium text-slate-700" : undefined}>
                    {item.label}
                  </span>
                )}
                {!isLast ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
