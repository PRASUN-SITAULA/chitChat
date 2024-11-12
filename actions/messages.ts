'use server'
import prisma from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

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
    return { success: 'Message sent', message }
  } catch (error) {
    console.error(error)
    return { error: 'Error sending message' }
  }
}
