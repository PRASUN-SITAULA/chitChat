'use client'
import { useState } from 'react'
import { Settings, MoreVertical, Users, UserPlus } from 'lucide-react'
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
import { FriendsTypes, GroupType } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { SubmitButton } from '@/components/SubmitButton'
import { AddMembersToGroup } from '@/actions/group'
import { toast } from 'sonner'

export default function GroupChatHeader({
  group,
  friends,
}: {
  group: GroupType
  friends: FriendsTypes[]
}) {
  const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false)
  const [isAddMembersDialogOpen, setIsAddMembersDialogOpen] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    if (selectedFriends.length === 0) {
      setIsSubmitting(false)
      toast.error('Please select at least one member.')
      return
    }
    try {
      const result = await AddMembersToGroup(group.id, selectedFriends)
      if (result.success) {
        setSelectedFriends([])
        setIsAddMembersDialogOpen(false)
        toast.info('Members added successfully.')
      }
    } catch (err) {
      console.log(err)
      toast.error('Something wrong happened.Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <Dialog
              open={isViewMembersDialogOpen}
              onOpenChange={setIsViewMembersDialogOpen}
            >
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
                onClick={() => setIsViewMembersDialogOpen(true)}
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
            <Dialog
              open={isAddMembersDialogOpen}
              onOpenChange={setIsAddMembersDialogOpen}
            >
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add members</DialogTitle>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[60vh]">
                  <div className="space-y-4">
                    {friends
                      .filter(
                        (friend) =>
                          !group.members.some(
                            (member) => member.id === friend.id,
                          ),
                      )
                      .map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
                        >
                          <Checkbox
                            checked={selectedFriends.includes(friend.id)}
                            onCheckedChange={(checked) => {
                              setSelectedFriends(
                                checked
                                  ? [...selectedFriends, friend.id]
                                  : selectedFriends.filter(
                                      (id) => id !== friend.id,
                                    ),
                              )
                            }}
                          />
                          <Avatar className="h-8 w-8 ">
                            <AvatarImage src={friend.imageUrl || '/user.jpg'} />
                            <AvatarFallback>
                              {friend.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{friend.name}</span>
                        </div>
                      ))}
                    <SubmitButton
                      pendingText="Adding ..."
                      pending={isSubmitting}
                      onClick={handleSubmit}
                    >
                      Add Members
                    </SubmitButton>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddMembersDialogOpen(true)}
              >
                <UserPlus className="h-5 w-5" />
                <span className="sr-only">Add group members</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Group Members</p>
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
