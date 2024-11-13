'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Friends {
  id: string
  name: string
  imageUrl: string
}

export function FriendsList({
  friends,
  selectedUser,
  handleUserSelect,
}: {
  friends: Friends[] | []
  selectedUser: Friends | null
  handleUserSelect: (user: Friends) => void
}) {
  if (friends.length === 0) return null
  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold mb-4">Friends</h2>
      <ScrollArea className="h-[calc(100vh-15rem)]">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedUser?.id === friend.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => handleUserSelect(friend)}
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={friend.imageUrl || undefined}
                  alt={friend.name}
                />
                <AvatarFallback>
                  {friend.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{friend.name}</p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}
