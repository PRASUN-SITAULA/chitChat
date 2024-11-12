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
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    await client.users.deleteUser(userId)
    return { error: 'Error creating user' }
  }
}

export async function searchUsers(
  query: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
        take: limit,
        skip: skip,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.user.count({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
      }),
    ])

    const hasMore = skip + users.length < total

    return {
      success: 'Users fetched successfully',
      users,
      hasMore,
      total,
    }
  } catch (error) {
    console.error('Search error:', error)
    return { error: 'Error fetching users' }
  }
}
