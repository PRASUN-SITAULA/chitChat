import { getFriends } from '@/actions/user'
import Chat from './_components/Chat'
import { ClerkProvider } from '@clerk/nextjs'

export default async function ChatPage() {
  const res = await getFriends()
  if (res.error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>{res.error}</p>
      </div>
    )
  }
  return (
    <ClerkProvider dynamic>
      <Chat friends={res.friends} />
    </ClerkProvider>
  )
}
