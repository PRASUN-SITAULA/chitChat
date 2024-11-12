import { z } from 'zod'

export const searchSchema = z.object({
  query: z
    .string({
      invalid_type_error: 'Please enter a valid Username',
      required_error: 'Please enter a Username',
    })
    .min(4),
})
