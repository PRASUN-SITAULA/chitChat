'use server'

import { createClient } from '@/lib/utils/supabase'

export default async function handleImageUpload(formData: FormData) {
  try {
    const supabase = await createClient()
    const image = formData.get('file') as File
    const { data, error } = await supabase.storage
      .from('messages_storage')
      .upload(`messages/${Date.now()}-${image.name}`, image)

    if (error) {
      return { error: error }
    }
    // Get the public URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from('messages_storage').getPublicUrl(data.path)

    return { success: 'Image uploaded successfully', data: publicUrl }
  } catch (error) {
    return { error: 'An error occurred while uploading the image' }
    console.log(error)
  }
}
