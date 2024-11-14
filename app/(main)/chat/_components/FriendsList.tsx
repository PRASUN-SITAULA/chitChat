'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Friends {
  id: string
  name: string
  imageUrl: string | null
}

export function FriendsList({
  friends,
  handleUserSelect,
}: {
  friends: Friends[] | []
  handleUserSelect: (user: Friends) => void
}) {
  if (friends.length === 0) return <div>No friends</div>
  return (
    <ScrollArea className="h-[calc(100vh-13rem)]">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className={`p-4 cursor-pointer hover:bg-gray-200 rounded`}
          onClick={() => {
            handleUserSelect(friend)
          }}
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={friend.imageUrl || '/user.jpg'}
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
              <p className="text-sm text-gray-500 truncate">{'Hello'}</p>
            </div>
          </div>
          <div className="border-b border-black " />
        </div>
      ))}
    </ScrollArea>
  )
}
