"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import { databases, storage } from "@/models/client/config";
import { db, questionCollection, questionAttachmentBucket } from "@/models/name";
import { ID } from "appwrite";
import { PlusCircle, Paperclip, AlertCircle, Loader2, Info } from "lucide-react";

export default function AskQuestionPage() {
  const router = useRouter();
  const { user, session } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!session || !user) {
      setErrorMsg("You must be logged in to ask a question.");
      return;
    }

    if (!title.trim() || !content.trim() || !tagsInput.trim()) {
      setErrorMsg("Please fill in Title, Problem details, and Tags.");
      return;
    }

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (tagsArray.length === 0) {
      setErrorMsg("Please provide at least one valid tag.");
      return;
    }

    setLoading(true);

    try {
      let attachmentId = "";

      // 1. Upload File Attachment to Appwrite Storage if provided
      if (file) {
        const uploadedFile = await storage.createFile(
          questionAttachmentBucket,
          ID.unique(),
          file
        );
        attachmentId = uploadedFile.$id;
      }

      // 2. Create Question Document in Appwrite Database
      const newQuestion = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title: title.trim(),
          content: content.trim(),
          authorId: user.$id,
          tags: tagsArray,
          attachmentId: attachmentId || undefined,
        }
      );

      setLoading(false);
      router.push(`/questions/${newQuestion.$id}`);
      router.refresh();
    } catch (err: any) {
      console.error("Error creating question:", err);
      setLoading(false);
      setErrorMsg(err?.message || "Failed to create question. Please check database permissions.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Ask a Public Question
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Be specific and imagine you’re asking a question to another developer.
        </p>
      </div>

      {/* Guidelines Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 text-xs space-y-2 text-blue-900 dark:text-blue-300">
        <h3 className="font-semibold flex items-center gap-2 text-sm text-blue-950 dark:text-blue-200">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          Writing a good question
        </h3>
        <ul className="list-disc list-inside space-y-1 pl-1 text-blue-900/80 dark:text-blue-300/80">
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in detail and include what you tried.</li>
          <li>Add up to 5 tags to describe what your question is about.</li>
        </ul>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-2 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Title
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Be specific and imagine you’re asking a question to another developer.
          </p>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Is there a R-function for finding the index of an element in a vector?"
            className="w-full rounded-md border border-zinc-300 bg-white py-2 px-3 text-sm placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Content Body */}
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-2 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            What are the details of your problem?
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Introduce the problem and expand on what you put in the title. Minimum 20 characters.
          </p>
          <textarea
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Explain what you are trying to achieve, what code you wrote, and what error or behavior you are encountering..."
            className="w-full rounded-md border border-zinc-300 bg-white p-3 text-sm placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 font-mono"
          />
        </div>

        {/* Tags */}
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-2 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Tags
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Add up to 5 tags separated by commas to describe what your question is about.
          </p>
          <input
            type="text"
            required
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. react, javascript, appwrite, nextjs"
            className="w-full rounded-md border border-zinc-300 bg-white py-2 px-3 text-sm placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Optional File Attachment */}
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-2 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-orange-500" />
            Attachment (Optional)
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Attach a screenshot or image file (jpg, png, gif, webp).
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 dark:file:bg-orange-950/40 dark:file:text-orange-400"
          />
        </div>

        {/* Submit button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-600 focus:outline-none disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting Question...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Post Your Question
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
