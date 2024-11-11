'use client'
import {
  SignInButton,
  UserButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-black">ChitChat</h1>
          </div>
          <div className="flex items-center gap-4 justify-center flex-row">
            <SignedOut>
              <Link href="/sign-in">
                <SignInButton>
                  <Button className="bg-black text-white outline">
                    Sign in
                  </Button>
                </SignInButton>
              </Link>
            </SignedOut>
            <SignedIn>
              <SignOutButton>
                <Button className="bg-black text-white outline">
                  Sign out
                </Button>
              </SignOutButton>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
