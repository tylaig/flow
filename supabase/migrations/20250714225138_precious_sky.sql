/*
  # Sistema de Gerenciamento de Fluxos

  1. Novas Tabelas
    - `flows`
      - `id` (uuid, primary key)
      - `name` (text, nome do fluxo)
      - `description` (text, descrição opcional)
      - `data` (jsonb, dados do fluxo - nodes e edges)
      - `config` (jsonb, configurações do widget)
      - `owner_id` (uuid, referência ao usuário criador)
      - `is_public` (boolean, se o fluxo é público)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `flow_permissions`
      - `id` (uuid, primary key)
      - `flow_id` (uuid, referência ao fluxo)
      - `user_id` (uuid, referência ao usuário)
      - `permission_level` (enum: 'editor', 'viewer')
      - `granted_by` (uuid, quem concedeu a permissão)
      - `created_at` (timestamp)
    
    - `flow_executions`
      - `id` (uuid, primary key)
      - `flow_id` (uuid, referência ao fluxo)
      - `session_id` (text, identificador da sessão)
      - `variables` (jsonb, variáveis da execução)
      - `current_node` (text, nó atual)
      - `status` (enum: 'active', 'completed', 'error')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em todas as tabelas
    - Políticas para controle de acesso baseado em permissões
    - Funções para verificação de permissões

  3. Índices
    - Otimização para consultas frequentes
*/

-- Criar enum para níveis de permissão
CREATE TYPE permission_level AS ENUM ('editor', 'viewer');

-- Criar enum para status de execução
CREATE TYPE execution_status AS ENUM ('active', 'completed', 'error');

-- Tabela de fluxos
CREATE TABLE IF NOT EXISTS flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  data jsonb NOT NULL DEFAULT '{"nodes": [], "edges": []}',
  config jsonb NOT NULL DEFAULT '{"title": "Atendente Virtual", "avatarUrl": "https://i.pravatar.cc/80?u=bot", "themeColor": "#7B2CBF", "welcomeMessage": "Olá! Como posso te ajudar hoje?"}',
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de permissões de fluxo
CREATE TABLE IF NOT EXISTS flow_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level permission_level NOT NULL DEFAULT 'viewer',
  granted_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(flow_id, user_id)
);

-- Tabela de execuções de fluxo
CREATE TABLE IF NOT EXISTS flow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid NOT NULL REFERENCES flows(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  variables jsonb DEFAULT '{}',
  current_node text,
  status execution_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_executions ENABLE ROW LEVEL SECURITY;

-- Função para verificar permissões de fluxo
CREATE OR REPLACE FUNCTION check_flow_permission(flow_uuid uuid, user_uuid uuid, required_level permission_level)
RETURNS boolean AS $$
BEGIN
  -- Verificar se é o dono do fluxo
  IF EXISTS (
    SELECT 1 FROM flows 
    WHERE id = flow_uuid AND owner_id = user_uuid
  ) THEN
    RETURN true;
  END IF;
  
  -- Verificar permissões explícitas
  IF required_level = 'viewer' THEN
    RETURN EXISTS (
      SELECT 1 FROM flow_permissions 
      WHERE flow_id = flow_uuid 
      AND user_id = user_uuid 
      AND permission_level IN ('viewer', 'editor')
    );
  ELSIF required_level = 'editor' THEN
    RETURN EXISTS (
      SELECT 1 FROM flow_permissions 
      WHERE flow_id = flow_uuid 
      AND user_id = user_uuid 
      AND permission_level = 'editor'
    );
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas RLS para flows
CREATE POLICY "Users can view flows they own or have permission to"
  ON flows
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    is_public = true OR
    check_flow_permission(id, auth.uid(), 'viewer'::permission_level)
  );

CREATE POLICY "Users can create their own flows"
  ON flows
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update flows they own or have editor permission"
  ON flows
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    check_flow_permission(id, auth.uid(), 'editor'::permission_level)
  );

CREATE POLICY "Users can delete flows they own"
  ON flows
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Políticas RLS para flow_permissions
CREATE POLICY "Users can view permissions for flows they own or have access to"
  ON flow_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flows 
      WHERE id = flow_id 
      AND (owner_id = auth.uid() OR check_flow_permission(id, auth.uid(), 'viewer'::permission_level))
    )
  );

CREATE POLICY "Flow owners can manage permissions"
  ON flow_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flows 
      WHERE id = flow_id AND owner_id = auth.uid()
    )
  );

-- Políticas RLS para flow_executions
CREATE POLICY "Users can view executions for flows they have access to"
  ON flow_executions
  FOR SELECT
  TO authenticated
  USING (
    check_flow_permission(flow_id, auth.uid(), 'viewer'::permission_level)
  );

CREATE POLICY "Anyone can create flow executions for accessible flows"
  ON flow_executions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    check_flow_permission(flow_id, auth.uid(), 'viewer'::permission_level)
  );

CREATE POLICY "Users can update executions for flows they have access to"
  ON flow_executions
  FOR UPDATE
  TO authenticated
  USING (
    check_flow_permission(flow_id, auth.uid(), 'viewer'::permission_level)
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_flows_owner_id ON flows(owner_id);
CREATE INDEX IF NOT EXISTS idx_flows_is_public ON flows(is_public);
CREATE INDEX IF NOT EXISTS idx_flow_permissions_flow_id ON flow_permissions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_permissions_user_id ON flow_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_flow_executions_flow_id ON flow_executions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_executions_session_id ON flow_executions(session_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_flows_updated_at
  BEFORE UPDATE ON flows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flow_executions_updated_at
  BEFORE UPDATE ON flow_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();