
import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from 'reactflow';

import { nodeTypes } from './CustomNodes';
import { CustomEdge } from './CustomEdge';

const edgeTypes = {
  custom: CustomEdge,
};

const defaultEdgeOptions = {
  type: 'custom',
  animated: true,
  style: { stroke: '#8B5CF6', strokeWidth: 3 }
};


interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) => {
  return (
    <div className="flex-grow bg-gradient-to-br from-slate-50 to-slate-100 h-full w-full transition-all duration-300" style={{ position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        className="typebot-flow"
      >
        <Controls />
        <MiniMap 
          nodeColor={n => {
            if (!n.data?.type) {
                return '#8B5CF6';
            }
            switch (n.data.type) {
              case 'Start': return '#10B981';
              case 'Options':
              case 'List':
              case 'Condition': return '#F59E0B';
              case 'AICall': return '#A855F7';
              default: return '#8B5CF6';
            }
          }}
          nodeStrokeWidth={2}
          pannable 
          zoomable
          style={{
            backgroundColor: '#F8FAFC',
            border: '2px solid #E2E8F0',
            borderRadius: '8px'
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#CBD5E1" />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
