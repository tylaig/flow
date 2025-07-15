import React from 'react';
import { useInlineEditor } from '../hooks/useInlineEditor';

interface InlineTextEditorProps {
  blockId: string;
  content: string;
  flowId: string | null;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  blockId,
  content,
  flowId,
  onUpdate,
  placeholder = "Digite seu texto aqui...",
  className = "",
  multiline = true
}) => {
  const {
    isEditing,
    content: editorContent,
    isSaving,
    saveStatus,
    error,
    textareaRef,
    startEditing,
    finishEditing,
    handleContentChange,
    handleKeyDown,
  } = useInlineEditor({
    blockId,
    initialContent: content,
    flowId,
    onUpdate
  });

  // Indicador de status de salvamento
  const SaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="absolute top-2 right-2 flex items-center space-x-1 text-xs text-blue-600">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Salvando...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="absolute top-2 right-2 flex items-center space-x-1 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Salvo</span>
          </div>
        );
      case 'error':
        return (
          <div className="absolute top-2 right-2 flex items-center space-x-1 text-xs text-red-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Erro</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-3 bg-white border-2 border-purple-500 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none shadow-lg ${className}`}
            rows={4}
            style={{
              minHeight: '100px',
              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
            }}
          />
        ) : (
          <input
            ref={textareaRef as any}
            type="text"
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-3 bg-white border-2 border-purple-500 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 shadow-lg ${className}`}
            style={{
              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
            }}
          />
        )}
        
        <SaveStatusIndicator />
        
        {/* Indicador de modo de edição */}
        <div className="absolute -top-2 -left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
          Editando
        </div>
        
        {/* Dicas de teclado */}
        <div className="absolute -bottom-8 left-0 text-xs text-gray-500">
          Enter para salvar • Esc para cancelar
        </div>
        
        {error && (
          <div className="absolute -bottom-12 left-0 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        onClick={startEditing}
        className={`w-full p-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 cursor-text hover:border-purple-400 transition-all duration-200 min-h-[100px] ${className} ${
          !editorContent.trim() ? 'text-gray-400 italic' : ''
        }`}
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {editorContent.trim() || placeholder}
        
        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-30 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
        
        {/* Ícone de edição no hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
      </div>
      
      <SaveStatusIndicator />
    </div>
  );
};

export default InlineTextEditor;