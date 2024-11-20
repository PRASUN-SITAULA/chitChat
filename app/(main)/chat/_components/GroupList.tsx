'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { useState } from 'react'
import { GroupType } from '@/lib/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface GroupsListProps {
  groups: GroupType[]
  onSelectGroup: (group: GroupType) => void
}

export function GroupsList({ groups, onSelectGroup }: GroupsListProps) {
  const [selectedId, setSelectedId] = useState<string>('')

  if (groups.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No groups yet. Create one to start chatting!
      </div>
    )
  }

  return (
    <ScrollArea className="h-[200px] pr-4">
      <div className="space-y-2">
        {groups.map((group) => {
          const lastMessage = group.messages[0] // Getting the latest message
          return (
            <div
              key={group.id}
              className={`p-3 cursor-pointer transition-all duration-200 rounded-lg hover:bg-gray-50
                ${
                  selectedId === group.id
                    ? 'bg-gray-100 border-l-4 border-purple-500'
                    : 'bg-white border border-gray-200'
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
                        src={
                          '/group/1732119085049_Screenshot from 2024-10-26 12-27-58.png'
                        }
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
                      'No messages yet'
                    )}
                  </p>

                  {/* Member Avatars */}
                  <div className="flex -space-x-2 mt-2 overflow-hidden">
                    <TooltipProvider>
                      {group.members.slice(0, 3).map((member) => (
                        <Tooltip key={member.id}>
                          <TooltipTrigger>
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarImage
                                src={member.imageUrl || undefined}
                                alt={member.name}
                              />
                              <AvatarFallback className="text-xs">
                                {member.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{member.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {group.members.length > 3 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                              +{group.members.length - 3}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {group.members
                                .slice(3)
                                .map((m) => m.name)
                                .join(', ')}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
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
