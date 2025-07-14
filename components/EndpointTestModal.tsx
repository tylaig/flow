import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Edge } from 'reactflow';
import { CustomNode, BlockType, ConditionBlock, SaveResponseBlock, DelayBlock, IntegrationBlock, AICallBlock, TextBlock, OptionsButtonBlock, ListButtonBlock } from '../types';
import { CloseIcon, PlayIcon, SendIcon } from './icons';
import { generateAiResponse } from '../services/geminiService';

interface EndpointTestModalProps {
    nodes: CustomNode[];
    edges: Edge[];
    onClose: () => void;
}

const EndpointTestModal: React.FC<EndpointTestModalProps> = ({ nodes, edges, onClose }) => {
    const [log, setLog] = useState<string[]>([]);
    const [variables, setVariables] = useState<Record<string, any>>({});
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [isWaitingForInput, setIsWaitingForInput] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const logEndRef = useRef<HTMLDivElement>(null);

    const addLog = (message: string, type: 'info' | 'bot' | 'user' | 'error' | 'variable' = 'info') => {
        let prefix = '[INFO]';
        if (type === 'bot') prefix = '[BOT]';
        if (type === 'user') prefix = '[USER]';
        if (type === 'error') prefix = '[ERROR]';
        if (type === 'variable') prefix = '[VAR]';
        setLog(prev => [...prev, `${prefix} ${message}`]);
    };

    const replaceVariables = (text: string) => {
        if(typeof text !== 'string') return text;
        return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
            const value = variables[varName.trim()];
            if (value === undefined || value === null) return match;
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
        });
    };

    const getNextNodeId = (sourceId: string, sourceHandle?: string) => {
        const edge = edges.find(e => e.source === sourceId && (!sourceHandle || e.sourceHandle === sourceHandle));
        return edge?.target || null;
    };

    const processNode = useCallback(async (nodeId: string | null) => {
        if (!nodeId) {
            addLog('Fim do fluxo alcançado.', 'info');
            setIsRunning(false);
            return;
        }

        const node = nodeMap.get(nodeId);
        if (!node) {
            addLog(`Nó com ID ${nodeId} não encontrado.`, 'error');
            setIsRunning(false);
            return;
        }
        
        setCurrentNodeId(nodeId);
        const block = node.data;
        addLog(`Executando Bloco: ${block.type} (ID: ${block.id})`, 'info');

        switch (block.type) {
            case BlockType.Text:
                addLog(replaceVariables(block.content), 'bot');
                setCurrentNodeId(getNextNodeId(node.id));
                break;
            case BlockType.Options:
            case BlockType.List:
                addLog(replaceVariables(block.message), 'bot');
                const options = (block as OptionsButtonBlock | ListButtonBlock).options.map(o => `'${o.label}'`).join(', ');
                addLog(`Aguardando escolha do usuário: [${options}]`, 'info');
                setIsWaitingForInput('option_choice'); // Special case
                break;
            case BlockType.SaveResponse:
                addLog(replaceVariables(block.message), 'bot');
                addLog(`Aguardando entrada do usuário para salvar em '{{${block.variableToSave}}}'`, 'info');
                setIsWaitingForInput(block.variableToSave);
                break;
            case BlockType.Condition:
                const { variable, operator, value } = (block as ConditionBlock).clause;
                const varValue = variables[variable] || '';
                let conditionMet = false;
                switch (operator) {
                    case 'equals': conditionMet = String(varValue) === value; break;
                    case 'not_equals': conditionMet = String(varValue) !== value; break;
                    case 'contains': conditionMet = String(varValue).includes(value); break;
                }
                addLog(`Condição: {{${variable}}} (${varValue}) ${operator} '${value}' -> ${conditionMet ? 'Verdadeiro (Então)' : 'Falso (Senão)'}`, 'info');
                setCurrentNodeId(getNextNodeId(node.id, conditionMet ? 'then' : 'else'));
                break;
            case BlockType.Delay:
                addLog(`Aguardando ${block.seconds} segundos...`, 'info');
                await new Promise(res => setTimeout(res, block.seconds * 1000));
                setCurrentNodeId(getNextNodeId(node.id));
                break;
            case BlockType.Integration:
                try {
                    addLog(`Fazendo chamada HTTP para ${block.url}`, 'info');
                    const replacedUrl = replaceVariables(block.url);
                    const replacedHeaders = JSON.parse(replaceVariables(block.headers || '{}'));
                    const replacedBody = block.body ? JSON.parse(replaceVariables(block.body)) : undefined;
                    
                    const response = await fetch(replacedUrl, { method: block.method, headers: replacedHeaders, body: block.body ? JSON.stringify(replacedBody) : undefined });
                    const data = await response.json().catch(() => response.text());
                    
                    if (block.variableToSave) {
                        setVariables(prev => ({ ...prev, [block.variableToSave]: data }));
                        addLog(`Variável '{{${block.variableToSave}}}' salva com a resposta da API.`, 'variable');
                    }
                } catch (e: any) {
                    addLog(`Erro na chamada HTTP: ${e.message}`, 'error');
                }
                setCurrentNodeId(getNextNodeId(node.id));
                break;
            case BlockType.AICall:
                 addLog(`Fazendo chamada de IA com prompt: "${block.prompt}"`, 'info');
                 const aiResponse = await generateAiResponse(replaceVariables(block.prompt));
                 if (block.variableToSave) {
                    setVariables(prev => ({ ...prev, [block.variableToSave]: aiResponse }));
                    addLog(`Variável '{{${block.variableToSave}}}' salva com a resposta da IA.`, 'variable');
                 }
                 addLog(aiResponse, 'bot');
                 setCurrentNodeId(getNextNodeId(node.id));
                 break;
            default:
                setCurrentNodeId(getNextNodeId(node.id));
                break;
        }

    }, [edges, nodes, variables]);

    useEffect(() => {
        if (isRunning && currentNodeId) {
            processNode(currentNodeId);
        }
    }, [isRunning, currentNodeId, processNode]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        setLog([]);
        setVariables({});
        setIsRunning(true);
        addLog(`Iniciando fluxo com a mensagem: "${userInput}"`, 'user');

        const startNode = nodes.find(n => n.data.type === BlockType.Start);
        if (startNode) {
            setUserInput('');
            setCurrentNodeId(getNextNodeId(startNode.id));
        } else {
            addLog('Nó de início não encontrado.', 'error');
            setIsRunning(false);
        }
    };
    
    const handleUserResponse = (e: React.FormEvent) => {
         e.preventDefault();
         if (!userInput.trim() || !isWaitingForInput) return;
         
         addLog(userInput, 'user');

         if (isWaitingForInput === 'option_choice') {
            const parentNode = nodeMap.get(currentNodeId!);
            const options = (parentNode?.data as OptionsButtonBlock | ListButtonBlock)?.options;
            const chosenOption = options?.find(o => o.label.toLowerCase() === userInput.trim().toLowerCase());
            if (chosenOption) {
                setCurrentNodeId(getNextNodeId(currentNodeId!, chosenOption.id));
            } else {
                addLog(`Opção inválida. Escolha entre: ${options.map(o => o.label).join(', ')}`, 'error');
            }
         } else {
            setVariables(prev => ({ ...prev, [isWaitingForInput]: userInput.trim() }));
            addLog(`Variável '{{${isWaitingForInput}}}' salva com o valor: "${userInput.trim()}"`, 'variable');
            setCurrentNodeId(getNextNodeId(currentNodeId!));
         }
         
         setUserInput('');
         setIsWaitingForInput(null);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-surface rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-dark-border flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text-primary">Simulador de Endpoint</h2>
                    <button onClick={onClose} className="text-dark-text-tertiary hover:text-white">
                        <CloseIcon />
                    </button>
                </div>

                <div className="p-4 flex-grow overflow-hidden flex flex-col md:flex-row space-x-4">
                    <div className="flex-grow flex flex-col bg-dark-bg p-3 rounded-md border border-dark-border h-full">
                        <h3 className="text-lg font-semibold mb-2 text-dark-text-secondary">Log de Execução</h3>
                        <div className="flex-grow overflow-y-auto pr-2 font-mono text-sm">
                            {log.map((line, index) => (
                                <p key={index} className={`whitespace-pre-wrap ${line.startsWith('[BOT]') ? 'text-cyan-400' : line.startsWith('[USER]') ? 'text-green-400' : line.startsWith('[ERROR]') ? 'text-red-500' : line.startsWith('[VAR]') ? 'text-yellow-400' : 'text-dark-text-tertiary'}`}>{line}</p>
                            ))}
                            <div ref={logEndRef} />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col bg-dark-bg p-3 rounded-md border border-dark-border">
                         <h3 className="text-lg font-semibold mb-2 text-dark-text-secondary">Variáveis</h3>
                         <div className="flex-grow overflow-y-auto pr-2 font-mono text-xs text-yellow-300">
                             <pre>{JSON.stringify(variables, null, 2)}</pre>
                         </div>
                    </div>
                </div>

                <div className="p-4 border-t border-dark-border flex-shrink-0">
                    <form onSubmit={isWaitingForInput ? handleUserResponse : handleStart} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            placeholder={isWaitingForInput ? `Digite a resposta para '${isWaitingForInput}'...` : "Digite a mensagem inicial do usuário..."}
                            disabled={!isRunning && log.length > 0}
                            className="w-full p-2 bg-gray-900 border border-dark-border rounded-md text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                        />
                        <button type="submit" className="bg-brand-primary text-white rounded-md p-2 hover:bg-brand-secondary transition-colors flex items-center space-x-2" disabled={!isRunning && log.length > 0}>
                           {isWaitingForInput ? <SendIcon /> : <PlayIcon/>}
                           <span>{isWaitingForInput ? 'Enviar' : 'Iniciar'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EndpointTestModal;
