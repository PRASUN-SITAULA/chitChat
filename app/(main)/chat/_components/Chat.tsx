'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal, BookImage } from 'lucide-react'
import { SearchComponent } from './SearchBar'
import { pusherClient } from '@/lib/pusher'
import { useRouter } from 'next/navigation'
import {
  getGroupMessages,
  getMessages,
  sendGroupMessage,
  sendMessage,
} from '@/actions/messages'
import { getChannelName } from '@/lib/utils/getChannelName'
import { FriendsList } from './FriendsList'
import { FriendsTypes, GroupType, MessageType } from '@/lib/types'
import { toast } from 'sonner'
import { CreateGroup } from './CreateGroup'
import { GroupsList } from './GroupList'
import GroupChatHeader from './GroupChatHeader'
import FriendChatHeader from './FriendChatHeader'
import { ShowMessages } from './ShowMessages'
import handleImageUpload from '@/actions/imageUpload'

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
  const [selectedUser, setSelectedUser] = useState<FriendsTypes | null>(null)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const [isTyping, setIsTyping] = useState(false)
  // const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
  //   null,
  // )
  const [friendsLastMessages, setFriendsLastMessages] = useState<
    Record<string, MessageType>
  >({})
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null)
  const [groupMessages, setGroupMessages] = useState<MessageType[]>([])

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

    channel.bind('new-message', (data: { message: MessageType }) => {
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
    // channel.bind('typing', ({ userId }: { userId: string }) => {
    //   if (userId === selectedUser.id) {
    //     setIsTyping(true)
    //     setTimeout(() => setIsTyping(false), 2000)
    //   }
    // })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [selectedUser, userId])

  // Subscribe to group messages
  useEffect(() => {
    if (!selectedGroup || !userId) return

    const groupChannel = pusherClient.subscribe(`group-${selectedGroup.id}`)
    groupChannel.bind('new-group-message', (data: { message: MessageType }) => {
      setGroupMessages((current) => {
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

  // load group messages
  useEffect(() => {
    async function loadGroupMessages() {
      if (!selectedGroup || !userId) return

      const result = await getGroupMessages(selectedGroup.id, userId)
      if (result.success && result.messages) {
        setGroupMessages(result.messages)
      } else {
        console.error('Failed to load messages:', result.error)
      }
    }
    loadGroupMessages()
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
    if (!newMessage.trim() || (!selectedUser && !selectedGroup)) return
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
    setSelectedGroup(null)
    setIsMobileMenuOpen(false)
    setMessages([]) // Clear messages when switching users
  }
  const handleGroupSelect = (group: GroupType) => {
    setSelectedGroup(group)
    setSelectedUser(null)
    setIsMobileMenuOpen(false)
    setGroupMessages([])
  }

  const handleImageSend = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await handleImageUpload(formData)
      if (result.error) {
        toast.error('Failed to upload image')
        return
      }
      // Send message with image URL
      if (selectedGroup) {
        await sendGroupMessage(selectedGroup.id, userId, undefined, result.data)
      } else if (selectedUser) {
        await sendMessage(selectedUser.id, undefined, result.data)
      }
      router.refresh()
    } catch (error) {
      console.error('Failed to upload image', error)
      toast.error('Failed to upload image')
    }
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
            <GroupsList
              groups={groups}
              onSelectGroup={handleGroupSelect}
              groupMessages={groupMessages}
            />
          </div>
          <div className="p-6 pb-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Friends
            </h2>
            <FriendsList
              friends={friends}
              handleUserSelect={handleUserSelect}
              lastMessages={friendsLastMessages}
            />
          </div>
        </div>
      </div>

      {friends.length === 0 && groups.length === 0 && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome to ChitChat
            </h3>
            <p className="text-gray-500">Search a friend to start messaging</p>
          </div>
        </div>
      )}
      {/* Main Chat Area */}

      {/* Chat Header for group chat */}
      {selectedGroup && (
        <div className="flex flex-col h-screen w-full ml-16 bg-blue-300">
          <GroupChatHeader group={selectedGroup} friends={friends} />
          <div className="flex-grow overflow-hidden">
            <ShowMessages
              messages={groupMessages}
              selectedUser={selectedGroup}
              userId={userId}
            />
          </div>
          <form
            onSubmit={handleSendMessage}
            className="sticky bottom-0 z-10 bg-blue-200 border-t border-gray-200 p-4"
          >
            <div className="max-w-4xl mx-auto flex space-x-4">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-black border-black rounded-full h-10"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-2 flex items-center space-x-2"
              >
                <SendHorizontal className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </Button>
              <input
                type="file"
                id="imageUploadGroup"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageSend(file)
                  }
                }}
              />
              <Button
                onClick={() =>
                  document.getElementById('imageUploadGroup')?.click()
                }
              >
                <BookImage className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Chat Header for one to one consversation */}
      {selectedUser && (
        <div className="flex flex-col h-screen w-full ml-16 bg-blue-300">
          <FriendChatHeader selectedUser={selectedUser} />
          <div className="flex-grow overflow-hidden">
            <ShowMessages
              messages={messages}
              selectedUser={selectedUser}
              userId={userId}
            />
          </div>
          <form
            onSubmit={handleSendMessage}
            className="sticky bottom-0 z-10 bg-blue-200 border-t border-gray-200 p-4"
          >
            <div className="max-w-4xl mx-auto flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-black border-black rounded-full h-10"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-2 flex items-center space-x-2"
              >
                <SendHorizontal className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </Button>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageSend(file)
                  }
                }}
              />
              <Button
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <BookImage className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
