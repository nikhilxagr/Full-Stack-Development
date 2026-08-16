"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { User, Award, HelpCircle, MessageSquare, Loader2 } from "lucide-react";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection } from "@/models/name";
import { Query, Models } from "appwrite";
import QuestionCard from "@/components/QuestionCard";

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage(props: UserProfilePageProps) {
  const { id: userId } = use(props.params);

  const [questions, setQuestions] = useState<Models.Document[]>([]);
  const [answers, setAnswers] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const [qRes, aRes] = await Promise.all([
          databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", userId),
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", userId),
            Query.orderDesc("$createdAt"),
          ]),
        ]);

        setQuestions(qRes.documents);
        setAnswers(aRes.documents);
      } catch (err) {
        console.error("Error fetching user profile data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  const totalReputation = questions.length * 10 + answers.length * 15;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-3xl uppercase shadow">
          U
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            User Activity Profile
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            User ID: <span className="font-mono text-zinc-700 dark:text-zinc-300">{userId}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 rounded-md bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <Award className="h-4 w-4" />
              <span>{totalReputation} reputation</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <HelpCircle className="h-4 w-4" />
              <span>{questions.length} questions asked</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <MessageSquare className="h-4 w-4" />
              <span>{answers.length} answers provided</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Questions Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Questions Asked ({questions.length})
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <p className="text-xs">Loading activity...</p>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q: any) => (
              <QuestionCard key={q.$id} question={q} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-zinc-400 border border-dashed border-zinc-300 rounded-lg dark:border-zinc-800">
            This user hasn't asked any questions yet.
          </div>
        )}
      </div>
    </div>
  );
}
