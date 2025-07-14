import React from 'react';
import { FlowIcon, ChartBarIcon, DownloadIcon, PlayIcon, ShareIcon } from './icons';

type View = 'builder' | 'analytics';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    onDownload: () => void;
    onTestEndpoint: () => void;
    onGeneratePreview: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, onDownload, onTestEndpoint, onGeneratePreview }) => {
    const NavButton: React.FC<{ view: View, label: string, icon: React.ReactNode }> = ({ view, label, icon }) => {
        const isActive = currentView === view;
        return (
            <button 
                onClick={() => setView(view)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                        ? 'bg-brand-primary text-white' 
                        : 'text-dark-text-secondary hover:bg-dark-surface hover:text-dark-text-primary'
                }`}
            >
                {icon}
                <span>{label}</span>
            </button>
        );
    };

    return (
        <header className="bg-dark-surface border-b border-dark-border p-4 flex justify-between items-center shadow-md flex-shrink-0 z-20">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-dark-text-primary">Typebot WhatsApp Pro</h1>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2">
                <nav className="flex items-center space-x-2 p-1 bg-dark-bg rounded-lg">
                    <NavButton view="builder" label="Fluxo" icon={<FlowIcon />} />
                    <NavButton view="analytics" label="Análises" icon={<ChartBarIcon />} />
                </nav>
            </div>

            <div className="flex items-center space-x-3">
                 <button onClick={onDownload} title="Baixar fluxo como JSON" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex items-center space-x-2">
                    <DownloadIcon />
                    <span>Download</span>
                </button>
                 <button onClick={onGeneratePreview} title="Gerar link de preview do widget" className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex items-center space-x-2">
                    <ShareIcon />
                    <span>Gerar Preview</span>
                </button>
                <button onClick={onTestEndpoint} title="Simular execução do fluxo via endpoint" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex items-center space-x-2">
                    <PlayIcon />
                    <span>Testar</span>
                </button>
                <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
                    Publicar
                </button>
            </div>
        </header>
    );
};

export default Header;