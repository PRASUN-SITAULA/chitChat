'use client'

import { Button } from '@/components/ui/button'
import { type ComponentProps } from 'react'

type Props = ComponentProps<typeof Button> & {
  pending?: boolean
  pendingText?: string
}

export function SubmitButton({
  children,
  pending,
  pendingText,
  ...props
}: Props) {
  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  )
}
