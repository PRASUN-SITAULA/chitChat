'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Menu } from 'lucide-react'
import { SearchComponent } from './SearchBar'
import { pusherClient } from '@/lib/pusherClient'

// Mock data for contacts and messages
const contacts = [
  {
    id: 1,
    name: 'Alice Smith',
    avatar: '/placeholder.svg?height=32&width=32',
    lastMessage: 'Hey, how are you?',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    avatar: '/placeholder.svg?height=32&width=32',
    lastMessage: 'Can we meet tomorrow?',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatar: '/placeholder.svg?height=32&width=32',
    lastMessage: 'Thanks for your help!',
  },
  {
    id: 4,
    name: 'Diana Prince',
    avatar: '/placeholder.svg?height=32&width=32',
    lastMessage: 'See you later!',
  },
]

const initialMessages = [
  { id: 1, senderId: 1, text: 'Hey, how are you?', timestamp: '10:00 AM' },
  {
    id: 2,
    senderId: 0,
    text: "I'm good, thanks! How about you?",
    timestamp: '10:02 AM',
  },
  {
    id: 3,
    senderId: 1,
    text: 'Doing well! Any plans for the weekend?',
    timestamp: '10:05 AM',
  },
]

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const channel = pusherClient.subscribe(`chat-${selectedContact.id}`)
    channel.bind('new-message', (data: string) => {
      setMessages((current) => [...current, data.message])
    })
    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [selectedContact.id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          senderId: 0,
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ])
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white w-96 flex-shrink-0 border-r ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          <SearchComponent />
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedContact.id === contact.id ? 'bg-gray-100' : ''}`}
              onClick={() => {
                setSelectedContact(contact)
                setIsMobileMenuOpen(false)
              }}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="bg-blue-300">
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-blue-200 p-4 border-b flex items-center justify-between">
          <div className=" flex items-center space-x-3">
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
                src={selectedContact.avatar}
                alt={selectedContact.name}
              />
              <AvatarFallback className="bg-blue-300">
                {selectedContact.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{selectedContact.name}</h2>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="bg-blue-100 flex-1 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.senderId === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderId === 0
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
