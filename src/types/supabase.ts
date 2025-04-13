// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
          role_id: string | null
          job_title: string | null
          last_login_at: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          role_id?: string | null
          job_title?: string | null
          last_login_at?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          role_id?: string | null
          job_title?: string | null
          last_login_at?: string | null
          avatar_url?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          status: string
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          logo_url: string | null
          category: string | null
          score: number | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          logo_url?: string | null
          category?: string | null
          score?: number | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          logo_url?: string | null
          category?: string | null
          score?: number | null
        }
      }
      contracts: {
        Row: {
          id: string
          vendor_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          value: number
          status: string
          created_by: string | null
          created_at: string
          updated_at: string
          is_urgent: boolean
          vendors?: {
            name: string
            logo_url: string | null
          }
        }
        Insert: {
          id?: string
          vendor_id: string
          title: string
          description?: string | null
          start_date: string
          end_date: string
          value?: number
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_urgent?: boolean
        }
        Update: {
          id?: string
          vendor_id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          value?: number
          status?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_urgent?: boolean
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          description: string | null
          entity_type: string
          entity_id: string
          file_path: string
          file_type: string | null
          file_size: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          entity_type: string
          entity_id: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          entity_type?: string
          entity_id?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
    }
  }
} 