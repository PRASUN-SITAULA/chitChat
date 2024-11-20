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
import { SubmitButton } from '@/components/SubmitButton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { groupSchema } from '@/lib/Schema/groupSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createGroup } from '@/actions/group'
import { useRouter } from 'next/navigation'

export function CreateGroup({
  friends,
  userId,
}: {
  friends: FriendsTypes[]
  userId: string
}) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof groupSchema>) => {
    const result = groupSchema.safeParse(data)
    if (!result.success) {
      toast.error(result.error.message)
    }
    const formData = new FormData()
    formData.append('name', result?.data?.name as string)
    formData.append('groupImage', result?.data?.groupImage as File)

    if (result?.data?.name.trim() && selectedFriends.length > 0) {
      await createGroup(formData, selectedFriends, userId)
      form.reset()
      setSelectedFriends([])
      toast.success('Group created successfully')
      setIsOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-4 border-2 border-black">
          <Users className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="groupImage"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Group Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      type="file"
                      {...fieldProps}
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Enter group name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                                  : selectedFriends.filter(
                                      (id) => id !== friend.id,
                                    ),
                              )
                            }}
                          />
                          <Avatar className="h-8 w-8 ">
                            <AvatarImage src={friend.imageUrl || '/user.jpg'} />
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
                </FormItem>
              )}
            />
            <SubmitButton
              pendingText="Creating ..."
              pending={form.formState.isSubmitting}
            >
              Create Group
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
