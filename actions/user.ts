'use server'
import prisma from '@/lib/db'
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'

export async function createUser() {
  const { userId } = await auth()
  if (!userId) {
    return { error: 'Unauthorized' }
  }

  const user = await currentUser()
  if (!user) {
    return { error: 'User not found' }
  }

  try {
    await prisma.user.create({
      data: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        name: user?.username || 'User',
      },
    })
    return { success: 'User created successfully' }
  } catch (error) {
    const client = await clerkClient()
    console.error('Error creating user:', error)
    client.users.deleteUser(userId)
    return { error: 'Error creating user' }
  }
}
