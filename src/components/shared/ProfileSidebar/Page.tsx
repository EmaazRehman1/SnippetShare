"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, Code2, Bookmark, Menu, X,Lock } from "lucide-react"
import { useState } from "react"

export const ProfileSidebar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/profile/snippets", label: "My Snippets", icon: Code2 },
    { href: "/profile/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/profile/env-files", label: "Env Files", icon: Lock },


  ]

  return (
    <div >
      <div className="md:hidden flex items-center justify-between bg-gray-900 p-4 shadow-lg">
        <h2 className="text-lg font-bold text-white">Profile</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-gray-900 p-6 shadow-xl z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="hidden md:block text-xl font-bold text-white border-b border-gray-700 pb-3">
          Profile
        </h2>

        <ul className="mt-6 space-y-2">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)} 
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 md:hidden"
        />
      )}
    </div>
  )
}
