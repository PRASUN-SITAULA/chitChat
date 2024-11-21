'use client'

import { useState } from 'react'
import { Settings, MoreVertical, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GroupType } from '@/lib/types'

export default function GroupChatHeader({ group }: { group: GroupType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-4 border-b w-full">
        <div className="flex items-center space-x-4">
          <Avatar className="border-2 border-background">
            <AvatarImage
              src={`/group/${group.imageUrl}` || '/group.jpg'}
              alt={group.name}
            />
            <AvatarFallback>
              {group.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{group.name}</h2>
          <div className="flex space-x-2">
            {group.members.slice(0, 3).map((member, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Avatar className="border-2 border-background">
                    <AvatarImage
                      src={member.imageUrl || '/user.jpg'}
                      alt={member.name}
                    />
                    <AvatarFallback>
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
              <Avatar className="border-2 border-background cursor-pointer">
                <AvatarFallback>+{group.members.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>All Members</DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[60vh]">
                  <div className="space-y-4">
                    {group.members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={member.imageUrl || '/user.jpg'}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>{member.name}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
              >
                <Users className="h-5 w-5" />
                <span className="sr-only">View all group members</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View all members</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Open settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open settings</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>More options</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
