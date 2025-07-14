
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
  style: { stroke: '#FF6B2B', strokeWidth: 2 }
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
    <div className="flex-grow bg-gray-50 h-full w-full transition-all duration-300" style={{ position: 'relative' }}>
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
        className="modern-flow"
      >
        <Controls className="modern-controls" />
        <MiniMap 
          nodeColor={n => {
            if (!n.data?.type) {
                return '#FF6B2B';
            }
            switch (n.data.type) {
              case 'Start': return '#10B981';
              case 'Options':
              case 'List':
              case 'Condition': return '#E53935';
              case 'AICall': return '#8B5CF6';
              default: return '#FF6B2B';
            }
          }}
          nodeStrokeWidth={3}
          pannable 
          zoomable
          className="modern-minimap"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px'
          }}
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

export default FlowCanvas;
