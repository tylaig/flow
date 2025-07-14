import React, { useState } from 'react';
import { 
    TextBlock, ImageBlock, OptionsButtonBlock, ListButtonBlock, AICallBlock, ConditionBlock, 
    ChatBlock, BlockOption, AudioBlock, VideoBlock, DocumentBlock, LocationBlock, TemplateBlock,
    SaveResponseBlock, DelayBlock, IntegrationBlock, GroupBlock
} from '../types';
import { DuplicateIcon, PlusIcon, TrashIcon } from './icons';

interface BlockEditorProps<T extends ChatBlock> {
  block: T;
  updateBlock: (block: T) => void;
  deleteBlock: () => void;
  duplicateBlock: () => void;
}

const BlockWrapper: React.FC<{ title: string; children: React.ReactNode; onDelete: () => void; onDuplicate: () => void; isStart?: boolean }> = ({ title, children, onDelete, onDuplicate, isStart }) => (
  <div className={`bg-white rounded-xl border-2 shadow-lg w-[380px] transition-all duration-300 hover:shadow-xl hover:scale-105 ${isStart ? 'border-green-400 shadow-green-100' : 'border-gray-200 hover:border-orange-300'}`}>
    <div className={`flex justify-between items-center p-4 border-b border-gray-200 rounded-t-xl ${isStart ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}>
      <h3 className="font-bold text-white text-sm">{title}</h3>
      {!isStart && (
        <div className="flex items-center space-x-2">
            <button onClick={onDuplicate} className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white hover:bg-opacity-20 rounded-lg" title="Duplicar Bloco">
                <DuplicateIcon />
            </button>
            <button onClick={onDelete} className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white hover:bg-opacity-20 rounded-lg" title="Excluir Bloco">
                <TrashIcon />
            </button>
        </div>
      )}
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
  </div>
);

const InputField: React.FC<{label: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string}> = ({label, value, onChange, placeholder, type = 'text'}) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-input"
        />
    </div>
);

const TextareaField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, rows?: number}> = ({label, value, onChange, placeholder, rows = 3}) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-textarea"
            rows={rows}
        />
    </div>
);


export const TextBlockEditor: React.FC<BlockEditorProps<TextBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Mensagem de Texto" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
    <TextareaField 
        label=""
        value={block.content}
        onChange={(e) => updateBlock({ ...block, content: e.target.value })}
        placeholder="Digite sua mensagem aqui... Use {{variavel}} para inserir valores salvos."
        rows={4}
    />
  </BlockWrapper>
);

export const ImageBlockEditor: React.FC<BlockEditorProps<ImageBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Mensagem de Imagem" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
    <InputField label="URL da Imagem" value={block.url} onChange={e => updateBlock({...block, url: e.target.value})} placeholder="https://exemplo.com/imagem.png" />
  </BlockWrapper>
);

export const AudioBlockEditor: React.FC<BlockEditorProps<AudioBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Mensagem de Áudio" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
    <InputField label="URL do Áudio" value={block.url} onChange={e => updateBlock({...block, url: e.target.value})} placeholder="https://exemplo.com/audio.mp3" />
  </BlockWrapper>
);

export const VideoBlockEditor: React.FC<BlockEditorProps<VideoBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Mensagem de Vídeo" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
    <InputField label="URL do Vídeo" value={block.url} onChange={e => updateBlock({...block, url: e.target.value})} placeholder="https://exemplo.com/video.mp4" />
  </BlockWrapper>
);

export const DocumentBlockEditor: React.FC<BlockEditorProps<DocumentBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Mensagem de Documento" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
    <InputField label="URL do Documento" value={block.url} onChange={e => updateBlock({...block, url: e.target.value})} placeholder="https://exemplo.com/doc.pdf" />
    <InputField label="Nome do Arquivo" value={block.filename} onChange={e => updateBlock({...block, filename: e.target.value})} placeholder="ex: relatorio.pdf" />
  </BlockWrapper>
);

export const LocationBlockEditor: React.FC<BlockEditorProps<LocationBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Mensagem de Localização" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
     <InputField label="Latitude" value={block.latitude} onChange={e => updateBlock({...block, latitude: e.target.value})} placeholder="-23.550520" />
     <InputField label="Longitude" value={block.longitude} onChange={e => updateBlock({...block, longitude: e.target.value})} placeholder="-46.633308" />
     <InputField label="Nome do Local" value={block.name} onChange={e => updateBlock({...block, name: e.target.value})} placeholder="São Paulo" />
     <InputField label="Endereço" value={block.address} onChange={e => updateBlock({...block, address: e.target.value})} placeholder="Avenida Paulista, 1578" />
  </BlockWrapper>
);

export const TemplateBlockEditor: React.FC<BlockEditorProps<TemplateBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
    <BlockWrapper title="Mensagem de Template" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
        <InputField label="Nome do Template" value={block.templateName} onChange={e => updateBlock({...block, templateName: e.target.value})} placeholder="ex: `pedido_confirmado`" />
        <InputField label="Variáveis (separadas por vírgula)" value={block.variables} onChange={e => updateBlock({...block, variables: e.target.value})} placeholder="ex: João,12345" />
        <p className="text-xs text-dark-text-tertiary mt-2">Nota: O template deve ser pré-aprovado na sua conta Meta Business.</p>
    </BlockWrapper>
);

const OptionEditor: React.FC<{ option: BlockOption; onUpdate: (option: BlockOption) => void; onDelete: () => void; }> = ({ option, onUpdate, onDelete }) => (
    <div className="flex items-center space-x-2">
        <input
            type="text"
            value={option.label}
            onChange={(e) => onUpdate({ ...option, label: e.target.value })}
            placeholder="Texto do botão"
            maxLength={20}
            className="flex-grow p-2 bg-gray-900 border border-dark-border rounded-md text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
        <button onClick={onDelete} className="text-dark-text-tertiary hover:text-red-500 p-1 rounded-full bg-gray-700 hover:bg-gray-600">
            <TrashIcon />
        </button>
    </div>
);


export const OptionsButtonBlockEditor: React.FC<BlockEditorProps<OptionsButtonBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => {
    const handleAddOption = () => {
        if (block.options.length < 3) {
            const newOption: BlockOption = { id: `opt-${Date.now()}`, label: 'Nova Opção' };
            updateBlock({ ...block, options: [...block.options, newOption] });
        }
    };

    const handleUpdateOption = (updatedOption: BlockOption) => {
        const newOptions = block.options.map(opt => opt.id === updatedOption.id ? updatedOption : opt);
        updateBlock({ ...block, options: newOptions });
    };

    const handleDeleteOption = (id: string) => {
        const newOptions = block.options.filter(opt => opt.id !== id);
        updateBlock({ ...block, options: newOptions });
    };
    
    return (
        <BlockWrapper title="Botões de Opção (Máx. 3)" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
            <TextareaField
                label=""
                value={block.message}
                onChange={(e) => updateBlock({ ...block, message: e.target.value })}
                placeholder="Qual é a sua pergunta?"
                rows={3}
            />
            <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-text-tertiary">Botões (cada um é uma saída)</label>
                {block.options.map(option => (
                    <OptionEditor key={option.id} option={option} onUpdate={handleUpdateOption} onDelete={() => handleDeleteOption(option.id)} />
                ))}
            </div>
            {block.options.length < 3 && (
                <button onClick={handleAddOption} className="w-full flex items-center justify-center space-x-2 p-2 mt-2 text-sm bg-brand-primary hover:bg-brand-secondary text-white rounded-md transition-colors">
                    <PlusIcon />
                    <span>Adicionar Opção</span>
                </button>
            )}
        </BlockWrapper>
    );
};

export const ListButtonBlockEditor: React.FC<BlockEditorProps<ListButtonBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => {
    const handleAddOption = () => {
        const newOption: BlockOption = { id: `opt-${Date.now()}`, label: `Item ${block.options.length + 1}` };
        updateBlock({ ...block, options: [...block.options, newOption] });
    };

    const handleUpdateOption = (updatedOption: BlockOption) => {
        const newOptions = block.options.map(opt => opt.id === updatedOption.id ? updatedOption : opt);
        updateBlock({ ...block, options: newOptions });
    };

    const handleDeleteOption = (id: string) => {
        const newOptions = block.options.filter(opt => opt.id !== id);
        updateBlock({ ...block, options: newOptions });
    };

    return (
        <BlockWrapper title="Botão de Lista" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
            <TextareaField
                label=""
                value={block.message}
                onChange={(e) => updateBlock({ ...block, message: e.target.value })}
                placeholder="Escolha uma das opções abaixo."
                rows={2}
            />
            <InputField label="Texto do Botão de Menu" value={block.buttonText} onChange={(e) => updateBlock({ ...block, buttonText: e.target.value })} placeholder="Ver Opções" />
            <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-text-tertiary">Itens da Lista (cada um é uma saída)</label>
                 {block.options.map(option => (
                    <OptionEditor key={option.id} option={option} onUpdate={handleUpdateOption} onDelete={() => handleDeleteOption(option.id)} />
                ))}
            </div>
            <button onClick={handleAddOption} className="w-full flex items-center justify-center space-x-2 p-2 mt-2 text-sm bg-brand-primary hover:bg-brand-secondary text-white rounded-md transition-colors">
                 <PlusIcon />
                 <span>Adicionar Item</span>
            </button>
        </BlockWrapper>
    );
};

export const SaveResponseBlockEditor: React.FC<BlockEditorProps<SaveResponseBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
    <BlockWrapper title="Salvar Resposta do Usuário" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
        <TextareaField
            label="Mensagem de Solicitação"
            value={block.message}
            onChange={(e) => updateBlock({ ...block, message: e.target.value })}
            placeholder="Ex: Por favor, digite seu nome completo."
        />
        <InputField label="Salvar resposta na variável" value={block.variableToSave} onChange={e => updateBlock({ ...block, variableToSave: e.target.value })} placeholder="Ex: nome_completo" />
        <p className="text-xs text-dark-text-tertiary mt-2">O bot aguardará a próxima mensagem do usuário e a salvará na variável especificada.</p>
    </BlockWrapper>
);

export const ConditionBlockEditor: React.FC<BlockEditorProps<ConditionBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => {
    const { clause } = block;

    const handleClauseChange = (field: keyof typeof clause, value: string) => {
        updateBlock({ ...block, clause: { ...clause, [field]: value } });
    };

    return (
        <BlockWrapper title="Condição (Se/Então)" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
            <div className="space-y-2 bg-gray-900 p-3 rounded-md border border-dark-border">
                 <p className="text-sm font-semibold text-dark-text-secondary">Se a variável</p>
                <InputField label="" value={clause.variable} onChange={(e) => handleClauseChange('variable', e.target.value)} placeholder="ex: resposta_usuario" />
                <select
                    value={clause.operator}
                    onChange={(e) => handleClauseChange('operator', e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-dark-border rounded-md text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                >
                    <option value="equals">for igual a</option>
                    <option value="not_equals">for diferente de</option>
                    <option value="contains">contiver</option>
                </select>
                <InputField label="" value={clause.value} onChange={(e) => handleClauseChange('value', e.target.value)} placeholder="ex: 'Sim'" />
            </div>
             <div className="text-center text-dark-text-tertiary">
                <p className="text-xs">Conecte as saídas "Então" e "Senão" aos próximos blocos.</p>
            </div>
        </BlockWrapper>
    );
};


export const AICallBlockEditor: React.FC<BlockEditorProps<AICallBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [testResponse, setTestResponse] = useState('');

    const handleTest = async () => {
        setIsLoading(true);
        setTestResponse('');
        const { generateAiResponse } = await import('../services/geminiService');
        const response = await generateAiResponse(block.prompt);
        setTestResponse(response);
        setIsLoading(false);
    };

    return (
        <BlockWrapper title="Chamada de IA (Gemini)" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
            <TextareaField
                label="Prompt para a IA"
                value={block.prompt}
                onChange={(e) => updateBlock({ ...block, prompt: e.target.value })}
                placeholder="Ex: Resuma o seguinte texto para uma criança de 5 anos: {{variavel_anterior}}"
                rows={4}
            />
            <InputField label="Salvar resposta na variável" value={block.variableToSave} onChange={e => updateBlock({...block, variableToSave: e.target.value})} placeholder="Ex: resumo_ia" />
            <button
                onClick={handleTest}
                disabled={isLoading}
                className="w-full p-2 mt-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:bg-gray-500"
            >
                {isLoading ? 'Testando...' : 'Testar Chamada de IA'}
            </button>
            {testResponse && (
                <div className="mt-4 p-3 bg-gray-900 rounded-md border border-dark-border">
                    <p className="text-sm font-bold text-dark-text-secondary">Resposta do Teste:</p>
                    <p className="text-xs text-dark-text-tertiary mt-1">{testResponse}</p>
                </div>
            )}
        </BlockWrapper>
    );
};

export const DelayBlockEditor: React.FC<BlockEditorProps<DelayBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
    <BlockWrapper title="Atraso (Delay)" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
        <InputField 
            label="Tempo de espera (em segundos)" 
            value={block.seconds}
            onChange={e => updateBlock({ ...block, seconds: Number(e.target.value) })} 
            type="number"
            placeholder="Ex: 3"
        />
         <p className="text-xs text-dark-text-tertiary mt-2">Pausa o fluxo pelo tempo especificado para tornar a conversa mais natural.</p>
    </BlockWrapper>
);

export const IntegrationBlockEditor: React.FC<BlockEditorProps<IntegrationBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
    <BlockWrapper title="Integração (Requisição HTTP)" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
        <InputField label="URL" value={block.url} onChange={e => updateBlock({ ...block, url: e.target.value })} placeholder="https://api.exemplo.com/dados" />
        <div>
            <label className="block text-sm font-medium text-dark-text-tertiary mb-1">Método</label>
            <select
                value={block.method}
                onChange={(e) => updateBlock({ ...block, method: e.target.value as IntegrationBlock['method'] })}
                className="w-full p-2 bg-gray-900 border border-dark-border rounded-md text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
            </select>
        </div>
        <TextareaField
            label="Cabeçalhos (JSON)"
            value={block.headers}
            onChange={e => updateBlock({ ...block, headers: e.target.value })}
            placeholder={`{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer {{token}}"\n}`}
            rows={4}
        />
        <TextareaField
            label="Corpo da Requisição (JSON)"
            value={block.body}
            onChange={e => updateBlock({ ...block, body: e.target.value })}
            placeholder={`{\n  "user_id": "{{id_usuario}}",\n  "query": "valor"\n}`}
            rows={4}
        />
        <InputField label="Salvar resposta na variável" value={block.variableToSave} onChange={e => updateBlock({ ...block, variableToSave: e.target.value })} placeholder="Ex: dados_api" />
    </BlockWrapper>
);

export const GroupBlockEditor: React.FC<BlockEditorProps<GroupBlock>> = ({ block, updateBlock, deleteBlock, duplicateBlock }) => (
  <BlockWrapper title="Grupo" onDelete={deleteBlock} onDuplicate={duplicateBlock}>
    <InputField 
        label="Nome do Grupo" 
        value={block.label}
        onChange={e => updateBlock({ ...block, label: e.target.value })}
        placeholder="Ex: Fluxo de Vendas"
    />
  </BlockWrapper>
);

export const StartBlockEditor: React.FC<{}> = () => (
     <BlockWrapper title="Início do Fluxo" onDelete={()=>{}} onDuplicate={()=>{}} isStart={true}>
        <div className="text-center">
            <p className="text-sm text-dark-text-tertiary mt-1">Este é o ponto de partida da sua conversa. Arraste uma conexão a partir daqui.</p>
        </div>
    </BlockWrapper>
);