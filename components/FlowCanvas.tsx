
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
  style: { stroke: '#52525b', strokeWidth: 2 }
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
    <div className="flex-grow bg-dark-bg h-full w-full" style={{ position: 'relative' }}>
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
                return '#3B82F6';
            }
            switch (n.data.type) {
              case 'Start': return '#22C55E';
              case 'Options':
              case 'List':
              case 'Condition': return '#F97316';
              case 'AICall': return '#8B5CF6';
              default: return '#3B82F6';
            }
          }}
          nodeStrokeWidth={3}
          pannable 
          zoomable
          style={{
            backgroundColor: '#111827',
            border: '1px solid #374151'
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#27272a" />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
