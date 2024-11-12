import { createUser } from '@/actions/user'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SetupPage() {
  const res = await createUser()
  if (res.success) {
    redirect('/chat')
  }
  if (res.error) {
    return <div>Error creating user: {res.error}</div>
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Setting up your application</h1>
        <p className="text-muted-foreground">Please wait a few seconds...</p>
      </div>
    </div>
  )
}
