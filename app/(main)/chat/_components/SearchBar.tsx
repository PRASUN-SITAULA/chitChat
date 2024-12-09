'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { searchSchema } from '@/lib/Schema/searchSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SubmitButton } from '@/components/SubmitButton'
import { addFriend, searchUsers } from '@/actions/user'
import { useIntersection } from '@mantine/hooks'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
// import { User } from '@prisma/client'

interface User {
  id: string
  name: string
  imageUrl: string | null
  friends: {
    id: string
  }[]
}

interface SearchBarProps {
  onSelectUser: (user: User) => void
}

export function SearchComponent({ onSelectUser }: SearchBarProps) {
  const [users, setUsers] = useState<User[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { userId } = useAuth()
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  })

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
    },
  })
  const debouncedSearchTerm = useDebounce(form.watch('query'), 300)

  useEffect(() => {
    if (debouncedSearchTerm) {
      setPage(1)
      loadUsers(debouncedSearchTerm, 1, true)
    }
  }, [debouncedSearchTerm])

  const loadUsers = async (
    searchQuery: string,
    pageNum: number,
    isNewSearch: boolean = false,
  ) => {
    try {
      setIsSearching(true)
      const result = await searchUsers(searchQuery, pageNum)
      if ('error' in result) {
        return
      }
      setUsers((prev) =>
        isNewSearch ? result.users : [...prev, ...result.users],
      )
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof searchSchema>) => {
    setPage(1)
    const result = searchSchema.safeParse(data)
    if (!result.success) {
      return null
    }
    await loadUsers(result?.data?.query, 1, true)
  }

  // Load more when last element is visible
  useEffect(() => {
    if (entry?.isIntersecting && hasMore && !isSearching) {
      const nextPage = page + 1
      setPage(nextPage)
      loadUsers(form.getValues('query'), nextPage)
    }
  }, [entry?.isIntersecting, form, hasMore, isSearching, page])

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        form.reset()
        setUsers([]) // Optional: clear the results
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div ref={searchContainerRef} className="w-full max-w-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-4 flex-row items-center justify-start"
        >
          <div className="flex flex-row gap-4 items-center">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Search for friends..."
                      className="input input-bordered border-zinc-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton
              type="submit"
              pending={form.formState.isSubmitting}
              pendingText="Searching ..."
              className="mb-auto"
            >
              <Search className="h-4 w-4" />
              Search
            </SubmitButton>
          </div>
        </form>
      </Form>

      {/* Results */}
      <div className="mt-4 space-y-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            ref={index === users.length - 1 ? ref : null}
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            onClick={() => onSelectUser(user)}
          >
            <Avatar>
              <AvatarImage
                src={user?.imageUrl || '/user.jpg'}
                alt={user.name}
              />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">@{user.name}</p>
            </div>

            <Button
              onClick={async () => {
                const result = await addFriend(user.id)
                if (result.success) {
                  router.refresh()
                }
              }}
              size="sm"
              className="bg-black text-white outline"
              disabled={user.friends.some((friend) => friend.id === userId)}
              type="submit"
            >
              {user.friends.some((friend) => friend.id === userId)
                ? 'Already Friends'
                : 'Add Friend'}
            </Button>
          </div>
        ))}

        {/* Loading indicator */}
        {isSearching && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
          </div>
        )}

        {/* No results message */}
        {users.length === 0 && !isSearching && form.getValues('query') && (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  )
}
