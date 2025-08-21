'use client'
import { useUser } from '@/common/hooks/useUser'
import { SearchBar } from '@/components/shared/SearchBar/page'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import CodeEditor from '@/components/shared/CodeEditor'

interface Snippet {
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

const MySnippets = () => {
    const [snippets, setSnippets] = useState<Snippet[]>([])
    const { user } = useUser()

    useEffect(() => {
        const fetchSnippets = async () => {
            if (!user) return;
            const response = await fetch(`/api/snippets?userId=${user.id}`);
            const data = await response.json();
            console.log("Fetched snippets:", data);
            setSnippets(data.snippets);
        };

        fetchSnippets();
    }, [user]);

    return (
        <div className='w-full flex flex-col items-center p-6'>
            <h2 className="text-3xl font-semibold mb-4">My Snippets</h2>
            <ul className='w-full max-w-4xl space-y-4'>
                {snippets.map((snippet) => (
                    <li
                        key={snippet.id}
                        className="p-5 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">{snippet.title}</h3>
                            <span className="text-sm text-gray-500">{new Date(snippet.createdAt).toLocaleDateString()}</span>
                        </div>
                        {snippet.description && <p className="text-gray-700 mb-2">{snippet.description}</p>}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">Author: {snippet.author.name}</span>
                            <span className="text-sm font-medium text-gray-600">Email: {snippet.author.email}</span>
                            <span className="text-sm font-medium text-gray-600">Language: {snippet.language}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {snippet.tags.map((tag, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                        <div className='flex justify-end items-center gap-3'>

                        <Button variant={'destructive'}>Delete</Button>
                        <Dialog>
                            <DialogTrigger>
                                <Button >Edit</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogDescription>
                                        <CodeEditor value={snippet.code} language={snippet.language} />
                                    </DialogDescription>
                                    <Button className='bg-green-600 hover:bg-green-800 cursor-pointer'>Save</Button>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        </div>
                    </li>
                ))}
            </ul>

        </div>

    )
}

export default MySnippets

