import React, { useState, useCallback } from 'react';
import { addEdge, useNodesState, useEdgesState, Connection, Edge, Node } from 'reactflow';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { EditingProvider } from './contexts/EditingContext';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import FlowList from './components/flows/FlowList';
import CreateFlowModal from './components/flows/CreateFlowModal';
import { FlowService, FlowWithPermissions } from './services/flowService';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import PhonePreview from './components/PhonePreview';
import Header from './components/Header';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import EndpointTestModal from './components/EndpointTestModal';
import WidgetCustomizationModal from './components/WidgetCustomizationModal';
import { BlockType, ChatBlock, CustomNode, WidgetConfig } from './types';
import { FlowContext } from './FlowContext';
import { UserIcon, LogoutIcon } from './components/icons';

const initialNodes: CustomNode[] = [
  { 
    id: 'start-1', 
    type: BlockType.Start, 
    position: { x: 250, y: 50 }, 
    data: { id: 'start-1', type: BlockType.Start },
  },
  {
    id: 'text-1',
    type: BlockType.Text,
    position: { x: 150, y: 200 },
    data: {
      id: 'text-1',
      type: BlockType.Text,
      content: 'Olá! Bem-vindo à nossa loja. Como posso ajudar?',
    },
  },
];

const initialEdges: Edge[] = [
    { id: 'e-start1-text1', source: 'start-1', target: 'text-1', type: 'custom', animated: true }
];

const AppContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentFlow, setCurrentFlow] = useState<FlowWithPermissions | null>(null);
  const [showFlowList, setShowFlowList] = useState(true);
  const [view, setView] = useState<'builder' | 'analytics'>('builder');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Auto-save do fluxo atual
  const autoSaveFlow = useCallback(async () => {
    if (!currentFlow) return;
    
    await FlowService.saveFlowData(currentFlow.id, { nodes, edges });
  }, [currentFlow, nodes, edges]);

  // Configurar auto-save quando nodes ou edges mudarem
  React.useEffect(() => {
    if (!currentFlow) return;
    
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(autoSaveFlow, 2000); // Auto-save após 2 segundos de inatividade
    setAutoSaveTimeout(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [nodes, edges, currentFlow, autoSaveFlow]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true, style: {stroke: '#52525b', strokeWidth: 2} }, eds)),
    [setEdges]
  );

  const handleSelectFlow = async (flow: FlowWithPermissions) => {
    setCurrentFlow(flow);
    setShowFlowList(false);
    
    // Carregar dados do fluxo
    const flowData = flow.data as { nodes: CustomNode[]; edges: Edge[] };
    if (flowData?.nodes && flowData?.edges) {
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
    }
  };

  const handleCreateFlow = () => {
    setIsCreateModalOpen(true);
  };

  const handleFlowCreated = (flowId: string) => {
    setIsCreateModalOpen(false);
    // Recarregar lista de fluxos ou navegar para o novo fluxo
    window.location.reload();
  };

  const addNode = useCallback((type: BlockType) => {
    const id = `${type.toLowerCase()}-${Date.now()}`;
    const x = (window.innerWidth / 2) - 450 + Math.random() * 150;
    const y = 100 + Math.random() * 100;

    let data: ChatBlock;
    let newNode: CustomNode;

    switch (type) {
      case BlockType.Text:
        data = { id, type, content: '' };
        break;
      case BlockType.Image:
        data = { id, type, url: '' };
        break;
      case BlockType.Audio:
        data = { id, type, url: '' };
        break;
      case BlockType.Video:
        data = { id, type, url: '' };
        break;
      case BlockType.Document:
        data = { id, type, url: '', filename: 'documento.pdf' };
        break;
      case BlockType.Location:
        data = { id, type, latitude: '', longitude: '', name: '', address: '' };
        break;
      case BlockType.Template:
        data = { id, type, templateName: '', variables: '' };
        break;
      case BlockType.Options:
        data = { id, type, message: '', options: [{ id: `opt-${Date.now()}`, label: 'Opção 1' }] };
        break;
      case BlockType.List:
        data = { id, type, message: '', buttonText: 'Ver Opções', options: [{ id: `opt-${Date.now()}`, label: 'Item 1' }] };
        break;
      case BlockType.AICall:
        data = { id, type, prompt: '', variableToSave: '' };
        break;
      case BlockType.Condition:
        data = { id, type, clause: { variable: '', operator: 'equals', value: '' } };
        break;
      case BlockType.SaveResponse:
        data = { id, type, message: 'Qual é a sua resposta?', variableToSave: 'resposta_usuario' };
        break;
      case BlockType.Delay:
        data = { id, type, seconds: 2 };
        break;
      case BlockType.Integration:
        data = { id, type, url: '', method: 'GET', headers: '{}', body: '{}', variableToSave: 'api_response' };
        break;
      case BlockType.Group:
        data = { id, type, label: 'Novo Grupo' };
        newNode = { id, type, position: { x, y }, data, style: { width: 500, height: 400, backgroundColor: 'rgba(107, 114, 128, 0.1)' } };
        setNodes((nds) => nds.concat(newNode));
        setIsSidebarOpen(false); // Fecha o sidebar após adicionar um bloco
        return;
      default:
        return;
    }

    newNode = { id, type, position: { x, y }, data };
    setNodes((nds) => nds.concat(newNode));
    setIsSidebarOpen(false); // Fecha o sidebar após adicionar um bloco
  }, [setNodes]);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);
    
  const updateNode = useCallback((id: string, data: ChatBlock) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data } : n));
  }, [setNodes]);

  const deleteEdge = useCallback((id: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, [setEdges]);

  const duplicateNode = useCallback((id: string) => {
    const nodeToDuplicate = nodes.find((n) => n.id === id);
    if (!nodeToDuplicate) return;

    const newId = `${nodeToDuplicate.data.type.toLowerCase()}-${Date.now()}`;
    const newNode: CustomNode = {
      ...nodeToDuplicate,
      id: newId,
      data: {
        ...nodeToDuplicate.data,
        id: newId,
      },
      position: {
        x: nodeToDuplicate.position.x + 30,
        y: nodeToDuplicate.position.y + 30,
      },
      selected: false,
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);
  
  const downloadFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(flowData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "flow.json";
    link.click();
  }, [nodes, edges]);

  const handleGeneratePreview = useCallback((config: WidgetConfig) => {
      const flowData = { nodes, edges, config };
      try {
          localStorage.setItem('previewFlowData', JSON.stringify(flowData));
          const previewWindow = window.open('/preview.html', '_blank');
          if (previewWindow) {
              previewWindow.focus();
          } else {
              alert('Por favor, habilite pop-ups para ver o preview.');
          }
      } catch (error) {
          console.error("Error saving to localStorage", error);
          alert("Não foi possível salvar os dados do fluxo. O localStorage pode estar cheio ou desabilitado.");
      }
      setIsWidgetModalOpen(false);
  }, [nodes, edges]);

  const handleSignOut = async () => {
    await signOut();
    setCurrentFlow(null);
    setShowFlowList(true);
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Authentication screens
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Typebot WhatsApp Pro
            </h1>
            <p className="text-gray-600">
              Crie chatbots inteligentes para WhatsApp
            </p>
          </div>
          
          {authMode === 'login' ? (
            <LoginForm onToggleMode={() => setAuthMode('signup')} />
          ) : (
            <SignUpForm onToggleMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  // Flow list screen
  if (showFlowList) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Typebot WhatsApp Pro
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <UserIcon />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Sair"
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </header>
        
        <FlowList 
          onSelectFlow={handleSelectFlow}
          onCreateNew={handleCreateFlow}
        />
        
        {isCreateModalOpen && (
          <CreateFlowModal
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleFlowCreated}
          />
        )}
      </div>
    );
  }

  const flowContextValue = {
    deleteNode,
    updateNode,
    deleteEdge,
    duplicateNode,
  };

  return (
      <div className="h-screen w-screen flex flex-col bg-white text-gray-900">
        <Header 
          currentFlow={currentFlow}
          onBackToFlows={() => setShowFlowList(true)}
          onSignOut={handleSignOut}
          currentView={view} 
          setView={setView} 
          onDownload={downloadFlow}
          onTestEndpoint={() => setIsTestModalOpen(true)}
          onGeneratePreview={() => setIsWidgetModalOpen(true)}
        />
        <main className="flex flex-grow overflow-hidden">
          {view === 'builder' ? (
            <>
              {/* Botão para abrir sidebar */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-20 left-4 z-30 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg transition-colors"
                title="Adicionar Bloco"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* Sidebar retrátil */}
              <Sidebar 
                addNode={addNode} 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
              />
              
              {/* Overlay para fechar sidebar */}
              {isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-20"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              
              <FlowCanvas nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} />
              <div className="bg-gray-50 p-8 flex-shrink-0 flex items-center justify-center border-l border-gray-200">
                <PhonePreview nodes={nodes} edges={edges} />
              </div>
            </>
          ) : (
            <AnalyticsDashboard />
          )}
        </main>
        {isTestModalOpen && (
            <EndpointTestModal
                nodes={nodes}
                edges={edges}
                onClose={() => setIsTestModalOpen(false)}
            />
        )}
        {isWidgetModalOpen && (
            <WidgetCustomizationModal 
                onClose={() => setIsWidgetModalOpen(false)}
                onGenerate={handleGeneratePreview}
            />
        )}
      </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EditingProvider>
        <FlowContext.Provider value={flowContextValue}>
          <AppContent />
        </FlowContext.Provider>
      </EditingProvider>
    </AuthProvider>
  );
};

export default App;