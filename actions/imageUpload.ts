'use server'

import { createClient } from '@/lib/utils/supabase'

export default async function handleImageUpload(formData: FormData) {
  try {
    const supabase = await createClient()
    const image = formData.get('file') as File
    const { data, error } = await supabase.storage
      .from('messages_storage')
      .upload(`messages/${Date.now()}-${image.name}`, image)
    console.log(data)
    console.log(error)
  } catch (error) {
    console.log(error)
  }
}
