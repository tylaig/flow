import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget';
import { CustomNode, WidgetConfig } from './types';
import { Edge } from 'reactflow';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-800">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erro no Preview</h1>
            <p>{message}</p>
            <p className="mt-4 text-sm text-gray-500">
                Por favor, volte para a tela de edição e tente gerar o preview novamente.
            </p>
        </div>
    </div>
);


const PreviewPage = () => {
    try {
        const storedData = localStorage.getItem('previewFlowData');
        if (!storedData) {
            return <ErrorDisplay message="Nenhum dado de fluxo encontrado para o preview." />;
        }

        const { nodes, edges, config } = JSON.parse(storedData) as {
            nodes: CustomNode[];
            edges: Edge[];
            config: WidgetConfig;
        };

        if (!nodes || !edges || !config) {
            return <ErrorDisplay message="Os dados do fluxo estão incompletos ou corrompidos." />;
        }

        return <ChatWidget nodes={nodes} edges={edges} config={config} />;
    } catch (error) {
        console.error("Failed to load preview data:", error);
        return <ErrorDisplay message="Falha ao carregar os dados do preview. Verifique o console para mais detalhes." />;
    }
};

root.render(
  <React.StrictMode>
    <PreviewPage />
  </React.StrictMode>
);