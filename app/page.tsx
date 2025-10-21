import { AdventureWorksApp } from "@/components/adventure-works-app"
import { auth0 } from "@/lib/auth0"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth0.getSession()

  if(!session?.user) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-background">
      <AdventureWorksApp />
    </main>
  )
}
