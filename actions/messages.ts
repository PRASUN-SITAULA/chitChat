'use server'
import prisma from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { getChannelName } from '@/lib/utils/getChannelName'
import { currentUser } from '@clerk/nextjs/server'
import { revalidateTag, unstable_cache } from 'next/cache'

export async function sendMessage(receiverId: string, content: string) {
  try {
    const user = await currentUser()
    if (!user) {
      return { error: 'Unauthorized User' }
    }
    const message = await prisma.message.create({
      data: {
        content: content,
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
