import { getFriends } from '@/actions/user'
import Chat from './_components/Chat'
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getGroups } from '@/actions/group'

export default async function ChatPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  const friendsActionRes = await getFriends(userId)
  if (friendsActionRes.error) {
    return null
  }
  if (!friendsActionRes.friends) {
    return <div>You do not have any friends, yet.</div>
  }
  const groupActionRes = await getGroups(userId)
  if (groupActionRes.error) {
    return null
  }
  if (!groupActionRes.groups) {
    return <div>You do not have any groups, yet.</div>
  }
  return (
    <ClerkProvider dynamic>
      <Chat
        friends={friendsActionRes.friends}
        userId={userId}
        groups={groupActionRes.groups}
      />
    </ClerkProvider>
  )
}
