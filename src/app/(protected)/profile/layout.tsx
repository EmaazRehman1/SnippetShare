import { ProfileSidebar } from "@/components/shared/ProfileSidebar/Page"
type Props={
    children: React.ReactNode
}
export default async function ProfileLayout({ children }: Props) {
    return (
        <div className="flex flex-col md:flex-row">
            <ProfileSidebar />
            <main className="w-full">{children}</main>
        </div>
  )
}
