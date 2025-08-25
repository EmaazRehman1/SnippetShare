import { auth } from "@/auth"
import { SessionProvider, SessionProviderProps } from "next-auth/react"
import { Header } from "@/components/shared/Header"
type Props={
    children: React.ReactNode
}
export default async function ProtectedLayout({ children }: Props) {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <Header />
            <main className="min-h-screen bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">{children}</main>
        </SessionProvider>
  )
}
