'use server'

import prisma from '@/lib/db'
import { revalidateTag } from 'next/cache'
import { unstable_cache } from 'next/cache'
import fs from 'fs/promises'

export async function createGroup(
  formData: FormData,
  memberIds: string[],
  ownerId: string,
) {
  const name = formData.get('name') as string
  const groupImage = formData.get('groupImage') as File
  const fileName = `${Date.now()}_${groupImage.name}`
  const filePath = `./public/group/${fileName}`
  try {
    const arrayBuffer = await groupImage.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    await fs.mkdir('./public/group', { recursive: true })
    await fs.writeFile(filePath, buffer)
    const group = await prisma.group.create({
      data: {
        name,
        ownerId,
        members: {
          connect: [...memberIds, ownerId].map((id) => ({ id })),
        },
        imageUrl: fileName,
      },
      include: {
        members: true,
      },
    })
    revalidateTag('getGroups')
    return { success: 'Group created successfully', group }
  } catch (error) {
    await fs.rm(filePath)
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
              createdAt: 'asc',
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

export async function AddMembersToGroup(groupId: string, memberIds: string[]) {
  try {
    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          connect: [...memberIds].map((id) => ({ id })),
        },
      },
    })
    revalidateTag('getGroups')
    return { success: 'Members added successfully' }
  } catch (error) {
    console.error('Error adding members to group:', error)
    return { error: 'Failed to add members to group' }
  }
}
