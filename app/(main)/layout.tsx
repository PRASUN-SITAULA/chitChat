import type { Metadata } from 'next'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import { geistSans, geistMono } from '../fonts'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'ChitChat',
  description: 'Chat with your friends',
}

export default function RootLayout({
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
          <Navbar />
          {children}
          <Toaster duration={3000} />
        </body>
      </html>
    </ClerkProvider>
  )
}
