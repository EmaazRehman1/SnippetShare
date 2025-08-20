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
            <main className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">{children}</main>
        </SessionProvider>
  )
}
