import { createContext, useContext } from 'react';
import { ChatBlock } from './types';

interface FlowContextType {
  deleteNode: (id: string) => void;
  updateNode: (id: string, data: ChatBlock) => void;
  deleteEdge: (id: string) => void;
  duplicateNode: (id: string) => void;
}

export const FlowContext = createContext<FlowContextType | null>(null);

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowContext deve ser usado dentro de um FlowProvider');
  }
  return context;
};