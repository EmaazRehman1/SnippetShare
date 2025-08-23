'use client'
import { useUser } from '@/common/hooks/useUser'
import { SearchBar } from '@/components/shared/SearchBar/page'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import CodeEditor from '@/components/shared/CodeEditor'
import { set } from 'lodash'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

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
    const [loading, setLoading] = useState(false)
    const [newCode, setNewCode] = useState<string>("")
    const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null)
    const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([])

    useEffect(() => {
        const fetchSnippets = async () => {
            if (!user) return;
            setLoading(true);

            try {
                const response = await fetch(`/api/snippets/${user.id}`);
                const data = await response.json();

                console.log("Fetched snippets:", data);

                if (data.success && Array.isArray(data.snippets)) {
                    setSnippets(data.snippets);
                    setFilteredSnippets(data.snippets);
                } else {
                    setSnippets([]);
                    setFilteredSnippets([]);
                }
            } catch (error) {
                console.error("Error fetching snippets:", error);
                setSnippets([]);
                setFilteredSnippets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSnippets();
    }, [user]);


    const handleDelete = async (id: string) => {
        setLoading(true);
        const response = await fetch(`/api/snippets/${id}`, {
            method: 'DELETE'
        })
        const data = await response.json();
        if (data.success) {
            setSnippets((prev) => prev.filter((snippet) => snippet.id !== id))
            toast.success("Snippet deleted successfully")
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-8 h-8 border-4 border-gray-500 border-dashed rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-500">Loading...</span>
            </div>
        )

    }

    const handleEdit = (value: string | undefined) => {
        setNewCode(value ?? "");
    };

    const handleSave = async (id: string) => {
        const response = await fetch(`/api/snippets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: newCode,
            }),
        });

        const data = await response.json();

        if (data.success) {
            setSnippets((prev) =>
                prev.map((snippet) =>
                    snippet.id === id ? { ...snippet, code: newCode } : snippet
                )
            );
            toast.success("Snippet updated successfully");
        } else {
            toast.error("Failed to update snippet");
        }
    };

    const handleSearch = (query: string) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = snippets.filter(snippet =>
            snippet.title.toLowerCase().includes(lowerCaseQuery) ||
            (snippet.description && snippet.description.toLowerCase().includes(lowerCaseQuery)) ||
            snippet.language.toLowerCase().includes(lowerCaseQuery) ||
            snippet.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
        );
        setFilteredSnippets(filtered);
        if (query === "") {
            setFilteredSnippets(snippets);
        }

    }


    return (
        <div className='w-full flex flex-col items-center p-6'>
            <h2 className="text-3xl font-semibold mb-4">My Snippets</h2>


            {filteredSnippets.length === 0 && !loading && (
                <p className="text-gray-800 mt-2">No snippets found</p>
            )}

            <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Search your snippets..."
                    className="pl-10 pr-4 py-2 w-full rounded-2xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                />
            </div>

            <ul className="w-full max-w-4xl space-y-4 mt-4">
                {filteredSnippets.length > 0 && filteredSnippets.map((snippet) => (
                    <div>


                        {/* <Input
                            placeholder='Search your snippets'
                            className='mb-5 rounded-2xl border border-gray-300'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                        /> */}
                        <li
                            key={snippet.id}
                            className="p-5 bg-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-2">

                                <h3 className="text-xl font-semibold">{snippet.title}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(snippet.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {snippet.description && (
                                <p className="text-gray-700 mb-2">{snippet.description}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Author: {snippet.author.name}</span>
                                <span className="text-sm font-medium text-gray-600">Email: {snippet.author.email}</span>
                                <span className="text-sm font-medium text-gray-600">Language: {snippet.language}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {snippet.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-end items-center gap-3">
                                <Button onClick={() => handleDelete(snippet.id)} variant="destructive">
                                    Delete
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Snippet</DialogTitle>
                                            <DialogDescription>
                                                Update the snippet code below.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <CodeEditor
                                            value={snippet.code}
                                            language={snippet.language}
                                            onChange={handleEdit}
                                        />

                                        <div className="flex justify-end gap-2 mt-4">
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button
                                                onClick={() => {
                                                    setCurrentSnippet(snippet);
                                                    handleSave(snippet.id);
                                                }}
                                                className="bg-green-600 hover:bg-green-800 cursor-pointer"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </li>
                    </div>

                ))}

            </ul>


        </div>

    )
}

export default MySnippets

