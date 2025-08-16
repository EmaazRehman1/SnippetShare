import CodeEditor from '@/components/shared/CodeEditor'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import React from 'react'

const Feed = () => {
  return (
    <div>
      <LanguageSelector/>
      <CodeEditor language='python' value='console.log("Hello, world!");'/>
    </div>
  )
}

export default Feed