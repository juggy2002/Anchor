import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getUserRole = async (userId, accessToken) => {
  console.log("checking role for:", userId)
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/organisation_members?select=role,organisation_id&user_id=eq.${userId}&role=eq.admin`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${accessToken || supabaseAnonKey}`,
        }
      }
    )
    const data = await response.json()
    console.log("role result:", data)
    if (data && data.length > 0) return data[0]
    return null
  } catch (e) {
    console.log("error:", e)
    return null
  }
}