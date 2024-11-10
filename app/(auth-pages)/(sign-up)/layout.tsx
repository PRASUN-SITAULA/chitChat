import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'sign up page',
  description: 'Page where the user can sign up or register',
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
