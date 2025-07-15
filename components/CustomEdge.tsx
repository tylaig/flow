
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
                style={{ ...style, strokeDasharray: isHovered ? '8 8' : 'none', strokeWidth: isHovered ? 4 : 3 }}
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
                strokeWidth={24}
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
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 shadow-xl border-2 border-white"
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
