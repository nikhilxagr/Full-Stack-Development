"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { PlusCircle, Loader2, Paperclip, ArrowLeft } from "lucide-react";
import { databases, storage } from "@/models/client/config";
import { db, questionCollection, answerCollection, questionAttachmentBucket } from "@/models/name";
import { Query, Models } from "appwrite";
import VoteButtons from "@/components/VoteButtons";
import CommentSection from "@/components/CommentSection";
import AnswerCard from "@/components/AnswerCard";
import AnswerForm from "@/components/AnswerForm";
import RightSidebar from "@/components/RightSidebar";

interface QuestionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionDetailPage(props: QuestionDetailPageProps) {
  const { id: questionId } = use(props.params);

  const [question, setQuestion] = useState<Models.Document | null>(null);
  const [answers, setAnswers] = useState<Models.Document[]>([]);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // 1. Fetch Question Document
      const qDoc = await databases.getDocument(db, questionCollection, questionId);
      setQuestion(qDoc);

      // 2. Fetch Attachment Preview if exists
      if (qDoc.attachmentId) {
        try {
          const previewUrl = storage.getFilePreview(
            questionAttachmentBucket,
            qDoc.attachmentId
          );
          setAttachmentUrl(previewUrl.toString());
        } catch (e) {
          console.error("Error fetching file preview:", e);
        }
      }

      // 3. Fetch Answers
      const ansRes = await databases.listDocuments(db, answerCollection, [
        Query.equal("questionId", questionId),
        Query.orderAsc("$createdAt"),
      ]);
      setAnswers(ansRes.documents);
    } catch (err) {
      console.error("Error loading question details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [questionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-xs">Loading question...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Question not found</h2>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-orange-600 hover:underline font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to questions
        </Link>
      </div>
    );
  }

  const q: any = question;

  const tagsList = Array.isArray(q.tags)
    ? q.tags
    : typeof q.tags === "string"
    ? (q.tags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  const formattedDate = new Date(q.$createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex gap-6 min-h-screen">
      {/* Main Column */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Title Header */}
        <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {q.title}
            </h1>
            <Link
              href="/questions/ask"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-orange-600 transition shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              Ask Question
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div>Asked <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formattedDate}</span></div>
            <div>Answers <span className="font-semibold text-zinc-700 dark:text-zinc-300">{answers.length}</span></div>
          </div>
        </div>

        {/* Question Body */}
        <div className="flex gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
          {/* Vote column */}
          <VoteButtons
            type="question"
            typeId={q.$id}
            authorId={q.authorId}
          />

          {/* Question detail body */}
          <div className="flex-1 space-y-4 min-w-0">
            <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans">
              {q.content}
            </div>

            {/* Attachment preview if available */}
            {attachmentUrl && (
              <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <Paperclip className="h-4 w-4 text-orange-500" />
                  Attached Image:
                </div>
                <img
                  src={attachmentUrl}
                  alt="Question Attachment"
                  className="max-h-96 rounded-md object-contain border border-zinc-300 dark:border-zinc-700"
                />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tagsList.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="rounded bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Author badge */}
            <div className="flex items-center justify-end pt-2">
              <div className="flex items-center gap-2 rounded-md bg-orange-50/80 p-2.5 dark:bg-orange-950/30 text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold uppercase">
                  {q.authorName ? q.authorName[0] : "A"}
                </div>
                <div>
                  <div className="font-semibold text-orange-900 dark:text-orange-300">
                    {q.authorName || "Anonymous"}
                  </div>
                  <div className="text-[10px] text-orange-600 dark:text-orange-400">
                    asked {formattedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Comments */}
            <CommentSection type="question" typeId={q.$id} />
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {answers.length > 0 ? (
            answers.map((ans: any) => <AnswerCard key={ans.$id} answer={ans} />)
          ) : (
            <p className="text-xs text-zinc-500 italic py-4">
              No answers yet. Know the answer? Share your knowledge below!
            </p>
          )}
        </div>

        {/* Post Answer Form */}
        <AnswerForm questionId={question.$id} onAnswerAdded={loadData} />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
}
