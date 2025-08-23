'use client'
import React, { useEffect, useState } from 'react'
import { Plus, Copy, Trash2, Edit3, Download } from 'lucide-react'
import { Button } from '@/components/ui/button';
import AddModal from '@/components/shared/AddEnv/page';
import EditModal from '@/components/shared/EditEnv/page';
import { toast } from 'sonner';

interface Snippet {
  id: string;
  title: string;
  code: string;
  authorId?: string
}

const EnvFiles = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newSnippet, setNewSnippet] = useState<Omit<Snippet, 'id'>>({
    title: '',
    code: ''
  })
  const [isAddOpen, setisAddOpen] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)



  const handleDeleteSnippet = async (id: string) => {
    const resp = await fetch(`/api/envfiles/${id}`, {
      method: 'DELETE'
    });
    if (resp.ok) {
      setSnippets(snippets.filter(snippet => snippet.id !== id))
      toast.success("Snippet deleted successfully")
    }
  }

  const handleEditSnippet = (id: string) => {
    setIsEditOpen(true)
    const snippet = snippets.find(s => s.id === id)
    if (snippet) {
      setNewSnippet({ title: snippet.title, code: snippet.code })
      setEditingId(id)
    }
  }


  const handleCopyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Copied to clipboard!')

    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }


  useEffect(() => {
    getSnippets()
  }, [])

  const handleAdd = async () => {
    await getSnippets()
  }

  const getSnippets = async () => {

    try {
      setLoading(true)
      const response = await fetch('/api/envfiles')
      if (!response.ok) throw new Error('Failed to fetch snippets')
      const data = await response.json()
      setSnippets(data.data)
    } catch (error) {
      console.error('Error fetching snippets:', error)
    } finally {
      setLoading(false)

    }
  }

  const handleEdit = async () => {
    await getSnippets()
  }

  const handleDownloadSnippet = (snippet: Snippet) => {
  const element = document.createElement("a");
  const file = new Blob([snippet.code], { type: "application/octet-stream" });

  const safeTitle = snippet.title.replace(/\s+/g, "_").toLowerCase();

  element.href = URL.createObjectURL(file);
  element.download = `.env.${safeTitle}`; 
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element); 
  URL.revokeObjectURL(element.href); 
  toast.success(`Env downloaded successfully as .env.${safeTitle}`);
};


  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <div className='flex flex-col gap-5 md:flex-row'>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Environment Files</h1>
          <Button onClick={() => setisAddOpen(true)} >Add new env</Button>
        </div>

        <p className="text-gray-600">Manage your environment configuration snippets</p>
      </div>
      {isAddOpen && (
        <AddModal
          isOpen={isAddOpen}
          onClose={() => setisAddOpen(false)}
          onSubmit={handleAdd}
        />
      )}
      {isEditOpen && (
        <EditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEdit}
          env={snippets.find(s => s.id === editingId)!}
        />
      )}
      {!loading && snippets.length === 0 && (
        <div className="flex justify-center items-center">
          {/* <div className="w-8 h-8 border-4 border-gray-500 border-dashed "></div> */}
          <span className="ml-3 text-gray-900">No Env files stored</span>
        </div>
      )}

      {loading && (
         <div className="flex justify-center items-center h-screen">
          <div className="w-8 h-8 border-4 border-gray-500 border-dashed rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-500">Loading...</span>
        </div>
      )}

      {!loading && snippets.length > 0 && (
        <div className="grid gap-6">
          <div className='flex gap-3'>

          </div>
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{snippet.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(snippet.code)}
                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditSnippet(snippet.id)}
                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                    title="Edit snippet"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSnippet(snippet.id)}
                    className="p-2 hover:bg-gray-700 rounded-md transition-colors text-red-300 hover:text-red-200"
                    title="Delete snippet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadSnippet(snippet)}
                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                    title="Download snippet"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-0">
                <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnvFiles