export const getChannelName = (userId1: string, userId2: string) => {
  const sortedIds = [userId1, userId2].sort()
  return `private-chat-${sortedIds[0]}-${sortedIds[1]}`
}
