"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tag, Loader2, Search } from "lucide-react";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { Models } from "appwrite";

export default function TagsPage() {
  const [tagsMap, setTagsMap] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await databases.listDocuments(db, questionCollection);
        const map: { [key: string]: number } = {};

        res.documents.forEach((doc) => {
          const tags = Array.isArray(doc.tags)
            ? doc.tags
            : typeof doc.tags === "string"
            ? (doc.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
            : [];

          tags.forEach((tag) => {
            const normalized = tag.toLowerCase();
            map[normalized] = (map[normalized] || 0) + 1;
          });
        });

        setTagsMap(map);
      } catch (err) {
        console.error("Error fetching tags:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  const tagsList = Object.entries(tagsMap).filter(([name]) =>
    name.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Tag className="h-6 w-6 text-orange-500" />
          Tags
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
          A tag is a keyword or label that categorizes your question with other, similar questions.
          Using the right tags makes it easier for others to find and answer your question.
        </p>
      </div>

      {/* Filter search bar */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by tag name..."
          className="w-full rounded-md border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          <p className="text-xs">Loading tags...</p>
        </div>
      ) : tagsList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tagsList.map(([name, count]) => (
            <Link
              key={name}
              href={`/tags/${name}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 hover:border-orange-400 transition space-y-2 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  {name}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {count} {count === 1 ? "question" : "questions"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                Questions tagged with {name}. Click to view all discussions under this topic.
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-zinc-400 border border-dashed border-zinc-300 rounded-lg dark:border-zinc-800">
          No tags found matching "{search}".
        </div>
      )}
    </div>
  );
}
