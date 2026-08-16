"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { Query, ID } from "appwrite";

interface VoteButtonsProps {
  type: "question" | "answer";
  typeId: string;
  authorId: string;
  initialVoteCount?: number;
}

export default function VoteButtons({
  type,
  typeId,
  authorId,
  initialVoteCount = 0,
}: VoteButtonsProps) {
  const { user } = useAuthStore();
  const [voteScore, setVoteScore] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<"upvoted" | "downvoted" | null>(null);
  const [voteDocId, setVoteDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const res = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
        ]);

        const upvotes = res.documents.filter((v) => v.voteStatus === "upvoted").length;
        const downvotes = res.documents.filter((v) => v.voteStatus === "downvoted").length;
        setVoteScore(upvotes - downvotes);

        if (user) {
          const myVote = res.documents.find((v) => v.votedById === user.$id);
          if (myVote) {
            setUserVote(myVote.voteStatus as "upvoted" | "downvoted");
            setVoteDocId(myVote.$id);
          }
        }
      } catch (err) {
        console.error("Error fetching votes:", err);
      }
    }

    fetchVotes();
  }, [type, typeId, user]);

  const handleVote = async (status: "upvoted" | "downvoted") => {
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (userVote === status) {
        // Cancel vote
        if (voteDocId) {
          await databases.deleteDocument(db, voteCollection, voteDocId);
          setVoteScore((prev) => (status === "upvoted" ? prev - 1 : prev + 1));
          setUserVote(null);
          setVoteDocId(null);
        }
      } else {
        // Toggle or Add new vote
        let scoreDiff = status === "upvoted" ? 1 : -1;
        if (userVote) {
          scoreDiff *= 2; // Switching from upvote to downvote or vice versa
        }

        if (voteDocId) {
          await databases.updateDocument(db, voteCollection, voteDocId, {
            voteStatus: status,
          });
        } else {
          const newDoc = await databases.createDocument(
            db,
            voteCollection,
            ID.unique(),
            {
              type,
              typeId,
              voteStatus: status,
              votedById: user.$id,
            }
          );
          setVoteDocId(newDoc.$id);
        }

        setVoteScore((prev) => prev + scoreDiff);
        setUserVote(status);
      }
    } catch (err) {
      console.error("Voting error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <button
        onClick={() => handleVote("upvoted")}
        disabled={loading}
        title="Upvote"
        className={`rounded-full p-1.5 transition ${
          userVote === "upvoted"
            ? "bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400"
            : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        }`}
      >
        <ChevronUp className="h-6 w-6 stroke-[2.5]" />
      </button>

      <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">
        {voteScore}
      </span>

      <button
        onClick={() => handleVote("downvoted")}
        disabled={loading}
        title="Downvote"
        className={`rounded-full p-1.5 transition ${
          userVote === "downvoted"
            ? "bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400"
            : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        }`}
      >
        <ChevronDown className="h-6 w-6 stroke-[2.5]" />
      </button>
    </div>
  );
}
