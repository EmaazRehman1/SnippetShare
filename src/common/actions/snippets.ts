'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export const createSnippetAction = async (data: any) => {
  try {
    const resp = await db.snippet.create({ data })
    revalidatePath('/feed')

    return {
      success: true,
      message: "Snippet created successfully!",
      snippet: resp
    }

  } catch (error: any) {
    console.error("Error creating snippet:", error)

    return {
      success: false,
      message: "Failed to create snippet",
      error: error.message || "Unknown error"
    }
  }
}


export const getAllSnippets = async () => {
  try {
    const snippets = await db.snippet.findMany(
      {
        include: {
          author: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    );
    return {
      success: true,
      snippets,
      message: "Snippets fetched successfully"
    }

  } catch (error: any) {
    console.error("Error fetching snippets:", error)
    return {
      success: false,
      message: "Failed to fetch snippets",
      error: error.message || "Error"
    }
  }
}
