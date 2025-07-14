import React, { useState } from 'react';
import { WidgetConfig } from '../types';
import { CloseIcon, ShareIcon } from './icons';

interface WidgetCustomizationModalProps {
    onClose: () => void;
    onGenerate: (config: WidgetConfig) => void;
}

const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string}> = ({label, value, onChange, placeholder, type = 'text'}) => (
    <div>
        <label className="block text-sm font-medium text-dark-text-tertiary mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 bg-gray-900 border border-dark-border rounded-md text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
        />
    </div>
);

const WidgetCustomizationModal: React.FC<WidgetCustomizationModalProps> = ({ onClose, onGenerate }) => {
    const [config, setConfig] = useState<WidgetConfig>({
        title: 'Atendente Virtual',
        avatarUrl: 'https://i.pravatar.cc/80?u=bot',
        themeColor: '#075E54',
        welcomeMessage: 'Olá! Como posso te ajudar hoje?',
    });

    const handleChange = (field: keyof WidgetConfig, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(config);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-dark-border flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text-primary">Personalizar Widget de Preview</h2>
                    <button onClick={onClose} className="text-dark-text-tertiary hover:text-white">
                        <CloseIcon />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <InputField
                        label="Título do Chat"
                        value={config.title}
                        onChange={e => handleChange('title', e.target.value)}
                        placeholder="Ex: Suporte ao Cliente"
                    />
                    <InputField
                        label="URL do Avatar"
                        value={config.avatarUrl}
                        onChange={e => handleChange('avatarUrl', e.target.value)}
                        placeholder="https://exemplo.com/avatar.png"
                    />
                    <div>
                        <label className="block text-sm font-medium text-dark-text-tertiary mb-1">Cor do Tema</label>
                        <div className="flex items-center space-x-2">
                           <input
                                type="color"
                                value={config.themeColor}
                                onChange={e => handleChange('themeColor', e.target.value)}
                                className="p-1 h-10 w-10 block bg-gray-900 border border-dark-border cursor-pointer rounded-md"
                           />
                           <input
                                type="text"
                                value={config.themeColor}
                                onChange={e => handleChange('themeColor', e.target.value)}
                                className="w-full p-2 bg-gray-900 border border-dark-border rounded-md text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                           />
                        </div>
                    </div>
                     <InputField
                        label="Mensagem de Boas-Vindas (Opcional)"
                        value={config.welcomeMessage}
                        onChange={e => handleChange('welcomeMessage', e.target.value)}
                        placeholder="Deixe em branco para começar com o fluxo"
                    />
                </form>

                <div className="p-4 border-t border-dark-border flex-shrink-0 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors flex items-center space-x-2"
                    >
                        <ShareIcon />
                        <span>Gerar e Abrir Preview</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WidgetCustomizationModal;