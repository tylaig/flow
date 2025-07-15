import { useState, useEffect, useCallback, useRef } from 'react';
import { FlowService } from '../services/flowService';

interface EditHistory {
  id: string;
  content: string;
  timestamp: number;
}

interface UseInlineEditorProps {
  blockId: string;
  initialContent: string;
  flowId: string | null;
  onUpdate: (content: string) => void;
}

export const useInlineEditor = ({ blockId, initialContent, flowId, onUpdate }: UseInlineEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [history, setHistory] = useState<EditHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Atualizar conteúdo quando o prop inicial mudar
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Função para salvar no banco de dados
  const saveToDatabase = useCallback(async (newContent: string) => {
    if (!flowId || !newContent.trim()) return;

    setIsSaving(true);
    setSaveStatus('saving');
    setError(null);

    try {
      // Aqui você implementaria a chamada para salvar no Supabase
      // Por enquanto, vamos simular com um delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Em uma implementação real, você faria algo como:
      // await FlowService.updateBlockContent(flowId, blockId, newContent);
      
      setSaveStatus('saved');
      
      // Limpar status após 2 segundos
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
      setSaveStatus('error');
      
      // Limpar erro após 3 segundos
      setTimeout(() => {
        setError(null);
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  }, [flowId, blockId]);

  // Função para adicionar ao histórico
  const addToHistory = useCallback((newContent: string) => {
    setHistory(prev => {
      const newEntry: EditHistory = {
        id: `${blockId}-${Date.now()}`,
        content: newContent,
        timestamp: Date.now()
      };
      
      // Manter apenas os últimos 5 itens
      const updatedHistory = [newEntry, ...prev].slice(0, 5);
      return updatedHistory;
    });
  }, [blockId]);

  // Auto-save após 0.5s sem digitação
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);

    // Limpar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Configurar novo timeout para auto-save
    saveTimeoutRef.current = setTimeout(() => {
      if (newContent.trim() && newContent !== initialContent) {
        addToHistory(newContent);
        saveToDatabase(newContent);
      }
    }, 500);
  }, [onUpdate, initialContent, addToHistory, saveToDatabase]);

  // Iniciar edição
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setError(null);
    
    // Focar no textarea após um pequeno delay
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    }, 50);
  }, []);

  // Finalizar edição
  const finishEditing = useCallback(() => {
    // Validação: não permitir texto vazio
    if (!content.trim()) {
      setContent(initialContent);
      setError('O texto não pode ficar vazio');
      return;
    }

    setIsEditing(false);
    
    // Salvar imediatamente ao finalizar edição
    if (content !== initialContent) {
      addToHistory(content);
      saveToDatabase(content);
    }
  }, [content, initialContent, addToHistory, saveToDatabase]);

  // Cancelar edição
  const cancelEditing = useCallback(() => {
    setContent(initialContent);
    setIsEditing(false);
    setError(null);
    
    // Limpar timeout pendente
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, [initialContent]);

  // Handlers de teclado
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  }, [finishEditing, cancelEditing]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isEditing,
    content,
    isSaving,
    saveStatus,
    error,
    history,
    textareaRef,
    startEditing,
    finishEditing,
    cancelEditing,
    handleContentChange,
    handleKeyDown,
  };
};