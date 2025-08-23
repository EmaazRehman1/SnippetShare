import { useUser } from "@/common/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit:()=>void;
}

const AddModal = ({ isOpen, onClose ,onSubmit}: Props) => {
    const [title, setTitle] = useState("")
    const [code, setCode] = useState("")
    const [loading,setLoading]=useState(false)
    const {user}=useUser()

    const handleAdd=async()=>{
        try{
            setLoading(true)
            const resp=await fetch('/api/envfiles',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    code,
                    authorId: user?.id
                })

            })
            if(resp.ok){
                const data=await resp.json()
                toast.success(data.message || "Env file added successfully")
                onClose()
                onSubmit()
            }

        }catch(error){
            console.log(error)
            toast.error("Failed to upload env")
        }finally{
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-200">
                <DialogHeader>
                    <DialogTitle>Add New Environment Variable file</DialogTitle>
                    <DialogDescription>
                        Add a new environment variable file to your collection.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Development Environment"
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Environment Variables
                    </label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="NODE_ENV=development&#10;DB_HOST=localhost&#10;API_KEY=your-api-key"
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent font-mono text-sm"
                    />
                </div>

                <DialogFooter>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            className="px-4 py-2 rounded-md border"
                            variant={"outline"}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} className="px-4 py-2 rounded-md">
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddModal;
