import { Prisma, User } from '@prisma/client'
type MessageType = Prisma.MessageGetPayload<{ include: { sender: true } }>

export interface FriendsTypes {
  id: string
  name: string
  imageUrl: string | null
}

export interface GroupType {
  id: string
  name: string
  imageUrl: string | null
  members: User[]
  messages: MessageType[]
}
