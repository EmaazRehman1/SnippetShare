'use client'
// import React from 'react'
import { useSession,signOut } from 'next-auth/react'
// import { Button } from '../ui/button'
import { Button } from '@/components/ui/button'
    
export const Header = () => {
  const { data: session } = useSession()
  const user = session?.user
  return (
    <header>
      <h1>Welcome, {user?.name}</h1>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </header>
  )
}
