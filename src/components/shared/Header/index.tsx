'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@/common/hooks/useUser'
import { Home, Icon, Menu, MenuIcon, PlusSquare } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { usePathname } from 'next/navigation'
export const Header = () => {
  const { user, signOut } = useUser()
  const [mobile, setMobile] = useState(false)
  const [loading,setLoading]=useState(false)
  const links = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "Create Snippet", href: "/create-snippet", icon: PlusSquare },
  ]
  const currentLocation = usePathname()

  const HandleSignout=async()=>{
    setLoading(true)
    await signOut()
    setLoading(false)
  }
  

  return (
    <header className="w-full px-6 py-3 bg-gray-900 text-white flex items-center justify-between shadow-md">
      <h1 className="text-xl font-semibold tracking-wide">
        SnippetShare
      </h1>

      <nav className="hidden md:flex gap-6 items-center justify-center">
        {links.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={currentLocation === href ? "flex items-center gap-2 underline transition" : "flex items-center gap-2 text-gray-100 hover:text-gray-400 transition"}
          >
            <Icon size={18} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <p className='text-sm'>
          {user?.name}
        </p>
        <Button
          onClick={HandleSignout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors duration-200"
          disabled={loading}
        >
          Sign Out
        </Button>
      </div>


      {/* mobile */}
      <div className='md:hidden flex justify-center items-center gap-4'>
        <Sheet open={mobile} onOpenChange={setMobile}>
          <SheetTrigger asChild>
              <MenuIcon size={24} className='hover:text-gray-400 transition cursor-pointer' />
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 text-white">
            <SheetHeader>
              <SheetTitle className="text-white font-semibold">SnippetShare </SheetTitle>
            </SheetHeader>
            <div className="mt-2 px-7 flex flex-col gap-4">
              {links.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={currentLocation === href ? "flex items-center gap-2 underline transition" : "flex items-center gap-2 text-gray-100 hover:text-gray-400 transition"}

                  onClick={() => setMobile(false)}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </Link>
              ))}
              <Button
                onClick={HandleSignout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                disabled={loading}
              >
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>




    </header>
  )
}
