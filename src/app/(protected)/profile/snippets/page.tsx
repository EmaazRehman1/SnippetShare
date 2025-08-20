'use client'
import { useUser } from '@/common/hooks/useUser'
import { SearchBar } from '@/components/shared/SearchBar/page'
import { Snippet } from '@/components/shared/Snippet/page'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
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
    const [snippets,setSnippets]=useState<Snippet[]>([])
    const {user}=useUser()
    
    useEffect(() => {
        const fetchSnippets = async () => {
            const response = await fetch(`/api/snippets?userId=${user?.id}`);
            const data = await response.json();
            console.log("Fetched snippets:", data);
            setSnippets(data.snippets);
        };

        fetchSnippets();
    }, []);

  return (
    <div className='w-full flex justify-center items-center flex-col'>
        
        <h2 className="text-2xl font-semibold mb-1 p-3">My Snippets</h2>
        <div className='w-100'>
        <SearchBar/>

        </div>
        <ul className="space-y-4">
           {snippets.map((snippet) => (
                <li key={snippet.id} className="p-4 border rounded-md">
                    <Snippet snippet={snippet} />
                </li>
            ))}
        </ul>
    </div>
  )
}

export default MySnippets
