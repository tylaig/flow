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
      flows: {
        Row: {
          id: string
          name: string
          description: string | null
          data: Json
          config: Json
          owner_id: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          data?: Json
          config?: Json
          owner_id: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          data?: Json
          config?: Json
          owner_id?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      flow_permissions: {
        Row: {
          id: string
          flow_id: string
          user_id: string
          permission_level: 'editor' | 'viewer'
          granted_by: string
          created_at: string
        }
        Insert: {
          id?: string
          flow_id: string
          user_id: string
          permission_level?: 'editor' | 'viewer'
          granted_by: string
          created_at?: string
        }
        Update: {
          id?: string
          flow_id?: string
          user_id?: string
          permission_level?: 'editor' | 'viewer'
          granted_by?: string
          created_at?: string
        }
      }
      flow_executions: {
        Row: {
          id: string
          flow_id: string
          session_id: string
          variables: Json
          current_node: string | null
          status: 'active' | 'completed' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          flow_id: string
          session_id: string
          variables?: Json
          current_node?: string | null
          status?: 'active' | 'completed' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          flow_id?: string
          session_id?: string
          variables?: Json
          current_node?: string | null
          status?: 'active' | 'completed' | 'error'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_flow_permission: {
        Args: {
          flow_uuid: string
          user_uuid: string
          required_level: 'editor' | 'viewer'
        }
        Returns: boolean
      }
    }
    Enums: {
      permission_level: 'editor' | 'viewer'
      execution_status: 'active' | 'completed' | 'error'
    }
  }
}