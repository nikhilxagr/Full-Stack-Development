"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Loader2, Award, HelpCircle } from "lucide-react";
import { databases } from "@/models/client/config";
import { db, questionCollection, answerCollection } from "@/models/name";
import { Models } from "appwrite";

interface UserProfileSummary {
  authorId: string;
  authorName: string;
  questionsCount: number;
  answersCount: number;
}

export default function UsersPage() {
  const [usersList, setUsersList] = useState<UserProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsersActivity() {
      try {
        const [qRes, aRes] = await Promise.all([
          databases.listDocuments(db, questionCollection),
          databases.listDocuments(db, answerCollection),
        ]);

        const usersMap: { [key: string]: UserProfileSummary } = {};

        qRes.documents.forEach((doc) => {
          const authorId = doc.authorId || "anonymous";
          if (!usersMap[authorId]) {
            usersMap[authorId] = {
              authorId,
              authorName: doc.authorName || "Community Member",
              questionsCount: 0,
              answersCount: 0,
            };
          }
          usersMap[authorId].questionsCount += 1;
        });

        aRes.documents.forEach((doc) => {
          const authorId = doc.authorId || "anonymous";
          if (!usersMap[authorId]) {
            usersMap[authorId] = {
              authorId,
              authorName: doc.authorName || "Community Member",
              questionsCount: 0,
              answersCount: 0,
            };
          }
          usersMap[authorId].answersCount += 1;
        });

        setUsersList(Object.values(usersMap));
      } catch (err) {
        console.error("Error fetching users activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsersActivity();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Users className="h-6 w-6 text-orange-500" />
          Community Users
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Explore active contributors, developers, and answers in the Stack Overflow community.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          <p className="text-xs">Loading community users...</p>
        </div>
      ) : usersList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {usersList.map((user) => (
            <Link
              key={user.authorId}
              href={`/users/${user.authorId}`}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 hover:border-orange-400 transition dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-bold uppercase text-sm">
                {user.authorName ? user.authorName[0] : "U"}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {user.authorName}
                </h4>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="h-3 w-3 text-orange-500" />
                    {user.questionsCount} q
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3 text-green-500" />
                    {user.answersCount} ans
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-zinc-400 border border-dashed border-zinc-300 rounded-lg dark:border-zinc-800">
          No active contributors registered yet. Be the first to ask or answer!
        </div>
      )}
    </div>
  );
}
