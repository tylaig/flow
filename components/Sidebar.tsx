import React from 'react';
import { BlockType } from '../types';
import { TextIcon, ImageIcon, OptionsIcon, ListIcon, AIIcon, ConditionIcon, AudioIcon, VideoIcon, DocumentIcon, LocationIcon, TemplateIcon, SaveResponseIcon, DelayIcon, IntegrationIcon, GroupIcon, CloseIcon } from './icons';

interface SidebarProps {
  addNode: (type: BlockType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full p-3 space-x-3 text-sm text-dark-text-secondary hover:bg-brand-primary hover:text-white rounded-md transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ addNode, isOpen, onClose }) => {
  const messageBlocks = [
      { type: BlockType.Text, icon: <TextIcon />, label: "Texto" },
      { type: BlockType.Image, icon: <ImageIcon />, label: "Imagem" },
      { type: BlockType.Audio, icon: <AudioIcon />, label: "Áudio" },
      { type: BlockType.Video, icon: <VideoIcon />, label: "Vídeo" },
      { type: BlockType.Document, icon: <DocumentIcon />, label: "Documento" },
      { type: BlockType.Location, icon: <LocationIcon />, label: "Localização" },
      { type: BlockType.Template, icon: <TemplateIcon />, label: "Template" },
  ];

  const logicBlocks = [
      { type: BlockType.Options, icon: <OptionsIcon />, label: "Botões de Opção" },
      { type: BlockType.List, icon: <ListIcon />, label: "Botão de Lista" },
      { type: BlockType.SaveResponse, icon: <SaveResponseIcon />, label: "Salvar Resposta" },
      { type: BlockType.Condition, icon: <ConditionIcon />, label: "Condição" },
      { type: BlockType.Delay, icon: <DelayIcon />, label: "Atraso (Delay)" },
      { type: BlockType.Integration, icon: <IntegrationIcon />, label: "Integração HTTP" },
      { type: BlockType.AICall, icon: <AIIcon />, label: "Chamada de IA" },
      { type: BlockType.Group, icon: <GroupIcon />, label: "Grupo de Blocos" },
  ];
  
  return (
    <aside className={`fixed left-0 top-0 h-full w-80 bg-dark-surface border-r border-dark-border z-30 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } overflow-y-auto`}>
      {/* Header do sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-dark-border bg-dark-bg">
        <h2 className="text-lg font-bold text-dark-text-primary">Adicionar Blocos</h2>
        <button
          onClick={onClose}
          className="text-dark-text-tertiary hover:text-white transition-colors p-1"
          title="Fechar menu"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-md font-bold text-dark-text-primary mb-4">Blocos de Mensagem</h3>
        <div className="space-y-2 mb-6">
          {messageBlocks.map(({type, icon, label}) => (
            <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
          ))}
        </div>
        
        <h3 className="text-md font-bold text-dark-text-primary mb-4">Blocos de Lógica</h3>
        <div className="space-y-2 mb-6">
          {logicBlocks.map(({type, icon, label}) => (
            <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
          ))}
        </div>
        
        <div className="p-3 bg-gray-900/50 rounded-md">
          <p className="text-xs text-dark-text-tertiary">
            💡 <strong>Dica:</strong> Clique em um bloco para adicioná-lo ao canvas. Depois, arraste as alças para conectar os blocos e criar seu fluxo.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;