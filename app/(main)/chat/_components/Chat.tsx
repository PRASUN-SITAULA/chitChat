'use client'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SendHorizontal, Menu } from 'lucide-react'
import { SearchComponent } from './SearchBar'
import { pusherClient } from '@/lib/pusher'
import { useRouter } from 'next/navigation'
import { User, Message } from '@prisma/client'
import { getMessages, sendMessage } from '@/actions/messages'
import { useAuth } from '@clerk/nextjs'
import { getChannelName } from '@/lib/utils/getChannelName'
import { FriendsList } from './FriendsList'
import { getFriends } from '@/actions/user'

interface FriendsTypes {
  id: string
  name: string
  imageUrl: string
}

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<FriendsTypes>()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [friends, setFriends] = useState<FriendsTypes[] | []>([])
  const router = useRouter()

  const { userId } = useAuth()

  // Fetch messages when selected user changes
  useEffect(() => {
    async function loadMessages() {
      if (!selectedUser || !userId) return

      const result = await getMessages(selectedUser.id)
      if (result.success && result.messages) {
        setMessages(result.messages)
      } else {
        console.error('Failed to load messages:', result.error)
      }
    }
    loadMessages()
  }, [selectedUser, userId])

  useEffect(() => {
    if (!selectedUser || !userId) return

    // Subscribe to private channel for this chat
    const channelName = getChannelName(userId, selectedUser.id)
    const channel = pusherClient.subscribe(channelName)

    channel.bind('new-message', (data: { message: Message }) => {
      // Add the new message to the messages state
      setMessages((current) => [...current, data.message])
    })
    // Listen for new messages
    channel.bind('typing', ({ userId }: { userId: string }) => {
      if (userId === selectedUser.id) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 2000)
      }
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [selectedUser, userId])

  // Handle typing events
  const handleTyping = () => {
    if (!selectedUser || !userId) return

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // // Trigger typing event
    // pusherClient.trigger(getChannelName(userId, selectedUser.id), 'typing', {
    //   userId: userId,
    // })

    // Set new timeout
    const timeout = setTimeout(() => {
      setTypingTimeout(null)
    }, 1000)

    setTypingTimeout(timeout)
  }

  // Add this useEffect to fetch friends
  useEffect(() => {
    async function loadFriends() {
      if (!userId) return
      try {
        const result = await getFriends()
        if ('success' in result) {
          setFriends(result.friends)
        }
      } catch (error) {
        console.error('Failed to load friends:', error)
      }
    }
    loadFriends()
  }, [userId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      const result = await sendMessage(selectedUser.id, newMessage)
      if (result.success) {
        setNewMessage('')
        // Optimistically update messages
        setMessages((prev) => [...prev, result.message])
        router.refresh()
      } else {
        console.log('error')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUserSelect = (user: FriendsTypes) => {
    setSelectedUser(user)
    setIsMobileMenuOpen(false)
    setMessages([]) // Clear messages when switching users
  }

  return (
    <div className="flex min-h-full bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-96 flex-shrink-0 border-r ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Search Users</h2>
          <SearchComponent onSelectUser={handleUserSelect} />
        </div>
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
      </div>
      {/* Main Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col h-screen">
          {/* Chat Header */}
          <div className="bg-blue-200 p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu />
              </Button>
              <Avatar className="bg-red-500">
                <AvatarImage
                  src={selectedUser.imageUrl || undefined}
                  alt={selectedUser.name}
                />
                <AvatarFallback className="bg-blue-300">
                  {selectedUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
                {isTyping && (
                  <p className="text-sm text-gray-600 animate-pulse">
                    typing...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col bg-blue-100 ">
            <ScrollArea className="absolute inset-0 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.senderId === selectedUser.id
                      ? 'justify-start'
                      : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === selectedUser.id
                        ? 'bg-green-300'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 text-white">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="bg-white border-t p-4"
            >
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping()
                  }}
                  className="flex-1 border-1 border-black bg-gray-300"
                />
                <Button type="submit">
                  <SendHorizontal className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">
            Search and select a user to start chatting
          </p>
        </div>
      )}
    </div>
  )
}
