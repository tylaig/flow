import React, { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeChange,
  EdgeChange,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';

import { nodeTypes } from './OptimizedCustomNodes';
import { CustomEdge } from './CustomEdge';
import { useFlowOptimization } from '../hooks/useFlowOptimization';
import { CustomNode } from '../types';

const edgeTypes = {
  custom: CustomEdge,
};

const defaultEdgeOptions = {
  type: 'custom',
  animated: true,
  style: { stroke: '#FF6B2B', strokeWidth: 2 }
};

// Configurações otimizadas do React Flow
const flowConfig = {
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  selectNodesOnDrag: false,
  panOnDrag: true,
  minZoom: 0.5,
  maxZoom: 2,
  defaultZoom: 1,
  fitViewOptions: {
    padding: 0.2,
    includeHiddenNodes: false,
  },
  // Otimizações de performance
  nodeExtent: [[-5000, -5000], [5000, 5000]], // Limitar área de movimento
  translateExtent: [[-5000, -5000], [5000, 5000]], // Limitar área de pan
};

interface OptimizedFlowCanvasProps {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const FlowCanvasContent: React.FC<OptimizedFlowCanvasProps> = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect 
}) => {
  const { fitView } = useReactFlow();
  const lastUpdateRef = useRef<number>(0);
  
  const {
    visibleNodes,
    visibleEdges,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    updateVisibleNodes,
    debouncedDragHandler,
    cacheNodePosition,
  } = useFlowOptimization(nodes, edges);

  // Handlers otimizados com useCallback
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    const now = Date.now();
    
    // Throttle para evitar muitas atualizações
    if (now - lastUpdateRef.current < 16) { // ~60fps
      return;
    }
    lastUpdateRef.current = now;

    // Cache posições durante drag
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        cacheNodePosition(change.id, change.position);
      }
    });

    // Aplicar debounce para operações de drag
    const hasDragChanges = changes.some(change => change.type === 'position' && change.dragging);
    
    if (hasDragChanges) {
      debouncedDragHandler(() => {
        onNodesChange(changes);
        updateVisibleNodes();
      });
    } else {
      onNodesChange(changes);
      updateVisibleNodes();
    }
  }, [onNodesChange, debouncedDragHandler, cacheNodePosition, updateVisibleNodes]);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const handleConnect = useCallback((connection: any) => {
    onConnect(connection);
  }, [onConnect]);

  // Configuração do MiniMap otimizada
  const minimapNodeColor = useCallback((node: Node) => {
    if (!node.data?.type) return '#FF6B2B';
    
    switch (node.data.type) {
      case 'Start': return '#10B981';
      case 'Options':
      case 'List':
      case 'Condition': return '#E53935';
      case 'AICall': return '#8B5CF6';
      default: return '#FF6B2B';
    }
  }, []);

  // Paginação UI
  const PaginationControls = useMemo(() => (
    totalPages > 1 ? (
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            ←
          </button>
          <span className="text-gray-600">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            →
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {visibleNodes.length} nós visíveis
        </div>
      </div>
    ) : null
  ), [currentPage, totalPages, nextPage, prevPage, visibleNodes.length]);

  return (
    <div className="flex-grow bg-gray-50 h-full w-full relative">
      {PaginationControls}
      
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        {...flowConfig}
        attribution={false} // Remove marca d'água
        className="optimized-flow"
      >
        <Controls 
          className="modern-controls"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        
        <MiniMap 
          nodeColor={minimapNodeColor}
          nodeStrokeWidth={2}
          pannable 
          zoomable
          className="modern-minimap"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            width: 200,
            height: 150,
          }}
          // Otimizações do MiniMap
          maskColor="rgba(0, 0, 0, 0.1)"
          maskStrokeColor="#FF6B2B"
          maskStrokeWidth={2}
        />
        
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1} 
          color="rgba(0,0,0,0.05)" 
        />
      </ReactFlow>
    </div>
  );
};

const OptimizedFlowCanvas: React.FC<OptimizedFlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent {...props} />
    </ReactFlowProvider>
  );
};

export default OptimizedFlowCanvas;