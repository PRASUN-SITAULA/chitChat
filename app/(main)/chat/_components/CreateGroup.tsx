'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users } from 'lucide-react'
import { FriendsTypes } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'

interface CreateGroupProps {
  friends: FriendsTypes[]
  onCreateGroup: (name: string, memberIds: string[]) => Promise<void>
}

export function CreateGroup({ friends, onCreateGroup }: CreateGroupProps) {
  const [groupName, setGroupName] = useState('')
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (groupName.trim() && selectedFriends.length > 0) {
      await onCreateGroup(groupName, selectedFriends)
      setGroupName('')
      setSelectedFriends([])
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4">
          <Users className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          <div className="space-y-2">
            <Label>Select Members</Label>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {friends.map((friend) => (
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
                          : selectedFriends.filter((id) => id !== friend.id),
                      )
                    }}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={friend.imageUrl || undefined} />
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
            </div>
          </div>
          <Button type="submit" className="w-full">
            Create Group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
