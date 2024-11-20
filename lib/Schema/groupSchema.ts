import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const groupSchema = zfd.formData({
  name: z
    .string({
      invalid_type_error:
        'Group name must be a string of at least 4 characters',
      required_error: 'Please enter a Group Name',
    })
    .min(4),

  groupImage: zfd
    .file()
    .refine((file) => file.size < 5000000, {
      message: "File can't be bigger than 5MB.",
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      {
        message: 'File format must be either jpg, jpeg lub png.',
      },
    ),
})
