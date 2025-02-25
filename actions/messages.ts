'use server'
import prisma from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { getChannelName } from '@/lib/utils/getChannelName'
import { currentUser } from '@clerk/nextjs/server'
import { revalidateTag, unstable_cache } from 'next/cache'

export async function sendMessage(
  receiverId: string,
  content?: string,
  imageUrl?: string,
) {
  try {
    const user = await currentUser()
    if (!user) {
      return { error: 'Unauthorized User' }
    }
    if (!content && !imageUrl) {
      return { error: 'No content or image provided' }
    }
    const message = await prisma.message.create({
      data: {
        content: content,
        messageImageUrl: imageUrl,
        senderId: user.id,
        receiverId: receiverId,
      },
      include: {
        sender: true,
      },
    })
    revalidateTag('getMessages')
    // Trigger Pusher event for real-time update
    const channelName = getChannelName(user.id, receiverId)
    // Trigger Pusher event for real-time update
    await pusherServer.trigger(
      channelName, // Channel
      'new-message', // Event name
      { message }, // Data
    )
    return { success: 'Message sent', message }
  } catch (error) {
    console.error(error)
    return { error: 'Error sending message' }
  }
}

export const getMessages = unstable_cache(
  async (conversationWithUserId: string, userId: string) => {
    try {
      if (!userId) {
        return { error: 'Unauthorized User' }
      }
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              AND: [
                { senderId: userId },
                { receiverId: conversationWithUserId },
              ],
            },
            {
              AND: [
                { senderId: conversationWithUserId },
                { receiverId: userId },
              ],
            },
          ],
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: true,
        },
      })
      return { success: 'Messages retrieved', messages }
    } catch (error) {
      console.error(error)
      return { error: 'Error retrieving messages' }
    }
  },
  ['getMessages'],
  {
    tags: ['getMessages'],
  },
)

export async function sendGroupMessage(
  groupId: string,
  userId: string,
  content?: string,
  imageUrl?: string,
) {
  try {
    if (!userId) {
      return { error: 'Unauthorized User' }
    }
    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        groupId,
        messageImageUrl: imageUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    })
    // Get the group members to trigger notifications
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!group) {
      return { error: 'Group not found' }
    }

    // Trigger real-time updates for all group members
    const groupChannelName = `group-${groupId}`
    await pusherServer.trigger(groupChannelName, 'new-group-message', {
      message,
      groupId,
    })

    // Trigger individual notifications for group members
    for (const member of group.members) {
      if (member.id !== userId) {
        const notificationChannel = `notifications-${member.id}`
        await pusherServer.trigger(notificationChannel, 'new-notification', {
          type: 'group-message',
          groupId,
          message,
        })
      }
    }

    revalidateTag('getGroupMessages')
    return { success: 'Message sent', message }
  } catch (error) {
    console.error('Error sending group message:', error)
    return { error: 'Failed to send message' }
  }
}

export const getGroupMessages = unstable_cache(
  async (groupId: string, userId: string) => {
    try {
      if (!userId) {
        return { error: 'Unauthorized User' }
      }
      const messages = await prisma.message.findMany({
        where: {
          groupId,
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      })
      return { success: 'Messages retrieved', messages }
    } catch (error) {
      console.error(error)
      return { error: 'Error retrieving messages' }
    }
  },
  ['getGroupMessages'],
  {
    tags: ['getGroupMessages'],
  },
)
