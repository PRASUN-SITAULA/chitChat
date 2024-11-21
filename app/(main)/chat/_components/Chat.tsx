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
import { Message } from '@prisma/client'
import { getMessages, sendGroupMessage, sendMessage } from '@/actions/messages'
import { getChannelName } from '@/lib/utils/getChannelName'
import { FriendsList } from './FriendsList'
import { FriendsTypes, GroupType } from '@/lib/types'
import { toast } from 'sonner'
import { CreateGroup } from './CreateGroup'
import { GroupsList } from './GroupList'
import GroupChatHeader from './GroupChatHeader'
import { MessageInputForm } from './MessageInputForm'

export default function Chat({
  friends,
  userId,
  groups,
}: {
  friends: FriendsTypes[]
  userId: string
  groups: GroupType[]
}) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<FriendsTypes>()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  // const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
  //   null,
  // )
  const [friendsLastMessages, setFriendsLastMessages] = useState<
    Record<string, Message>
  >({})
  // const [groups, setGroups] = useState<GroupType[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupType>()

  // Fetch messages when selected user changes
  useEffect(() => {
    async function loadMessages() {
      if (!selectedUser || !userId) return

      const result = await getMessages(selectedUser.id, userId)
      if (result.success && result.messages) {
        setMessages(result.messages)
      } else {
        console.error('Failed to load messages:', result.error)
      }
    }
    loadMessages()
  }, [selectedUser, userId])

  //  update last messages when messages change
  useEffect(() => {
    if (!selectedUser || !messages.length) return

    setFriendsLastMessages((prev) => ({
      ...prev,
      [selectedUser.id]: messages[messages.length - 1],
    }))
  }, [messages, selectedUser])

  // handle real time chat
  useEffect(() => {
    if (!selectedUser || !userId) return

    // Subscribe to private channel for this chat
    const channelName = getChannelName(userId, selectedUser.id)
    const channel = pusherClient.subscribe(channelName)

    channel.bind('new-message', (data: { message: Message }) => {
      setMessages((current) => {
        // Check if message already exists in the array
        const messageExists = current.some((msg) => msg.id === data.message.id)
        if (messageExists) {
          return current
        }
        return [...current, data.message]
      })
      // Update last message for the friend
      setFriendsLastMessages((prev) => ({
        ...prev,
        [selectedUser.id]: data.message,
      }))
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

  // Subscribe to group messages
  useEffect(() => {
    if (!selectedGroup || !userId) return

    const groupChannel = pusherClient.subscribe(`group-${selectedGroup.id}`)

    groupChannel.bind('new-group-message', (data: { message: Message }) => {
      setMessages((current) => {
        const messageExists = current.some((msg) => msg.id === data.message.id)
        if (messageExists) {
          return current
        }
        return [...current, data.message]
      })
    })

    return () => {
      groupChannel.unbind_all()
      pusherClient.unsubscribe(`group-${selectedGroup.id}`)
    }
  }, [selectedGroup, userId])

  // Handle typing events
  // const handleTyping = () => {
  //   if (!selectedUser || !userId) return

  //   // Clear existing timeout
  //   if (typingTimeout) {
  //     clearTimeout(typingTimeout)
  //   }

  //   // Set new timeout
  //   const timeout = setTimeout(() => {
  //     setTypingTimeout(null)
  //   }, 1000)

  //   setTypingTimeout(timeout)
  // }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    try {
      if (selectedGroup) {
        // Send group message
        const result = await sendGroupMessage(
          selectedGroup.id,
          newMessage,
          userId,
        )
        if (result.success) {
          setNewMessage('')
          router.refresh()
        }
      } else if (selectedUser) {
        // Send direct message
        const result = await sendMessage(selectedUser.id, newMessage)
        if (result.success) {
          setNewMessage('')
          router.refresh()
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    }
  }

  const handleUserSelect = (user: FriendsTypes) => {
    setSelectedUser(user)
    setSelectedGroup(undefined)
    setIsMobileMenuOpen(false)
    setMessages([]) // Clear messages when switching users
  }
  const handleGroupSelect = (group: GroupType) => {
    setSelectedGroup(group)
    setSelectedUser(undefined)
    setIsMobileMenuOpen(false)
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white w-96 flex flex-col flex-shrink-0 border-r border-gray-200 shadow-sm ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
          <CreateGroup friends={friends} userId={userId} />
          <SearchComponent onSelectUser={handleUserSelect} />
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-6 pb-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Groups</h2>
            <GroupsList groups={groups} onSelectGroup={handleGroupSelect} />
            <h2 className="text-lg font-semibold text-gray-700 mt-4">
              Friends
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FriendsList
              friends={friends}
              handleUserSelect={handleUserSelect}
              lastMessages={friendsLastMessages}
            />
          </div>
        </div>
      </div>
      {/* Main Chat Area */}

      {/* Chat Header for group chat */}
      {selectedGroup ? (
        <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-200 to-purple-400">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center w-full">
              <GroupChatHeader group={selectedGroup} />
            </div>
          </div>
        </div>
      ) : selectedUser ? (
        <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-200 to-purple-400">
          {/* Chat Header for one to one consversation */}
          <div className="p-4 border-b border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
              <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-gray-200">
                <AvatarImage
                  src={selectedUser.imageUrl || '/user.jpg'}
                  alt={selectedUser.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {selectedUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedUser.name}
                </h2>
                {isTyping && (
                  <p className="text-sm text-gray-500 animate-pulse">
                    typing...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col  relative overflow-hidden">
            <ScrollArea className="flex-1 p-6">
              {messages.reduce(
                (messageGroups: JSX.Element[], message, index) => {
                  const messageDate = new Date(
                    message.createdAt,
                  ).toLocaleDateString()
                  const previousMessage = messages[index - 1]
                  const previousDate = previousMessage
                    ? new Date(previousMessage.createdAt).toLocaleDateString()
                    : null

                  // Add date separator if date changes or it's the first message
                  if (!previousDate || messageDate !== previousDate) {
                    messageGroups.push(
                      <div
                        key={`date-${messageDate}`}
                        className="flex justify-center my-4"
                      >
                        <span className="px-4 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                          {messageDate}
                        </span>
                      </div>,
                    )
                  }
                  messageGroups.push(
                    <div
                      key={message.id}
                      className={`flex mb-6 ${
                        message.senderId === selectedUser.id
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-md px-6 py-3 rounded-2xl shadow-sm ${
                          message.senderId === selectedUser.id
                            ? 'bg-gray-300 text-gray-800 border border-gray-200'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.senderId === selectedUser.id
                              ? 'text-gray-500'
                              : 'text-gray-200'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>,
                  )

                  return messageGroups
                },
                [],
              )}
            </ScrollArea>
            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className=" border-t border-gray-200 p-4 text-white"
            >
              <div className="max-w-4xl mx-auto flex space-x-4 ">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                  }}
                  className="flex-1 text-white border-black rounded-full h-10"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-2 flex items-center space-x-2"
                >
                  <SendHorizontal className="h-5 w-5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome to ChitChat
            </h3>
            <p className="text-gray-500">Search a friend to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}
