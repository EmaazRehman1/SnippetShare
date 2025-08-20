'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Home() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSignIn = async (provider: "github" | "google") => {
    setLoadingProvider(provider)
    await signIn(provider)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      {/* Logo + Title */}
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/logo.png"
          alt="SnippeShare Logo"
          width={80}
          height={80}
          className="rounded-xl shadow-md"
        />
        <h1 className="text-4xl font-bold tracking-tight">SnippetShare</h1>
        <p className="text-gray-400 text-lg max-w-md text-center">
          Share code snippets with your team and securely store environment
          variables.
        </p>
      </div>

      {/* Auth Buttons */}
      <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
        {/* GitHub */}
        <Button
          onClick={() => handleSignIn("github")}
          disabled={loadingProvider === "github"}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg shadow-lg bg-white text-black hover:bg-gray-100"
        >
          {loadingProvider === "github" ? (
            "Loading..."
          ) : (
            <>
              <Github className="w-5 h-5" />
              <span>Sign in with GitHub</span>
            </>
          )}
        </Button>

        {/* Google */}
        <Button
          onClick={() => handleSignIn("google")}
          disabled={loadingProvider === "google"}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg shadow-lg bg-white text-black hover:bg-gray-100"
        >
          {loadingProvider === "google" ? (
            "Loading..."
          ) : (
            <>
              <FcGoogle className="w-5 h-5" />
              <span>Sign in with Google</span>
            </>
          )}
        </Button>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} SnippetShare. All rights reserved.
      </footer>
    </div>
  )
}
