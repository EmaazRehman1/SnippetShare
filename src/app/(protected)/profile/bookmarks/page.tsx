"use client";

import { Snippet } from "@/components/shared/Snippet/page";
import React, { useEffect, useState } from "react";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("/api/bookmark");
        if (!res.ok) throw new Error("Failed to fetch bookmarks");
        const data = await res.json();
        console.log("API response:", data);

        setBookmarks(data.data || []);
        console.log(data.data)
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <p className="text-slate-400">Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-black font-semibold ">No bookmarks yet.</p>

    </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-black-200">Your Bookmarks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookmarks.map((bookmark) =>
          bookmark ? (
            <Snippet key={bookmark.id} snippet={bookmark} />
          ) : (
            <p key={bookmark.id} className="text-red-400">
              No snippet found for this bookmark
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
