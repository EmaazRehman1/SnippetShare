'use client'

import React from 'react'
import { useUser } from '@/common/hooks/useUser'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

const Profile = () => {
 const { user } = useUser()

 if (!user) {
   return (
     <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
       <p className="text-gray-400">Loading profile...</p>
     </div>
   )
 }

 return (
   <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white px-6 py-12">
     {/* Profile Image */}
     <img
       src={user.image ?? 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
       alt={user.name ?? 'Profile Image'}
       width={120}
       height={120}
       className="rounded-full shadow-lg mb-6 border-4 border-gray-700"
     />

     {/* Name + Email */}
     <h1 className="text-3xl font-bold">{user.name}</h1>
     <p className="text-gray-400 text-lg mb-8">{user.email}</p>

     {/* Actions */}
     <Button
       variant="destructive"
       className="flex items-center gap-2 px-6 py-3 rounded-xl text-lg"
       onClick={() => signOut()}
     >
       <LogOut size={18} /> Logout
     </Button>
   </div>
 )
}

export default Profile