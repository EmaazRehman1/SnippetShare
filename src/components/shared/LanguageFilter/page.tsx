'use client'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LanguageSelector } from '../LanguageSelector'

export const LanguageFilter = ({ language }: { language: string }) => {
    const router=useRouter()
    const searchParams=useSearchParams()

    const [SelectedLanguage,setSelectedLanguage] = useState(searchParams.get("language") || "javascript");

    const handleChange = (value: string) => {
        setSelectedLanguage(value)
        const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("language", value) 
      } else {
        params.delete("language") 
      }

      router.push(`/feed?${params.toString()}`)
    }

  return (
    <div><LanguageSelector value={language} onChange={handleChange} /></div>
  )
}
