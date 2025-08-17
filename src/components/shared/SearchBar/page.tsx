"use client"

import { Input } from "@/components/ui/input"
import React, { useCallback } from "react"
import { debounce } from "lodash"
import { useRouter, useSearchParams } from "next/navigation"


export const SearchBar= () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const applyFilter = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("search", value) 
      } else {
        params.delete("search") 
      }

      router.push(`/feed?${params.toString()}`)
    }, 300),
    [router, searchParams]
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    applyFilter(value)
  }

  return (
    <div>
      <Input
        placeholder="Search code snippets..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={handleChange}
      />
    </div>
  )
}
