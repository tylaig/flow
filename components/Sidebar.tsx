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
    className="flex items-center w-full p-4 space-x-3 text-sm text-gray-700 hover:bg-purple-600 hover:text-white rounded-lg transition-all duration-200 border border-transparent hover:border-purple-500 hover:shadow-md"
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
    <aside className={`fixed left-0 top-0 h-full w-80 bg-white border-r-2 border-gray-200 z-30 transform transition-transform duration-300 ease-in-out shadow-xl ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } overflow-y-auto`}>
      {/* Header do sidebar */}
      <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-purple-600">
        <h2 className="text-lg font-bold text-white">Adicionar Blocos</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/20 rounded"
          title="Fechar menu"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💬</span>
          Blocos de Mensagem
        </h3>
        <div className="space-y-2 mb-6">
          {messageBlocks.map(({type, icon, label}) => (
            <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
          ))}
        </div>
        
        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          Blocos de Lógica
        </h3>
        <div className="space-y-2 mb-6">
          {logicBlocks.map(({type, icon, label}) => (
            <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
          ))}
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-xs text-blue-800">
            <span className="text-lg mr-1">💡</span>
            <strong>Dica:</strong> Clique em um bloco para adicioná-lo ao canvas. Depois, arraste as bolinhas coloridas para conectar os blocos e criar seu fluxo.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;