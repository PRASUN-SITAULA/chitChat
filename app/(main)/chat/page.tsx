import Chat from './_components/Chat'
import { ClerkProvider } from '@clerk/nextjs'

export default function Dashboard() {
  return (
    <ClerkProvider dynamic>
      <Chat />
    </ClerkProvider>
  )
}
