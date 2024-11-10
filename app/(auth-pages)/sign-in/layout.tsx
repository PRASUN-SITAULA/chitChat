import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'sign in page',
  description: 'Page where the user can sign in or login',
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main>{children}</main>
}
