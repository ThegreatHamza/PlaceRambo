import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://utoaxjevzeqdkidycerd.supabase.co'
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ID7arOtSgyPgd0Zxu1Z9EQ_QVZ0UIgO'

export const supabase = createClient(url, key)
