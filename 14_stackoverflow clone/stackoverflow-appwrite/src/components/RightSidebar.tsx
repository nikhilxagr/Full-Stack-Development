"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Flame, Award } from "lucide-react";

export default function RightSidebar() {
  const popularTags = [
    { name: "javascript", count: 42 },
    { name: "react", count: 35 },
    { name: "next.js", count: 28 },
    { name: "appwrite", count: 19 },
    { name: "typescript", count: 15 },
    { name: "tailwindcss", count: 12 },
  ];

  return (
    <aside className="w-80 shrink-0 hidden lg:block space-y-6 py-6 pl-4">
      {/* Community Blog / Meta info */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <h4 className="flex items-center gap-2 font-semibold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wide">
          <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          The Overflow Blog
        </h4>
        <ul className="mt-3 space-y-2 text-xs text-amber-950 dark:text-amber-200">
          <li className="hover:underline cursor-pointer">
            • Building fullstack apps with Next.js & Appwrite Cloud
          </li>
          <li className="hover:underline cursor-pointer">
            • Best practices for database collections & indexes
          </li>
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <h4 className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          <Flame className="h-4 w-4 text-orange-500" />
          Popular Tags
        </h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className="flex items-center gap-1.5 rounded-md bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:hover:bg-orange-900/60 transition"
            >
              <span>{tag.name}</span>
              <span className="text-[10px] text-orange-400 dark:text-orange-500 font-bold">
                x{tag.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Contributors info */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <h4 className="flex items-center gap-2 font-semibold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
          <Award className="h-4 w-4 text-amber-500" />
          Reputation System
        </h4>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Earn reputation by asking questions and posting helpful answers!
        </p>
        <div className="mt-3 text-[11px] space-y-1 text-zinc-500 dark:text-zinc-400">
          <div>• Upvote on Question/Answer: <span className="font-bold text-green-600">+10 rep</span></div>
          <div>• Downvote: <span className="font-bold text-red-500">-2 rep</span></div>
        </div>
      </div>
    </aside>
  );
}
