'use client'
import { getAllSnippets } from '@/common/actions/snippets'
import React, { useEffect, useState } from 'react'
import CodeEditor from '@/components/shared/CodeEditor'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

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
}

const Feed = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState("")

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true)
        const resp = await getAllSnippets()
        console.log(resp)
        if (resp.success && resp.snippets) {
          setSnippets(
            resp.snippets.map((snippet: any) => ({
              ...snippet,
              author: {
                name: snippet.author.name ?? 'Unknown',
                email: snippet.author.email ?? '',
              },
              description: snippet.description ?? '',
            }))
          )
        } else {
          setError(resp.error || 'Failed to fetch snippets')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        toast.error('Failed to fetch snippets')
        console.error('Error fetching snippets:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSnippets()
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading snippets...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No code snippets found</div>
        <p className="text-gray-400">Be the first to share a code snippet!</p>
      </div>
    )
  }
  const handlecopy = (code: string,id:string) => () => {
    navigator.clipboard.writeText(code)
    setCopied(id)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Code Snippets Feed</h1>
        <p className="text-gray-600">Discover and explore code snippets from the community</p>
      </div>

      {snippets.map((snippet) => (
        <div key={snippet.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {snippet.title}
                </h3>
                {snippet.description && (
                  <p className="text-gray-600 text-sm mb-2">{snippet.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <span>By {snippet.author.name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(snippet.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {snippet.language}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {snippet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="p-6">
            <CodeEditor
              value={snippet.code}
              language={snippet.language}
              height="200px"
            />
          </div>

          <div className='w-full flex justify-end items-center p-4 gap-2'>

          <Button variant={'outline'} onClick={handlecopy(snippet.code,snippet.id)}>
            {copied === snippet.id ? 'Copied!' : 'Copy Code'}
          </Button>

          <Button variant={'default'}>
            Share
          </Button>
          </div>

        </div>
      ))}
    </div>
  )
}

export default Feed