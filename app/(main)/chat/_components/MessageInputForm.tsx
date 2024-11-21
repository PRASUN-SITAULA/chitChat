// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { SendHorizontal } from 'lucide-react'

// interface MessageInputFormProps {
//   handleSendMessage: (e: React.FormEvent) => Promise<void>
//   newMessage: string
//   setNewMessage: (newMessage: string) => void
// }

// export const MessageInputForm = ({
//   handleSendMessage,
//   newMessage,
//   setNewMessage,
// }: MessageInputFormProps) => {
//   return (
//     <form
//       onSubmit={handleSendMessage}
//       className=" border-t border-gray-200 p-4 text-white"
//     >
//       <div className="max-w-4xl mx-auto flex space-x-4 ">
//         <Input
//           type="text"
//           placeholder="Type your message..."
//           value={newMessage}
//           onChange={(e) => {
//             setNewMessage(e.target.value)
//           }}
//           className="flex-1 text-white border-black rounded-full h-10"
//         />
//         <Button
//           type="submit"
//           className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-6 py-2 flex items-center space-x-2"
//         >
//           <SendHorizontal className="h-5 w-5" />
//           <span className="hidden sm:inline">Send</span>
//         </Button>
//       </div>
//     </form>
//   )
// }
