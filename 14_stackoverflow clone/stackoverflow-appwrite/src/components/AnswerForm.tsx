"use client";

import React, { useState } from "react";
import { databases } from "@/models/client/config";
import { db, answerCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { ID } from "appwrite";
import { Send, Loader2, AlertCircle } from "lucide-react";

interface AnswerFormProps {
  questionId: string;
  onAnswerAdded?: () => void;
}

export default function AnswerForm({ questionId, onAnswerAdded }: AnswerFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      setErrorMsg("You must be logged in to post an answer.");
      return;
    }

    if (!content.trim()) {
      setErrorMsg("Answer body cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      await databases.createDocument(db, answerCollection, ID.unique(), {
        content: content.trim(),
        questionId: questionId,
        authorId: user.$id,
      });

      setContent("");
      if (onAnswerAdded) onAnswerAdded();
    } catch (err: any) {
      console.error("Error posting answer:", err);
      setErrorMsg(err?.message || "Failed to post answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-6">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        Your Answer
      </h3>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <textarea
        required
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your detailed answer here. Provide code examples or step-by-step solutions..."
        className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 font-mono shadow-sm"
      />

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-600 focus:outline-none disabled:opacity-50 transition"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Posting Answer...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Post Your Answer
          </>
        )}
      </button>
    </form>
  );
}
