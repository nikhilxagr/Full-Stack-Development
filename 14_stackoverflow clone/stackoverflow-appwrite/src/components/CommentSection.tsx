"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { databases } from "@/models/client/config";
import { db, commentCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { Query, ID, Models } from "appwrite";

interface CommentSectionProps {
  type: "question" | "answer";
  typeId: string;
}

export default function CommentSection({ type, typeId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Models.Document[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await databases.listDocuments(db, commentCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.orderAsc("$createdAt"),
        ]);
        setComments(res.documents);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }
    fetchComments();
  }, [type, typeId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add a comment.");
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const createdDoc = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content: newComment.trim(),
          type,
          typeId,
          authorId: user.$id,
        }
      );

      setComments((prev) => [...prev, createdDoc]);
      setNewComment("");
      setShowInput(false);
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
      {/* Existing Comments List */}
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((c: any) => (
            <div
              key={c.$id}
              className="text-xs text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800/60 pb-1.5 flex items-start gap-2"
            >
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                {c.content}
              </span>
              <span className="text-[10px] text-zinc-400 ml-auto whitespace-nowrap">
                – {new Date(c.$createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add comment toggle / form */}
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-xs font-medium text-orange-600 hover:underline dark:text-orange-400 flex items-center gap-1"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Add a comment
        </button>
      ) : (
        <form onSubmit={handleAddComment} className="flex gap-2 items-center">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Use comments to ask for clarification or suggest improvements..."
            className="flex-1 rounded-md border border-zinc-300 bg-white py-1 px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="rounded-md bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            Post
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="text-xs text-zinc-400 hover:text-zinc-600 px-1"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
