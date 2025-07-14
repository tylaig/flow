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
    className="flex items-center w-full p-3 space-x-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-300 hover:shadow-md hover:transform hover:scale-105 group"
    style={{ margin: '8px 0' }}
  >
    <div className="group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
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
    <aside className={`fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-30 transform transition-all duration-500 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } overflow-y-auto shadow-2xl`}>
      {/* Header do sidebar */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500">
        <h2 className="text-lg font-bold text-white">Adicionar Blocos</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
          title="Fechar menu"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
          Blocos de Mensagem
        </h3>
        <div className="space-y-1 mb-8">
          {messageBlocks.map(({type, icon, label}) => (
            <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
          ))}
        </div>
        
        <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
          Blocos de Lógica
        </h3>
        <div className="space-y-1 mb-8">
          {logicBlocks.map(({type, icon, label}) => (
            <SidebarButton key={type} icon={icon} label={label} onClick={() => addNode(type)} />
          ))}
        </div>
        
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <p className="text-xs text-gray-600">
            💡 <strong>Dica:</strong> Clique em um bloco para adicioná-lo ao canvas. Depois, arraste as alças para conectar os blocos e criar seu fluxo.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;