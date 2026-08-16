"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Tag, Loader2, PlusCircle, SearchX } from "lucide-react";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection, voteCollection } from "@/models/name";
import { Query, Models } from "appwrite";
import QuestionCard from "@/components/QuestionCard";
import RightSidebar from "@/components/RightSidebar";

interface TagDetailPageProps {
  params: Promise<{ name: string }>;
}

export default function TagDetailPage(props: TagDetailPageProps) {
  const { name: tagName } = use(props.params);
  const [questions, setQuestions] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestionsByTag() {
      setLoading(true);
      try {
        const res = await databases.listDocuments(db, questionCollection, [
          Query.orderDesc("$createdAt"),
        ]);

        const filtered = res.documents.filter((doc) => {
          const tags = Array.isArray(doc.tags)
            ? doc.tags
            : typeof doc.tags === "string"
            ? (doc.tags as string).split(",").map((t) => t.trim().toLowerCase())
            : [];
          return tags.includes(tagName.toLowerCase());
        });

        const enriched = await Promise.all(
          filtered.map(async (doc) => {
            const [answersRes, votesRes] = await Promise.all([
              databases.listDocuments(db, answerCollection, [
                Query.equal("questionId", doc.$id),
              ]),
              databases.listDocuments(db, voteCollection, [
                Query.equal("type", "question"),
                Query.equal("typeId", doc.$id),
              ]),
            ]);

            const upvotes = votesRes.documents.filter((v) => v.voteStatus === "upvoted").length;
            const downvotes = votesRes.documents.filter((v) => v.voteStatus === "downvoted").length;

            return {
              ...doc,
              answersCount: answersRes.total,
              votesCount: upvotes - downvotes,
            };
          })
        );

        setQuestions(enriched);
      } catch (err) {
        console.error("Error fetching tagged questions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestionsByTag();
  }, [tagName]);

  return (
    <div className="flex gap-6 min-h-screen">
      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Tag className="h-6 w-6 text-orange-500" />
              Questions tagged [{tagName}]
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {questions.length} {questions.length === 1 ? "question" : "questions"}
            </p>
          </div>

          <Link
            href="/questions/ask"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-orange-600 transition shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            Ask Question
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-xs">Loading tagged questions...</p>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q: any) => (
              <QuestionCard key={q.$id} question={q} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-300 rounded-lg p-8 dark:border-zinc-800">
            <SearchX className="h-12 w-12 text-zinc-400 mb-3" />
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              No questions found under [{tagName}]
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
              Be the first developer to ask a question under this tag!
            </p>
            <Link
              href="/questions/ask"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-orange-600 transition"
            >
              <PlusCircle className="h-4 w-4" />
              Ask a Question
            </Link>
          </div>
        )}
      </div>

      <RightSidebar />
    </div>
  );
}
