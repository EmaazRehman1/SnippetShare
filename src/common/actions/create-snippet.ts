'use server'
import { db } from "@/lib/db"
export const createSnippetAction = async (data:any) => {
    try{
        const resp= await db.snippet.create({data})
        console.log("main resp",resp)

    }catch(error:any){
        console.log(error)
        throw new Error(error)
    }

}