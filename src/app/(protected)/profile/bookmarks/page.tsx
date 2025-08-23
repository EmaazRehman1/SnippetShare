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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-500 border-dashed rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-500">Loading...</span>
      </div>

    );
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
      <div className="w-full flex justify-center items-center">
        <h2 className="text-3xl font-semibold mb-4">Bookmarks</h2>

      </div>


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
