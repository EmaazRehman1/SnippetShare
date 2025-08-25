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
// import { createSnippetAction } from '@/common/actions/snippets'
import { toast } from 'sonner'
import { head } from 'lodash'

const CreateSnippet = () => {
    const { user } = useUser();
    console.log('user',user)
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
            const resp = await fetch('api/snippets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)

            })
            if(resp.status !== 200) {
                const errorData = await resp.json();
                toast.error(errorData.message || "Failed to create snippet");
                return;
            }
            const data=await resp.json();
            toast.success(data.message || "Snippet created successfully!");

            form.reset({
                code: '',
                title: '',
                description: '',
                language: '',
                tags: ''
            });

        } catch (error: any) {
            toast.error("Failed to create snippet")
            console.log(error)
        }
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center flex-col py-8 px-4">
            <div className="mb-8 text-center">
                <div className="inline-block rounded-2xl ">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Code Snippet</h2>
                    <p className="text-gray-700">Build and share your code with the community</p>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl"
                >
                    <div className="flex-1 backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl border border-white/30">
                        <FormField
                            name="language"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel className="text-lg font-semibold text-gray-800">
                                        Programming Language *
                                    </FormLabel>
                                    <FormControl>
                                        <div className="bg-white/50 rounded-lg border border-white/50">
                                            <LanguageSelector
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />

                        {selectedLanguage ? (
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="h-full">
                                        <FormLabel className="text-lg font-semibold text-gray-800">
                                            Your Code *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="rounded-xl overflow-hidden border-2 border-white/50 mt-3 shadow-lg">
                                                <CodeEditor
                                                    language={selectedLanguage}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    height="400px"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-white/50 rounded-xl bg-white/10 mt-3">
                                <div className="text-center">
                                    <div className="text-4xl mb-4 text-gray-600">💻</div>
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Ready to code?
                                    </p>
                                    <p className="text-gray-600">
                                        Select a programming language to get started
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl border border-white/30">
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Snippet Details</h3>
                                <p className="text-gray-600 text-sm mt-1">Add information about your code</p>
                            </div>

                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800">
                                            Title *
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="e.g. React useEffect Hook Example" 
                                                className="bg-white/50 border-white/50 text-gray-800 placeholder-gray-600 h-12 text-base rounded-lg focus:bg-white/70 transition-all"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800">
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Explain what your code does, how to use it, or any special features..."
                                                className="bg-white/50 border-white/50 text-gray-800 placeholder-gray-600 resize-none rounded-lg focus:bg-white/70 transition-all min-h-[120px]"
                                                rows={5}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="tags"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800">
                                            Tags
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="react, hooks, javascript, frontend"
                                                className="bg-white/50 border-white/50 text-gray-800 placeholder-gray-600 h-12 text-base rounded-lg focus:bg-white/70 transition-all"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-600 text-sm">
                                            Add comma-separated tags to help others find your snippet
                                        </FormDescription>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-14 text-lg font-semibold text-white shadow-xl rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
                                disabled={!selectedLanguage}
                            >
                                Save Snippet
                                
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CreateSnippet