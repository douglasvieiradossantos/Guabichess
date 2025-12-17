"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Usuário não autenticado" }
  }

  const fullName = formData.get("fullname") as string
  const bio = formData.get("bio") as string

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    full_name: fullName,
    bio: bio,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/perfil")
  return { success: true }
}
