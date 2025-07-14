import React, { useState, useEffect } from 'react';
import { FlowService, FlowWithPermissions } from '../../services/flowService';
import { useAuth } from '../auth/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  PlusIcon, 
  TrashIcon, 
  ShareIcon, 
  DuplicateIcon, 
  DownloadIcon,
  FlowIcon,
  LockIcon,
  UnlockIcon
} from '../icons';

interface FlowListProps {
  onSelectFlow: (flow: FlowWithPermissions) => void;
  onCreateNew: () => void;
}

const FlowList: React.FC<FlowListProps> = ({ onSelectFlow, onCreateNew }) => {
  const [flows, setFlows] = useState<FlowWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    setLoading(true);
    const { data, error } = await FlowService.getUserFlows();
    
    if (error) {
      setError(error.message);
    } else {
      setFlows(data || []);
    }
    
    setLoading(false);
  };

  const handleDeleteFlow = async (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir este fluxo? Esta ação não pode ser desfeita.')) {
      return;
    }

    const { error } = await FlowService.deleteFlow(flowId);
    
    if (error) {
      alert('Erro ao excluir fluxo: ' + error.message);
    } else {
      setFlows(flows.filter(f => f.id !== flowId));
    }
  };

  const handleDuplicateFlow = async (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { data, error } = await FlowService.duplicateFlow(flowId);
    
    if (error) {
      alert('Erro ao duplicar fluxo: ' + error.message);
    } else {
      loadFlows(); // Recarregar lista
    }
  };

  const handleExportFlow = async (flowId: string, flowName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { data, error } = await FlowService.exportFlow(flowId);
    
    if (error) {
      alert('Erro ao exportar fluxo: ' + error.message);
      return;
    }

    // Download do arquivo JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUserPermission = (flow: FlowWithPermissions) => {
    if (flow.owner_id === user?.id) return 'owner';
    
    const permission = flow.permissions?.find(p => p.user_id === user?.id);
    return permission?.permission_level || null;
  };

  const getPermissionIcon = (flow: FlowWithPermissions) => {
    const permission = getUserPermission(flow);
    
    if (permission === 'owner') return null;
    if (permission === 'editor') return <UnlockIcon className="w-4 h-4 text-orange-500" />;
    if (permission === 'viewer') return <LockIcon className="w-4 h-4 text-gray-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadFlows}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Fluxos</h1>
          <p className="text-gray-600 mt-2">Gerencie seus chatbots e automações</p>
        </div>
        
        <button
          onClick={onCreateNew}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <PlusIcon />
          <span>Novo Fluxo</span>
        </button>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-16">
          <FlowIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum fluxo encontrado</h3>
          <p className="text-gray-600 mb-6">Crie seu primeiro chatbot para começar</p>
          <button
            onClick={onCreateNew}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Criar primeiro fluxo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => {
            const permission = getUserPermission(flow);
            const isOwner = permission === 'owner';
            const canEdit = isOwner || permission === 'editor';
            
            return (
              <div
                key={flow.id}
                onClick={() => onSelectFlow(flow)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {flow.name}
                        </h3>
                        {getPermissionIcon(flow)}
                      </div>
                      
                      {flow.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {flow.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      Atualizado {formatDistanceToNow(new Date(flow.updated_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </span>
                    
                    {flow.is_public && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Público
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {isOwner ? 'Proprietário' : `Acesso: ${permission}`}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleExportFlow(flow.id, flow.name, e)}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="Exportar fluxo"
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                      
                      {canEdit && (
                        <button
                          onClick={(e) => handleDuplicateFlow(flow.id, e)}
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                          title="Duplicar fluxo"
                        >
                          <DuplicateIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      {isOwner && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implementar modal de compartilhamento
                              alert('Modal de compartilhamento será implementado');
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Compartilhar fluxo"
                          >
                            <ShareIcon className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => handleDeleteFlow(flow.id, e)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Excluir fluxo"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlowList;