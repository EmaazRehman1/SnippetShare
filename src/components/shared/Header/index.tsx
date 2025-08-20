'use client'
import { Button } from '@/components/ui/button'
import { useUser } from '@/common/hooks/useUser'
import { Home, Icon, Menu, MenuIcon, PlusSquare, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
export const Header = () => {
  const { user, signOut } = useUser()
  const [mobile, setMobile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  const links = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "Create Snippet", href: "/create-snippet", icon: PlusSquare },
    { name: "Profile", href: "/profile", icon: User }
  ]
  const currentLocation = usePathname()

  const HandleSignout = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }


  return (
    <header className={`w-full px-6 py-3 bg-gray-900 text-white flex items-center justify-between shadow-md sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-gray-800 py-2 shadow-lg" : "bg-gray-900 py-4"}`}>
      <div className="flex items-center gap-2 justify-center">
        <Image
          src="/logo.png"
          alt="SnippetShare Logo"
          width={40}
          height={40}
        />
        <h1 className="text-xl tracking-wide font-semibold">
          SnippetShare
        </h1>
      </div>


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
          {loading ? 'Signing Out...' : 'Sign Out'}
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
