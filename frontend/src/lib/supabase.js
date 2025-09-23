import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bynplwqqzlzfbdrbvuzk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bnBsd3Fxemx6ZmJkcmJ2dXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDQ4NDIsImV4cCI6MjA2MjgyMDg0Mn0.w69ANA33wQnVONct7WX-lDrWqFZNWhuV96iHf5AKrXM'

export const supabase = createClient(supabaseUrl, supabaseKey)