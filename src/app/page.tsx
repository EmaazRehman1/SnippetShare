'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
// import { signIn } from "@/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
export default function Home() {
  const [githubLoad,setGithubLoad]=useState(false)
  const handleSignIn=async()=>{
    setGithubLoad(true)
    await signIn("github");
    // setGithubLoad(false);
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
     <Button onClick={handleSignIn} disabled={githubLoad}>
      {githubLoad ? "Loading..." : <><Github /> <span>Sign In with Github</span></>}
     </Button>
    </div>
  );
}
