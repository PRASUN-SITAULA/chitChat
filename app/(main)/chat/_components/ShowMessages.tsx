import { ScrollArea } from '@/components/ui/scroll-area'
import { FriendsTypes, GroupType, MessageType } from '@/lib/types'

const isGroupType = (user: FriendsTypes | GroupType): user is GroupType => {
  return (user as GroupType).members !== undefined
}

export const ShowMessages = ({
  messages,
  selectedUser,
  userId,
}: {
  messages: MessageType[]
  selectedUser: FriendsTypes | GroupType
  userId: string
}) => {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow overflow-y-auto px-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No messages yet</div>
        ) : (
          messages.reduce((messageGroups: JSX.Element[], message, index) => {
            const messageDate = new Date(message.createdAt).toLocaleDateString()
            const previousMessage = messages[index - 1]
            const previousDate = previousMessage
              ? new Date(previousMessage.createdAt).toLocaleDateString()
              : null

            // Add date separator if date changes or it's the first message
            if (!previousDate || messageDate !== previousDate) {
              messageGroups.push(
                <div
                  key={`date-${messageDate}`}
                  className="flex justify-center my-4 w-full"
                >
                  <span className="px-4 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                    {messageDate}
                  </span>
                </div>,
              )
            }
            // if the message is sent to the group
            if (isGroupType(selectedUser)) {
              messageGroups.push(
                <div
                  key={message.id}
                  className={`flex mb-4 w-full ${
                    message.senderId !== userId
                      ? 'justify-start flex-col'
                      : 'justify-end'
                  }`}
                >
                  {message.senderId !== userId && (
                    <div>
                      <span className="pl-2 text-md text-gray-500">
                        {message?.sender?.name}
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-48 px-6 py-3 rounded-2xl shadow-sm ${
                      message.senderId === userId
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600   text-white'
                        : 'bg-gray-300 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.senderId === userId
                          ? 'text-gray-200'
                          : 'text-gray-500'
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
            }
            // if message is sent to a friend
            messageGroups.push(
              <div
                key={message.id}
                className={`flex mb-4 w-full ${
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
          }, [])
        )}
      </ScrollArea>
    </div>
  )
}
