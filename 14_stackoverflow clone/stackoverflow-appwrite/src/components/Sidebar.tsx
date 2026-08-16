"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HelpCircle, Tag, Users } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Questions", href: "/questions", icon: HelpCircle },
    { label: "Tags", href: "/tags", icon: Tag },
    { label: "Users", href: "/users", icon: Users },
  ];

  return (
    <aside className="w-52 shrink-0 hidden md:block border-r border-zinc-200 bg-white min-h-[calc(100vh-3.5rem)] py-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="sticky top-20 space-y-6">
        <div>
          <h3 className="px-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Public
          </h3>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors border-r-4 ${
                    isActive
                      ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold dark:bg-orange-950/30 dark:text-orange-400"
                      : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-orange-500" : "text-zinc-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
