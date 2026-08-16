"use client";

import React from "react";
import VoteButtons from "./VoteButtons";
import CommentSection from "./CommentSection";
import { Models } from "appwrite";

interface AnswerCardProps {
  answer: Models.Document & {
    content: string;
    questionId: string;
    authorId: string;
    authorName?: string;
  };
}

export default function AnswerCard({ answer }: AnswerCardProps) {
  const formattedDate = new Date(answer.$createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex gap-4 border-b border-zinc-200 py-6 dark:border-zinc-800">
      {/* Voting column */}
      <VoteButtons
        type="answer"
        typeId={answer.$id}
        authorId={answer.authorId}
      />

      {/* Answer content */}
      <div className="flex-1 space-y-4 min-w-0">
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans">
          {answer.content}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs text-zinc-400 pt-2">
          <div className="flex items-center gap-1.5 rounded-md bg-zinc-100 p-2 dark:bg-zinc-800">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase">
              {answer.authorName ? answer.authorName[0] : "A"}
            </div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {answer.authorName || "Community User"}
            </span>
            <span>answered {formattedDate}</span>
          </div>
        </div>

        {/* Answer Comments */}
        <CommentSection type="answer" typeId={answer.$id} />
      </div>
    </div>
  );
}
