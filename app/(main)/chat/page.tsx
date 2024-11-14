import { getFriends } from '@/actions/user'
import Chat from './_components/Chat'
import { ClerkProvider } from '@clerk/nextjs'

export default async function ChatPage() {
  const res = await getFriends()
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
