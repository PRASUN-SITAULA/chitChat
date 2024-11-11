import { auth, currentUser } from '@clerk/nextjs/server'
import { pusherServer } from '@/lib/pusherServer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await currentUser()
    // Get form data
    const body = await request.formData()
    const socketId = body.get('socket_id') as string
    const channel = body.get('channel_name') as string

    if (!socketId || !channel) {
      return NextResponse.json(
        { error: 'Socket id and channel are required' },
        { status: 400 },
      )
    }

    // Optional: Validate channel access
    if (channel.startsWith('private-chat.')) {
      const channelUserId = channel.split('.')[1]
      if (channelUserId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Authorize the channel
    const authResponse = pusherServer.authorizeChannel(socketId, channel, {
      user_id: userId,
      user_info: {
        name: user?.fullName,
        email: user?.primaryEmailAddress,
        image: user?.imageUrl,
      },
    })

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Pusher auth error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
