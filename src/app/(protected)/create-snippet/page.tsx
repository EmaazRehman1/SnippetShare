'use client'

import { z } from 'zod'
import { formSchema } from './_form-schema'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import CodeEditor from '@/components/shared/CodeEditor'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { useUser } from '@/common/hooks/useUser'
import { createSnippetAction } from '@/common/actions/snippets'
import { toast } from 'sonner'

const CreateSnippet = () => {
    const { user } = useUser();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            language: '',
            code: '',
            title: '',
            description: '',
            tags: ''
        }
    })

    const selectedLanguage = form.watch('language')

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!selectedLanguage) {
            toast.error('Please select a language first')
            return
        }

        let finalTags: string[] = [];
        if (data.tags) {
            finalTags = data.tags.split(',').map((tag) => tag.trim())
        }
        const body = { ...data, authorId: user?.id, tags: finalTags }
        
        try {
            const resp = await createSnippetAction(body)
            if (resp.success) {
                toast.success(resp.message)
                form.reset({
                    code: '',
                    title: '',
                    description: '',
                    language: '',
                    tags: ''
                });
            }
        } catch (error: any) {
            toast.error("Failed to create snippet")
            console.log(error)
        }
    }

    return (
        <div className="w-full flex justify-center items-center mt-6 flex-col">
            <h2 className="text-xl font-semibold mb-6">Create Snippet</h2>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col md:flex-row gap-6 w-full max-w-6xl px-4 mt-6"
                >
                    {/* Left side - Code Editor */}
                    <div className="flex-1">
                        <FormField
                            name="language"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Language *</FormLabel>
                                    <FormControl>
                                        <LanguageSelector 
                                            value={field.value} 
                                            onChange={field.onChange} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedLanguage ? (
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="h-full">
                                        <FormLabel>Code *</FormLabel>
                                        <FormControl>
                                            <div className="rounded-md overflow-hidden border mt-2">
                                                <CodeEditor
                                                    language={selectedLanguage}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    height="350px"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-[350px] border rounded-md bg-muted/50">
                                <p className="text-muted-foreground">
                                    Please select a language to start coding
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right side - Form fields */}
                    <div className="flex-1 flex flex-col gap-4">
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter snippet title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your snippet..."
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="tags"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. react, typescript, hooks"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Add comma-separated tags
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button 
                            type="submit" 
                            className="mt-4 w-full"
                            disabled={!selectedLanguage}
                        >
                            Save Snippet
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CreateSnippet