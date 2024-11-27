'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { useState } from 'react'
import { GroupType, MessageType } from '@/lib/types'

interface GroupsListProps {
  groups: GroupType[]
  onSelectGroup: (group: GroupType) => void
  groupMessages: MessageType[]
}

export function GroupsList({
  groups,
  onSelectGroup,
  groupMessages,
}: GroupsListProps) {
  const [selectedId, setSelectedId] = useState<string>('')

  if (groups.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No groups yet. Create one to start chatting!
      </div>
    )
  }
  return (
    <ScrollArea className="h-[150px] pr-2">
      <div className="space-y-2 ">
        {groups.map((group) => {
          const lastMessage = groupMessages[groupMessages.length - 1]
          return (
            <div
              key={group.id}
              className={`p-3 cursor-pointer transition-all duration-200 rounded-lg hover:bg-gray-50
                ${
                  selectedId === group.id
                    ? 'bg-gray-300 border-l-4 border-purple-500'
                    : 'bg-gray-100 border border-gray-200'
                }`}
              onClick={() => {
                setSelectedId(group.id)
                onSelectGroup(group)
              }}
            >
              <div className="flex items-center space-x-4">
                {/* Group Avatar */}
                <div className="relative">
                  {group.imageUrl ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/group/${group.imageUrl}` || '/groupuser.png'}
                        alt={group.name}
                      />
                      <AvatarFallback>
                        {group.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {/* Member count badge */}
                  <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {group.members.length}
                  </div>
                </div>

                {/* Group Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 truncate">
                      {group.name}
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

                  {/* Last Message */}
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage ? (
                      <>
                        <span className="font-medium">
                          {lastMessage.sender.name}:{' '}
                        </span>
                        {lastMessage.content}
                      </>
                    ) : (
                      'Click to Chat'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
