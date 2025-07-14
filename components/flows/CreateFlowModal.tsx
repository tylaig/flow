import React, { useState } from 'react';
import { FlowService } from '../../services/flowService';
import { CloseIcon } from '../icons';
import { CustomNode, WidgetConfig, BlockType } from '../../types';
import { Edge } from 'reactflow';

interface CreateFlowModalProps {
  onClose: () => void;
  onSuccess: (flowId: string) => void;
}

const CreateFlowModal: React.FC<CreateFlowModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Dados iniciais do fluxo
    const initialNodes: CustomNode[] = [
      { 
        id: 'start-1', 
        type: BlockType.Start, 
        position: { x: 250, y: 50 }, 
        data: { id: 'start-1', type: BlockType.Start },
      },
      {
        id: 'text-1',
        type: BlockType.Text,
        position: { x: 150, y: 200 },
        data: {
          id: 'text-1',
          type: BlockType.Text,
          content: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudar?',
        },
      },
    ];

    const initialEdges: Edge[] = [
      { id: 'e-start1-text1', source: 'start-1', target: 'text-1', type: 'custom', animated: true }
    ];

    const initialConfig: WidgetConfig = {
      title: 'Atendente Virtual',
      avatarUrl: 'https://i.pravatar.cc/80?u=bot',
      themeColor: '#7B2CBF',
      welcomeMessage: 'Olá! Como posso te ajudar hoje?',
    };

    const { data, error } = await FlowService.createFlow(
      name,
      description,
      { nodes: initialNodes, edges: initialEdges },
      initialConfig
    );

    if (error) {
      setError(error.message);
    } else if (data) {
      onSuccess(data.id);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Criar Novo Fluxo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Fluxo *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Atendimento ao Cliente"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Descreva o propósito deste fluxo..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Criando...' : 'Criar Fluxo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFlowModal;