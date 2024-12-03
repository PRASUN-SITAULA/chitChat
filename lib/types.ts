import { User } from '@prisma/client'

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

export interface MessageType {
  id: string
  content: string | null
  createdAt: Date
  updatedAt: Date
  senderId: string
  receiverId: string | null
  groupId: string | null
  sender: {
    name: string
    id: string
    imageUrl: string | null
  }
  messageImageUrl: string | null
}
