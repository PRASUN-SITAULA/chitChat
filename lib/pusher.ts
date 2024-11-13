import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

/* eslint-disable no-var */
declare global {
  var pusherServerInstance: PusherServer | undefined
  var pusherClientInstance: PusherClient | undefined
}
/* eslint-enable no-var */

if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  })
}
if (!global.pusherClientInstance) {
  global.pusherClientInstance = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      channelAuthorization: {
        endpoint: '/api/pusherAuth',
        transport: 'ajax',
      },
    },
  )
}

export const pusherServer = global.pusherServerInstance
export const pusherClient = global.pusherClientInstance
