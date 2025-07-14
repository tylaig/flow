import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipos para o sistema de fluxos
export type Flow = Database['public']['Tables']['flows']['Row'];
export type FlowInsert = Database['public']['Tables']['flows']['Insert'];
export type FlowUpdate = Database['public']['Tables']['flows']['Update'];

export type FlowPermission = Database['public']['Tables']['flow_permissions']['Row'];
export type FlowPermissionInsert = Database['public']['Tables']['flow_permissions']['Insert'];

export type FlowExecution = Database['public']['Tables']['flow_executions']['Row'];
export type FlowExecutionInsert = Database['public']['Tables']['flow_executions']['Insert'];
export type FlowExecutionUpdate = Database['public']['Tables']['flow_executions']['Update'];

export type PermissionLevel = 'editor' | 'viewer';
export type ExecutionStatus = 'active' | 'completed' | 'error';