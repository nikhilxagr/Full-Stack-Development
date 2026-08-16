"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye, Paperclip } from "lucide-react";
import { Models } from "appwrite";

interface QuestionCardProps {
  question: Models.Document & {
    title: string;
    content: string;
    authorId: string;
    tags: string[];
    attachmentId?: string;
    authorName?: string;
    votesCount?: number;
    answersCount?: number;
  };
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const votes = question.votesCount || 0;
  const answers = question.answersCount || 0;
  const tagsList = Array.isArray(question.tags)
    ? question.tags
    : typeof question.tags === "string"
    ? (question.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const formattedDate = new Date(question.$createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-zinc-200 bg-white p-5 hover:border-orange-300 transition dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
      {/* Stats Column */}
      <div className="flex sm:flex-col items-center justify-start gap-4 sm:gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0 sm:w-24">
        <div className="flex items-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
          <ThumbsUp className="h-3.5 w-3.5 text-zinc-400" />
          <span>{votes} votes</span>
        </div>
        <div
          className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${
            answers > 0
              ? "border border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
              : "text-zinc-500"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{answers} answers</span>
        </div>
      </div>

      {/* Main Content Column */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/questions/${question.$id}`}
            className="text-base font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 line-clamp-2"
          >
            {question.title}
          </Link>
          {question.attachmentId && (
            <span title="Has Attachment" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <Paperclip className="h-4 w-4 shrink-0" />
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {question.content.replace(/[#*`_~]/g, "")}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tagsList.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:hover:bg-orange-900/60 transition"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Author info */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 ml-auto">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase">
              {question.authorName ? question.authorName[0] : "A"}
            </div>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {question.authorName || "Anonymous"}
            </span>
            <span>asked {formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
