'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FriendsTypes } from '@/lib/types'

export default function FriendChatHeader({
  selectedUser,
}: {
  selectedUser: FriendsTypes
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b w-full">
      <div className="flex items-center space-x-4">
        <Avatar className="border-2 border-background">
          <AvatarImage
            src={selectedUser.imageUrl || '/user.jpg'}
            alt={selectedUser.name}
          />
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {selectedUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{selectedUser.name}</h2>
          {/* {isTyping && (
          <p className="text-sm text-gray-500 animate-pulse">
            typing...
          </p>
        )} */}
        </div>
      </div>
    </div>
  )
}
