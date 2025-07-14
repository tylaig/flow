import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { Node, Edge, useReactFlow } from 'reactflow';
import { CustomNode } from '../types';

interface FlowOptimizationConfig {
  nodesPerPage: number;
  dragDebounceMs: number;
  viewportPadding: number;
  autoGroupDistance: number;
}

const defaultConfig: FlowOptimizationConfig = {
  nodesPerPage: 100,
  dragDebounceMs: 50,
  viewportPadding: 200,
  autoGroupDistance: 150,
};

export const useFlowOptimization = (
  allNodes: CustomNode[],
  allEdges: Edge[],
  config: Partial<FlowOptimizationConfig> = {}
) => {
  const finalConfig = { ...defaultConfig, ...config };
  const { getViewport } = useReactFlow();
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleNodes, setVisibleNodes] = useState<CustomNode[]>([]);
  const [visibleEdges, setVisibleEdges] = useState<Edge[]>([]);
  const dragTimeoutRef = useRef<NodeJS.Timeout>();
  const positionCacheRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Cache de posições dos nós
  const cacheNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    positionCacheRef.current.set(nodeId, position);
  }, []);

  const getCachedPosition = useCallback((nodeId: string) => {
    return positionCacheRef.current.get(nodeId);
  }, []);

  // Debounced drag handler
  const debouncedDragHandler = useCallback((callback: () => void) => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragTimeoutRef.current = setTimeout(callback, finalConfig.dragDebounceMs);
  }, [finalConfig.dragDebounceMs]);

  // Virtualização baseada na viewport
  const updateVisibleNodes = useCallback(() => {
    const viewport = getViewport();
    const { x, y, zoom } = viewport;
    
    // Calcular área visível com padding
    const viewportBounds = {
      left: -x / zoom - finalConfig.viewportPadding,
      top: -y / zoom - finalConfig.viewportPadding,
      right: (-x + window.innerWidth) / zoom + finalConfig.viewportPadding,
      bottom: (-y + window.innerHeight) / zoom + finalConfig.viewportPadding,
    };

    // Filtrar nós visíveis
    const visible = allNodes.filter(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      const nodeWidth = node.width || 380;
      const nodeHeight = node.height || 200;

      return (
        nodeX + nodeWidth >= viewportBounds.left &&
        nodeX <= viewportBounds.right &&
        nodeY + nodeHeight >= viewportBounds.top &&
        nodeY <= viewportBounds.bottom
      );
    });

    // Aplicar paginação
    const startIndex = currentPage * finalConfig.nodesPerPage;
    const endIndex = startIndex + finalConfig.nodesPerPage;
    const paginatedNodes = visible.slice(startIndex, endIndex);

    // Filtrar edges conectadas aos nós visíveis
    const visibleNodeIds = new Set(paginatedNodes.map(n => n.id));
    const relevantEdges = allEdges.filter(edge => 
      visibleNodeIds.has(edge.source) || visibleNodeIds.has(edge.target)
    );

    setVisibleNodes(paginatedNodes);
    setVisibleEdges(relevantEdges);
  }, [allNodes, allEdges, currentPage, finalConfig.nodesPerPage, finalConfig.viewportPadding, getViewport]);

  // Agrupamento automático por proximidade
  const autoGroupNodes = useCallback(() => {
    const groups: CustomNode[][] = [];
    const processed = new Set<string>();

    allNodes.forEach(node => {
      if (processed.has(node.id)) return;

      const group = [node];
      processed.add(node.id);

      // Encontrar nós próximos
      allNodes.forEach(otherNode => {
        if (processed.has(otherNode.id)) return;

        const distance = Math.sqrt(
          Math.pow(node.position.x - otherNode.position.x, 2) +
          Math.pow(node.position.y - otherNode.position.y, 2)
        );

        if (distance <= finalConfig.autoGroupDistance) {
          group.push(otherNode);
          processed.add(otherNode.id);
        }
      });

      if (group.length > 1) {
        groups.push(group);
      }
    });

    return groups;
  }, [allNodes, finalConfig.autoGroupDistance]);

  // Paginação
  const totalPages = Math.ceil(allNodes.length / finalConfig.nodesPerPage);
  
  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  // Atualizar nós visíveis quando necessário
  useEffect(() => {
    updateVisibleNodes();
  }, [updateVisibleNodes]);

  return {
    visibleNodes,
    visibleEdges,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    updateVisibleNodes,
    debouncedDragHandler,
    cacheNodePosition,
    getCachedPosition,
    autoGroupNodes,
  };
};