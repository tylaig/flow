import React from 'react';
import { FlowIcon, ChartBarIcon, DownloadIcon, PlayIcon, ShareIcon, UserIcon, LogoutIcon } from './icons';
import { FlowWithPermissions } from '../services/flowService';

type View = 'builder' | 'analytics';

interface HeaderProps {
    currentFlow?: FlowWithPermissions | null;
    onBackToFlows?: () => void;
    onSignOut?: () => void;
    currentView: View;
    setView: (view: View) => void;
    onDownload: () => void;
    onTestEndpoint: () => void;
    onGeneratePreview: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentFlow, onBackToFlows, onSignOut, currentView, setView, onDownload, onTestEndpoint, onGeneratePreview }) => {
    const NavButton: React.FC<{ view: View, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => {
        const isActive = currentView === view;
        return (
            <button 
                onClick={() => setView(view)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
                {icon}
                <span>{label}</span>
            </button>
        );
    };

    return (
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm flex-shrink-0 z-20">
            <div className="flex items-center space-x-4">
                {onBackToFlows && (
                    <button
                        onClick={onBackToFlows}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Voltar aos fluxos"
                    >
                        ←
                    </button>
                )}
                
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        {currentFlow ? currentFlow.name : 'Typebot WhatsApp Pro'}
                    </h1>
                    {currentFlow?.description && (
                        <p className="text-sm text-gray-600">{currentFlow.description}</p>
                    )}
                </div>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2">
                <nav className="flex items-center space-x-2 p-1 bg-dark-bg rounded-lg">
                    <NavButton view="builder" label="Fluxo" icon={<FlowIcon />} />
                    <NavButton view="analytics" label="Análises" icon={<ChartBarIcon />} />
                </nav>
            </div>

            <div className="flex items-center space-x-3">
                <button onClick={onDownload} title="Baixar fluxo como JSON" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex items-center space-x-2">
                    <DownloadIcon />
                    <span>Download</span>
                </button>
                <button onClick={onGeneratePreview} title="Gerar link de preview do widget" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex items-center space-x-2">
                    <ShareIcon />
                    <span>Gerar Preview</span>
                </button>
                <button onClick={onTestEndpoint} title="Simular execução do fluxo via endpoint" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex items-center space-x-2">
                    <PlayIcon />
                    <span>Testar</span>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
                    Publicar
                </button>
                
                {onSignOut && (
                    <button
                        onClick={onSignOut}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors ml-4"
                        title="Sair"
                    >
                        <LogoutIcon />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;