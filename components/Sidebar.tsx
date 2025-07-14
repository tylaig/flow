import React from 'react';
import { BlockType } from '../types';
import { TextIcon, ImageIcon, OptionsIcon, ListIcon, AIIcon, ConditionIcon, AudioIcon, VideoIcon, DocumentIcon, LocationIcon, TemplateIcon, SaveResponseIcon, DelayIcon, IntegrationIcon, GroupIcon } from './icons';

interface SidebarProps {
  addNode: (type: BlockType) => void;
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

const Sidebar: React.FC<SidebarProps> = ({ addNode }) => {
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
    <aside className="w-64 bg-dark-surface p-4 flex-shrink-0 border-r border-dark-border overflow-y-auto">
      <h2 className="text-lg font-bold text-dark-text-primary mb-4">Blocos de Mensagem</h2>
      <div className="space-y-2">
        {messageBlocks.map(({type, icon, label}) => (
          <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
        ))}
      </div>
      <h2 className="text-lg font-bold text-dark-text-primary mt-8 mb-4">Blocos de Lógica</h2>
      <div className="space-y-2">
        {logicBlocks.map(({type, icon, label}) => (
          <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
        ))}
      </div>
       <p className="text-xs text-dark-text-tertiary mt-8 p-2 bg-gray-900/50 rounded">
            Clique em um bloco para adicioná-lo ao canvas. Depois, arraste as alças para conectar os blocos e criar seu fluxo.
        </p>
    </aside>
  );
};

export default Sidebar;