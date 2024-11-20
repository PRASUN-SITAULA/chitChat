import { Message, User } from '@prisma/client'

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
  messages: Message[]
}
