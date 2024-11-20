import { z } from 'zod'

export const groupSchema = z.object({
  name: z
    .string({
      invalid_type_error:
        'Group name must be a string of at least 4 characters',
      required_error: 'Please enter a Group Name',
    })
    .min(4),
})
