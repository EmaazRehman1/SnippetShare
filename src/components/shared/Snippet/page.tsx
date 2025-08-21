import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import CodeEditor from '../CodeEditor';

interface SnippetProps {
    id: string
    title: string;
    description?: string;
    code: string;
    author: {
        name: string,
        email: string
    }
    createdAt: Date;
    tags: string[]
    language: string

}

export const Snippet = ({ snippet }: { snippet: SnippetProps }) => {
    const [copied, setCopied] = useState("")


    const handlecopy = (code: string, id: string) => () => {
        navigator.clipboard.writeText(code)
        setCopied(id)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: snippet.title,
                    text: `Here's my code from SnippetShare\n\n*Title*: ${snippet.title}\n\n*Code*:\n${snippet.code}`,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            alert("Sharing is not supported on this browser. Copy the code manually!");
        }
    };




    return (
        <div key={snippet.id} className="bg-gray-200 rounded-lg shadow-md border border-gray-200 overflow-hidden">
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

            <div className="p-6">
                <CodeEditor
                    value={snippet.code}
                    language={snippet.language}
                    height="200px"
                    snippet={snippet}
                />
            </div>

            <div className='w-full flex justify-end items-center p-4 gap-2'>

                <Button variant={'outline'} onClick={handlecopy(snippet.code, snippet.id)}>
                    {copied === snippet.id ? 'Copied!' : 'Copy Code'}
                </Button>

                <Button variant={'default'} onClick={handleShare}>
                    Share
                </Button>
            </div>

        </div>
    )
}
