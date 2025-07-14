import React, { useState, useEffect, useMemo } from 'react';
import { CustomNode } from '../types';
import { Edge } from 'reactflow';

interface LazyFlowLoaderProps {
  nodes: CustomNode[];
  edges: Edge[];
  children: (loadedNodes: CustomNode[], loadedEdges: Edge[], isLoading: boolean) => React.ReactNode;
  chunkSize?: number;
  loadDelay?: number;
}

export const LazyFlowLoader: React.FC<LazyFlowLoaderProps> = ({
  nodes,
  edges,
  children,
  chunkSize = 50,
  loadDelay = 100,
}) => {
  const [loadedNodes, setLoadedNodes] = useState<CustomNode[]>([]);
  const [loadedEdges, setLoadedEdges] = useState<Edge[]>([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const totalChunks = Math.ceil(nodes.length / chunkSize);

  // Memoizar chunks para evitar recálculos
  const nodeChunks = useMemo(() => {
    const chunks: CustomNode[][] = [];
    for (let i = 0; i < nodes.length; i += chunkSize) {
      chunks.push(nodes.slice(i, i + chunkSize));
    }
    return chunks;
  }, [nodes, chunkSize]);

  // Carregar chunks progressivamente
  useEffect(() => {
    if (currentChunk >= totalChunks) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const newNodes = nodeChunks[currentChunk] || [];
      setLoadedNodes(prev => [...prev, ...newNodes]);
      
      // Carregar edges relacionadas aos nós carregados
      const loadedNodeIds = new Set([...loadedNodes, ...newNodes].map(n => n.id));
      const relevantEdges = edges.filter(edge => 
        loadedNodeIds.has(edge.source) && loadedNodeIds.has(edge.target)
      );
      setLoadedEdges(relevantEdges);
      
      setCurrentChunk(prev => prev + 1);
    }, loadDelay);

    return () => clearTimeout(timer);
  }, [currentChunk, totalChunks, nodeChunks, edges, loadedNodes, loadDelay]);

  // Reset quando nodes/edges mudam
  useEffect(() => {
    setLoadedNodes([]);
    setLoadedEdges([]);
    setCurrentChunk(0);
    setIsLoading(true);
  }, [nodes.length, edges.length]);

  return (
    <>
      {children(loadedNodes, loadedEdges, isLoading)}
      {isLoading && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flow-loading-spinner"></div>
            <span className="text-sm text-gray-600">
              Carregando... {Math.round((currentChunk / totalChunks) * 100)}%
            </span>
          </div>
        </div>
      )}
    </>
  );
};