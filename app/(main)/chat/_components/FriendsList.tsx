'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FriendsTypes } from '@/lib/types'
import { useState } from 'react'
import { Message } from '@prisma/client'

export function FriendsList({
  friends,
  handleUserSelect,
  lastMessages,
}: {
  friends: FriendsTypes[] | []
  handleUserSelect: (user: FriendsTypes) => void
  lastMessages: Record<string, Message>
}) {
  const [selectedId, setSelectedId] = useState<string>('')

  if (friends.length === 0) return <div>Please add some friends</div>
  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      <div className="space-y-2">
        {friends.map((friend) => {
          const lastMessage = lastMessages[friend.id]
          return (
            <div
              key={friend.id}
              className={`p-3 bg-gray-300 cursor-pointer transition-all duration-200 rounded-lg
                  ${
                    selectedId === friend.id
                      ? 'bg-gray-200 border-l-4 border-purple-500'
                      : 'hover:bg-gray-50'
                  }`}
              onClick={() => {
                setSelectedId(friend.id)
                handleUserSelect(friend)
              }}
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-gray-100">
                  <AvatarImage
                    src={friend.imageUrl || '/user.jpg'}
                    alt={friend.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white">
                    {friend.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 truncate">
                      {friend.name}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage ? lastMessage.content : 'Click to chat'}
                    </p>
                    {/* <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-600 hover:bg-purple-200"
                    >
                      2
                    </Badge> */}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
