import { getFriends } from '@/actions/user'
import Chat from './_components/Chat'
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function ChatPage() {
  const { userId } = await auth()
  const res = await getFriends(userId)
  if (res.error) {
    return null
  }
  if (!res.friends) {
    return <div>You do not have any friends, yet.</div>
  }
  return (
    <ClerkProvider dynamic>
      <Chat friends={res.friends} />
    </ClerkProvider>
  )
}
