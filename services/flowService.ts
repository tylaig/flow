import { supabase, Flow, FlowInsert, FlowUpdate, FlowPermission, PermissionLevel } from '../lib/supabase';
import { CustomNode, WidgetConfig } from '../types';
import { Edge } from 'reactflow';

export interface FlowData {
  nodes: CustomNode[];
  edges: Edge[];
}

export interface FlowWithPermissions extends Flow {
  permissions?: FlowPermission[];
  owner_email?: string;
  user_permission?: PermissionLevel;
}

/**
 * Serviço para gerenciamento de fluxos
 */
export class FlowService {
  /**
   * Criar um novo fluxo
   */
  static async createFlow(
    name: string,
    description: string = '',
    data: FlowData,
    config: WidgetConfig
  ): Promise<{ data: Flow | null; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: { message: 'Usuário não autenticado' } };
    }

    const flowData: FlowInsert = {
      name,
      description,
      data: data as any,
      config: config as any,
      owner_id: user.user.id,
    };

    const { data: flow, error } = await supabase
      .from('flows')
      .insert(flowData)
      .select()
      .single();

    return { data: flow, error };
  }

  /**
   * Obter todos os fluxos do usuário atual
   */
  static async getUserFlows(): Promise<{ data: FlowWithPermissions[] | null; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: { message: 'Usuário não autenticado' } };
    }

    const { data: flows, error } = await supabase
      .from('flows')
      .select(`
        *,
        flow_permissions (
          id,
          user_id,
          permission_level,
          granted_by
        )
      `)
      .order('updated_at', { ascending: false });

    return { data: flows as FlowWithPermissions[], error };
  }

  /**
   * Obter um fluxo específico por ID
   */
  static async getFlowById(id: string): Promise<{ data: FlowWithPermissions | null; error: any }> {
    const { data: flow, error } = await supabase
      .from('flows')
      .select(`
        *,
        flow_permissions (
          id,
          user_id,
          permission_level,
          granted_by
        )
      `)
      .eq('id', id)
      .single();

    return { data: flow as FlowWithPermissions, error };
  }

  /**
   * Atualizar um fluxo
   */
  static async updateFlow(
    id: string,
    updates: Partial<FlowUpdate>
  ): Promise<{ data: Flow | null; error: any }> {
    const { data: flow, error } = await supabase
      .from('flows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data: flow, error };
  }

  /**
   * Salvar dados do fluxo (nodes e edges)
   */
  static async saveFlowData(
    id: string,
    data: FlowData
  ): Promise<{ data: Flow | null; error: any }> {
    return this.updateFlow(id, { data: data as any });
  }

  /**
   * Salvar configuração do widget
   */
  static async saveFlowConfig(
    id: string,
    config: WidgetConfig
  ): Promise<{ data: Flow | null; error: any }> {
    return this.updateFlow(id, { config: config as any });
  }

  /**
   * Deletar um fluxo
   */
  static async deleteFlow(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('flows')
      .delete()
      .eq('id', id);

    return { error };
  }

  /**
   * Compartilhar fluxo com outro usuário
   */
  static async shareFlow(
    flowId: string,
    userEmail: string,
    permissionLevel: PermissionLevel
  ): Promise<{ data: FlowPermission | null; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { data: null, error: { message: 'Usuário não autenticado' } };
    }

    // Buscar o usuário pelo email
    const { data: targetUser, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !targetUser) {
      return { data: null, error: { message: 'Usuário não encontrado' } };
    }

    const { data: permission, error } = await supabase
      .from('flow_permissions')
      .upsert({
        flow_id: flowId,
        user_id: targetUser.id,
        permission_level: permissionLevel,
        granted_by: user.user.id,
      })
      .select()
      .single();

    return { data: permission, error };
  }

  /**
   * Remover permissão de um usuário
   */
  static async removePermission(
    flowId: string,
    userId: string
  ): Promise<{ error: any }> {
    const { error } = await supabase
      .from('flow_permissions')
      .delete()
      .eq('flow_id', flowId)
      .eq('user_id', userId);

    return { error };
  }

  /**
   * Verificar permissão do usuário atual para um fluxo
   */
  static async checkUserPermission(
    flowId: string
  ): Promise<{ permission: PermissionLevel | null; isOwner: boolean }> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return { permission: null, isOwner: false };
    }

    // Verificar se é o dono
    const { data: flow } = await supabase
      .from('flows')
      .select('owner_id')
      .eq('id', flowId)
      .single();

    if (flow?.owner_id === user.user.id) {
      return { permission: 'editor', isOwner: true };
    }

    // Verificar permissões explícitas
    const { data: permission } = await supabase
      .from('flow_permissions')
      .select('permission_level')
      .eq('flow_id', flowId)
      .eq('user_id', user.user.id)
      .single();

    return { 
      permission: permission?.permission_level || null, 
      isOwner: false 
    };
  }

  /**
   * Exportar fluxo em formato JSON
   */
  static async exportFlow(id: string): Promise<{ data: any | null; error: any }> {
    const { data: flow, error } = await this.getFlowById(id);
    
    if (error || !flow) {
      return { data: null, error };
    }

    const exportData = {
      name: flow.name,
      description: flow.description,
      data: flow.data,
      config: flow.config,
      exported_at: new Date().toISOString(),
      version: '1.0',
    };

    return { data: exportData, error: null };
  }

  /**
   * Duplicar um fluxo
   */
  static async duplicateFlow(id: string): Promise<{ data: Flow | null; error: any }> {
    const { data: originalFlow, error: fetchError } = await this.getFlowById(id);
    
    if (fetchError || !originalFlow) {
      return { data: null, error: fetchError };
    }

    return this.createFlow(
      `${originalFlow.name} (Cópia)`,
      originalFlow.description || '',
      originalFlow.data as FlowData,
      originalFlow.config as WidgetConfig
    );
  }
}