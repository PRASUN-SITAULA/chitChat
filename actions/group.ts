'use server'

import prisma from '@/lib/db'
import { revalidateTag } from 'next/cache'
import { unstable_cache } from 'next/cache'

export async function createGroup(
  name: string,
  memberIds: string[],
  ownerId: string,
) {
  try {
    const group = await prisma.group.create({
      data: {
        name,
        ownerId,
        members: {
          connect: [...memberIds, ownerId].map((id) => ({ id })),
        },
      },
      include: {
        members: true,
      },
    })
    revalidateTag('getGroups')
    return { success: 'Group created successfully', group }
  } catch (error) {
    console.error('Error creating group:', error)
    return { error: 'Failed to create group' }
  }
}

export const getGroups = unstable_cache(
  async (userId: string) => {
    try {
      const groups = await prisma.group.findMany({
        where: {
          members: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          members: true,
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            include: {
              sender: true,
            },
          },
        },
      })
      return { success: 'Groups fetched successfully', groups }
    } catch (error) {
      console.error('Error fetching groups:', error)
      return { error: 'Failed to fetch groups' }
    }
  },
  ['getGroups'],
  {
    tags: ['getGroups'],
  },
)
