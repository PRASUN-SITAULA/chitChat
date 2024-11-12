'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { searchSchema } from '@/lib/Schema/searchSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SubmitButton } from '@/components/SubmitButton'

// Mock database of users
const mockUsers = [
  {
    id: 1,
    name: 'Alice Smith',
    username: 'alice_s',
    avatar: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    username: 'bob_j',
    avatar: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    username: 'charlie_b',
    avatar: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 4,
    name: 'Diana Prince',
    username: 'diana_p',
    avatar: '/placeholder.svg?height=50&width=50',
  },
  {
    id: 5,
    name: 'Ethan Hunt',
    username: 'ethan_h',
    avatar: '/placeholder.svg?height=50&width=50',
  },
]

export function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState<
    (typeof mockUsers)[0] | null
  >(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simulate an API call with setTimeout
    setTimeout(() => {
      const result = mockUsers.find(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResult(result || null)
      setIsSearching(false)
    }, 500) // Simulate a 500ms delay
  }

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  return (
    <div className="w-full max-w-sm ">
      <Form {...form}>
        <form className=" flex gap-4 flex-row items-center justify-start">
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
                    // onChange={(e) => setSearchQuery(e.target.value)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            type="submit"
            pending={isSubmitting}
            pendingText="Searching ..."
          >
            <Search className="h-4 w-4" />
            Search
          </SubmitButton>
        </form>
      </Form>

      {isSearching ? (
        <p className="text-center">Searching...</p>
      ) : searchResult ? (
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
          <Avatar>
            <AvatarImage src={searchResult.avatar} alt={searchResult.name} />
            <AvatarFallback>
              {searchResult.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{searchResult.name}</h3>
            <p className="text-sm text-gray-500">@{searchResult.username}</p>
          </div>
        </div>
      ) : searchQuery && !isSearching ? (
        <p className="text-center text-gray-500">User is not available</p>
      ) : null}
    </div>
  )
}
