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
  // selectedUser,
  // handleUserSelect,
}: {
  friends: Friends[] | []
  // selectedUser: Friends | null
  // handleUserSelect: (user: Friends) => void
}) {
  return (
    <ScrollArea className="h-[calc(100vh-15rem)]">
      {friends.map((friend) => (
        <div
          key={friend.id}
          // className={`p-4 cursor-pointer hover:bg-gray-100 ${
          //   selectedUser?.id === friend.id ? 'bg-gray-100' : ''
          // }`}
          // onClick={() => handleUserSelect(friend)}
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
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}
