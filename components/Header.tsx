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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-white hover:text-orange-500 hover:shadow-md'
                }`}
            >
                {icon}
                <span>{label}</span>
            </button>
        );
    };

    return (
        <header className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shadow-lg flex-shrink-0 z-20">
            <div className="flex items-center space-x-4">
                {onBackToFlows && (
                    <button
                        onClick={onBackToFlows}
                        className="text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
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
                <nav className="flex items-center space-x-2 p-1 bg-gray-100 rounded-xl">
                    <NavButton view="builder" label="Fluxo" icon={<FlowIcon />} />
                    <NavButton view="analytics" label="Análises" icon={<ChartBarIcon />} />
                </nav>
            </div>

            <div className="flex items-center space-x-3">
                <button onClick={onDownload} title="Baixar fluxo como JSON" className="btn-secondary">
                    <DownloadIcon />
                    <span>Download</span>
                </button>
                <button onClick={onGeneratePreview} title="Gerar link de preview do widget" className="btn-primary">
                    <ShareIcon />
                    <span>Gerar Preview</span>
                </button>
                <button onClick={onTestEndpoint} title="Simular execução do fluxo via endpoint" className="btn-primary">
                    <PlayIcon />
                    <span>Testar</span>
                </button>
                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                    Publicar
                </button>
                
                {onSignOut && (
                    <button
                        onClick={onSignOut}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors ml-4 p-2 hover:bg-red-50 rounded-lg"
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