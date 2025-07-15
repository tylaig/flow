import React, { createContext, useContext, useState, useCallback } from 'react';

interface EditingContextType {
  currentEditingBlock: string | null;
  setCurrentEditingBlock: (blockId: string | null) => void;
  isBlockEditing: (blockId: string) => boolean;
  startEditing: (blockId: string) => void;
  stopEditing: () => void;
}

const EditingContext = createContext<EditingContextType | null>(null);

export const useEditingContext = () => {
  const context = useContext(EditingContext);
  if (!context) {
    throw new Error('useEditingContext deve ser usado dentro de um EditingProvider');
  }
  return context;
};

interface EditingProviderProps {
  children: React.ReactNode;
}

export const EditingProvider: React.FC<EditingProviderProps> = ({ children }) => {
  const [currentEditingBlock, setCurrentEditingBlock] = useState<string | null>(null);

  const isBlockEditing = useCallback((blockId: string) => {
    return currentEditingBlock === blockId;
  }, [currentEditingBlock]);

  const startEditing = useCallback((blockId: string) => {
    // Garantir que apenas um bloco seja editado por vez
    setCurrentEditingBlock(blockId);
  }, []);

  const stopEditing = useCallback(() => {
    setCurrentEditingBlock(null);
  }, []);

  const value = {
    currentEditingBlock,
    setCurrentEditingBlock,
    isBlockEditing,
    startEditing,
    stopEditing,
  };

  return (
    <EditingContext.Provider value={value}>
      {children}
    </EditingContext.Provider>
  );
};