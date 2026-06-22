import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  price: number
  original_price: number | null
  description: string | null
  cover_image: string | null
  photos: string[]
  status: '在庫' | '預訂中' | '已售出'
  brand: string
  storage: string | null
  color: string | null
  condition: '全新' | '九成新' | '八成新' | '七成新' | null
  views: number
  is_featured: boolean
  created_at: string
}

export type Inquiry = {
  id: string
  product_id: string
  customer_name: string
  customer_phone: string | null
  message: string | null
  is_read: boolean
  created_at: string
}
