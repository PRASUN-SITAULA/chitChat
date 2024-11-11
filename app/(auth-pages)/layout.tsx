import type { Metadata } from 'next'
import '../globals.css'
import { geistSans, geistMono } from '../fonts'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'ChitChat',
  description: 'Chat with your friends',
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
