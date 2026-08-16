"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import { Search, LogOut, User, MessageSquareCode, PlusCircle } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, session, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95 shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-orange-600 hover:opacity-90">
          <MessageSquareCode className="h-7 w-7 text-orange-500" />
          <span className="hidden sm:inline font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
            stack<span className="font-extrabold text-orange-500">overflow</span>
          </span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by title or [tag]..."
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 py-1.5 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-orange-500 dark:focus:bg-zinc-900"
          />
        </form>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {session && user ? (
            <>
              <Link
                href="/questions/ask"
                className="hidden sm:flex items-center gap-1.5 rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition"
              >
                <PlusCircle className="h-4 w-4" />
                Ask Question
              </Link>
              <Link
                href={`/users/${user.$id}`}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold uppercase">
                  {user.name ? user.name[0] : "U"}
                </div>
                <span className="hidden md:inline font-semibold">{user.name}</span>
                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                  {user.prefs?.reputation || 0} rep
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-red-400 transition"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-orange-400 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-zinc-800 transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
