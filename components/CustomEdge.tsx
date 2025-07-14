
import React, { useState } from 'react';
import { getSmoothStepPath, EdgeProps, EdgeLabelRenderer } from 'reactflow';
import { useFlowContext } from '../FlowContext';
import { TrashIcon } from './icons';

export const CustomEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { deleteEdge } = useFlowContext();
    const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    
    return (
        <>
            <path
                id={id}
                style={{ 
                    ...style, 
                    strokeDasharray: isHovered ? '5 5' : 'none',
                    stroke: isHovered ? '#E53935' : '#FF6B2B',
                    strokeWidth: isHovered ? 3 : 2,
                    filter: isHovered ? 'drop-shadow(0 2px 4px rgba(255, 107, 43, 0.3))' : 'none'
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            {/* A path with a larger stroke width to make it easier to hover */}
            <path
                d={edgePath}
                fill="none"
                strokeOpacity={0}
                strokeWidth={20}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
             />
            {isHovered && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <button
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-125 shadow-lg hover:shadow-xl"
                            onClick={() => deleteEdge(id)}
                            title="Excluir conexão"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
};
