// 'use server'

// import { db } from "@/lib/db"
// import { Description } from "@radix-ui/react-dialog"
// import { eq } from "lodash"
// import { revalidatePath } from "next/cache"

// export const createSnippetAction = async (data: any) => {
//   try {
//     const resp = await db.snippet.create({ data })
//     revalidatePath('/feed')

//     return {
//       success: true,
//       message: "Snippet created successfully!",
//       snippet: resp
//     }

//   } catch (error: any) {
//     console.error("Error creating snippet:", error)

//     return {
//       success: false,
//       message: "Failed to create snippet",
//       error: error.message || "Unknown error"
//     }
//   }
// }


// export const getAllSnippets = async (page: number, limit = 4,searchText?:string,language?:string) => {
//   const skipRecords= (page-1)*limit

//   try {
//    const filters: any = {
//       isPublic: true,
//       // language:{
//       //   eq:language
//       // },
//       ...(searchText
//         ? {
//             OR: [
//               {
//                 title: {
//                   contains: searchText,
//                   mode: "insensitive",
//                 },
//               },
//               {
//                 description: {
//                   contains: searchText,
//                   mode: "insensitive",
//                 },
//               },
//             ],
//           }
//         : {}),
//     }
//     if(!!language){
//       filters['language'] = {
//         equals: language
//       }
//     }
//     const total=await db.snippet.count({
//       where: filters
//     })
//     const snippets = await db.snippet.findMany(
//       {
//         where: filters,
//         include: {
//           author: {
//             select: {
//               name: true,
//               email: true,
//             }
//           }
//         },
//         orderBy: {
//           createdAt: 'desc'
//         },
//         skip: skipRecords,
//         take: limit
//       }
//     );
//     return {
//       success: true,
//       snippets,
//       message: "Snippets fetched successfully",
//        pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     }

//   } catch (error: any) {
//     console.error("Error fetching snippets:", error)
//     return {
//       success: false,
//       message: "Failed to fetch snippets",
//       error: error.message || "Error"
//     }
//   }
// }
