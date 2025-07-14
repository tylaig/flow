import React, { useState, useCallback } from 'react';
import { addEdge, useNodesState, useEdgesState, Connection, Edge, Node } from 'reactflow';
import Sidebar from './components/Sidebar';
import FlowCanvas from './components/FlowCanvas';
import PhonePreview from './components/PhonePreview';
import Header from './components/Header';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import EndpointTestModal from './components/EndpointTestModal';
import WidgetCustomizationModal from './components/WidgetCustomizationModal';
import { BlockType, ChatBlock, CustomNode, WidgetConfig } from './types';
import { FlowContext } from './FlowContext';

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

const App: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [view, setView] = useState<'builder' | 'analytics'>('builder');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: true, style: {stroke: '#52525b', strokeWidth: 2} }, eds)),
    [setEdges]
  );

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


  const flowContextValue = {
    deleteNode,
    updateNode,
    deleteEdge,
    duplicateNode,
  };

  return (
    <FlowContext.Provider value={flowContextValue}>
      <div className="h-screen w-screen flex flex-col bg-dark-bg text-white">
        <Header 
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
                className="fixed top-20 left-4 z-30 bg-brand-primary hover:bg-brand-secondary text-white rounded-full p-3 shadow-lg transition-colors"
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
              <div className="bg-dark-bg p-8 flex-shrink-0 flex items-center justify-center border-l border-dark-border">
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
    </FlowContext.Provider>
  );
};

export default App;