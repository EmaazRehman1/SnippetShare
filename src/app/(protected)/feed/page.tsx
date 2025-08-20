'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Snippet } from '@/components/shared/Snippet/page'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@/components/shared/Pagination/page'
import { Filter, Search } from 'lucide-react'
import { SearchBar } from '@/components/shared/SearchBar/page'
import { Input } from '@/components/ui/input'
import { LanguageFilter } from '@/components/shared/LanguageFilter/page'


interface Snippet {
  author: {
    name: string
    email: string
  },
  id: string
  code: string
  createdAt: Date
  description?: string
  title: string
  tags: string[]
  language: string
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  },
}

const Feed = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageFromUrl = Number(searchParams.get("page")) || 1
  const [page, setPage] = useState(pageFromUrl)
  const [pagination, setPagination] = useState<Snippet['pagination'] | null>(null)
  const searchQuery: string | null = searchParams.get("search") || ""
  const languageQuery: string | null = searchParams.get("language") || ""


  useEffect(() => {
    const params = new URLSearchParams();

    if (page && page !== null) params.set("page", page.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (languageQuery) params.set("language", languageQuery);

    const queryString = params.toString();
    router.push(`/feed${queryString ? `?${queryString}` : ""}`);
  }, [page, searchQuery, languageQuery, router]);


  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams({
          page: String(page),
          limit: "5",
          ...(searchQuery ? { searchText: searchQuery } : {}),
          ...(languageQuery ? { language: languageQuery } : {}),
        });

        const resp = await fetch(`/api/snippets?${query.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store", 
        });

        const data = await resp.json(); 

        if (data.success && data.snippets) {
          setSnippets(
            data.snippets.map((snippet: any) => ({
              ...snippet,
              author: {
                name: snippet.author?.name ?? "Unknown",
                email: snippet.author?.email ?? "",
              },
              description: snippet.description ?? "",
            }))
          );
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to fetch snippets");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        toast.error("Failed to fetch snippets");
        console.error("Error fetching snippets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [page, searchQuery, languageQuery]);


  useEffect(() => {
    setPage(1)
  }, [searchQuery, languageQuery])


  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.delete("language")
    router.push(`/feed?${params.toString()}`)
  }


  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Code Snippets Feed</h1>
        <p className="text-gray-600">Discover and explore code snippets from the community</p>
      </div>

      <div className='flex flex-col justify-around gap-4 md:flex-row'>
        <div className='w-full'>
          <SearchBar />

        </div>
        <LanguageFilter language={languageQuery} />
        <Button onClick={handleClearFilters} className='flex gap-2 items-center'> <Filter /> <span>Clear filter</span></Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading snippets...</span>
        </div>
      ) : snippets.length > 0 ? (
        snippets.map((snippet) => (
          <Snippet snippet={snippet} key={snippet.id} />
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No code snippets found</div>
          <p className="text-gray-400">Be the first to share a code snippet!</p>
          <Button
            className="mt-4 cursor-pointer"
            onClick={() => router.push('/create-snippet')}
          >
            Share now
          </Button>
        </div>
      )}

      <Pagination
        total={pagination?.total}
        page={pagination?.page}
        limit={pagination?.limit}
        totalPages={pagination?.totalPages}
        onPageChange={setPage}
      />
    </div>
  )

}

export default Feed