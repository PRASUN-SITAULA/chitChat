'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FriendsTypes } from '@/lib/types'
import { useState } from 'react'
import { Message } from '@prisma/client'
import { BookImage } from 'lucide-react'

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

  if (friends.length === 0)
    return (
      <div className="text-center p-4 text-gray-500">
        No Friends yet. Add one to start chatting!
      </div>
    )
  return (
    <ScrollArea className="h-[200px] pr-2">
      <div className="space-y-2">
        {friends.map((friend) => {
          const lastMessage = lastMessages[friend.id]
          return (
            <div
              key={friend.id}
              className={`p-3 cursor-pointer transition-all duration-200 rounded-lg
                  ${
                    selectedId === friend.id
                      ? 'bg-gray-300 border-l-4 border-purple-500'
                      : 'hover:bg-gray-200 bg-gray-100'
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
                      {lastMessage ? (
                        lastMessage.messageImageUrl ? (
                          <span>
                            Image
                            <BookImage className="inline-block h-4 w-4 pl-1" />
                          </span>
                        ) : (
                          lastMessage.content
                        )
                      ) : (
                        'Click to chat'
                      )}
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
