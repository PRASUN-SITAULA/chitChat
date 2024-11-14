'use server'
import prisma from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { getChannelName } from '@/lib/utils/getChannelName'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

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
    revalidatePath('/chat')
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

export const getMessages = cache(async (conversationWithUserId: string) => {
  try {
    const user = await currentUser()
    if (!user) {
      return { error: 'Unauthorized User' }
    }
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: user.id },
              { receiverId: conversationWithUserId },
            ],
          },
          {
            AND: [
              { senderId: conversationWithUserId },
              { receiverId: user.id },
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
})
