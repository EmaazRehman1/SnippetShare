"use client"

import { Input } from "@/components/ui/input"
import React, { useCallback, useEffect } from "react"
import { debounce } from "lodash"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"


export const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = React.useState(searchParams.get("search") ?? "")

  useEffect(() => {
    setValue(searchParams.get("search") ?? "")
  }, [searchParams])

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
    setValue(value)
    applyFilter(value)
  }

  return (
    <div>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search code snippets..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={handleChange}
          value={value}
          className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-300 shadow-sm 
               placeholder:text-gray-700 focus:border-blue-500 
               focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />
      </div>
    </div>
  )
}
