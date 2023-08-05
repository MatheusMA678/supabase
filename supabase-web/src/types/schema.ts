// yarn run v1.22.19
// $ /workspace/rn-supabase/supabase-web/node_modules/.bin/supabase gen types typescript --project-id ivrnsiypeuywzncgbfga --schema public
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          completed: boolean
          created_at: string
          id: number
          name: string
          userId: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: number
          name?: string
          userId: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: number
          name?: string
          userId?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
