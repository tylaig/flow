import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CustomNode } from '../types';
import { SendIcon, RefreshIcon } from './icons';
import { Edge } from 'reactflow';
import { FlowRunner, DisplayMessage, DisplayState } from '../services/FlowRunner';

interface PhonePreviewProps {
  nodes: CustomNode[];
  edges: Edge[];
}

const TypingIndicator = () => (
    <div className="flex justify-start">
        <div className="bg-white rounded-lg p-3 max-w-[85%] shadow-md rounded-tl-none">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    </div>
);

const PhonePreview: React.FC<PhonePreviewProps> = ({ nodes, edges }) => {
    const [displayState, setDisplayState] = useState<DisplayState>({
        conversation: [],
        isTyping: false,
        isWaitingForInput: false,
    });
    const [userInput, setUserInput] = useState('');
    const runnerRef = useRef<FlowRunner | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleRefresh = useCallback(() => {
        // Create a deep copy to snapshot the state
        const nodesSnapshot = JSON.parse(JSON.stringify(nodes));
        const edgesSnapshot = JSON.parse(JSON.stringify(edges));

        const updateCallback = (newState: DisplayState) => {
            setDisplayState(newState);
        };
        
        runnerRef.current = new FlowRunner(nodesSnapshot, edgesSnapshot, updateCallback);
        runnerRef.current.start();
    }, [nodes, edges]);

    useEffect(() => {
        handleRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on initial mount

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayState.conversation, displayState.isTyping]);

    const handleOptionClick = (option: { id: string, label: string }) => {
        if (!runnerRef.current) return;
        runnerRef.current.provideInput('', { handleId: option.id, label: option.label });
    };

    const handleUserInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !displayState.isWaitingForInput || !runnerRef.current) return;
        runnerRef.current.provideInput(userInput.trim());
        setUserInput('');
    };
    
  const renderMessageContent = (message: DisplayMessage) => {
      if (message.options) {
        return (
            <div className="w-full">
                 <div className="self-start bg-white text-gray-800 rounded-lg rounded-tl-none p-3 max-w-[85%] shadow-md mb-2">
                    {message.content}
                </div>
                {message.listButtonText ? (
                     <div className="flex flex-col items-start w-full">
                        <div className="bg-white border border-gray-200 text-gray-800 rounded-lg p-2 text-sm text-center shadow-sm w-4/5">
                            <details>
                                <summary className="flex justify-between items-center cursor-pointer font-semibold text-blue-600">
                                    <span>{message.listButtonText}</span>
                                    <span className="text-xs">▼</span>
                                </summary>
                                <div className="mt-2 border-t pt-2 space-y-1">
                                    {message.options.map((opt: any) => (
                                        <div key={opt.id} onClick={() => handleOptionClick(opt)} className="p-2 text-blue-600 hover:bg-blue-50 rounded text-left cursor-pointer">{opt.label}</div>
                                    ))}
                                </div>
                            </details>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-1 items-start w-full">
                        {message.options.map((opt: any) => (
                            <button key={opt.id} onClick={() => handleOptionClick(opt)} className="bg-white border border-gray-200 text-blue-600 rounded-lg p-2 text-sm text-center shadow-sm w-4/5 hover:bg-blue-50 transition-colors">
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
      }
      return <div className={`p-3 rounded-lg max-w-[85%] shadow-md ${message.isUser ? 'self-end bg-[#DCF8C6] text-gray-800 rounded-br-none' : 'self-start bg-white text-gray-800 rounded-tl-none'}`}>{message.content}</div>;
  }
  
  return (
    <div className="w-[350px] h-[700px] bg-gray-200 border-8 border-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
      <div className="p-2 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#075E54' }}>
        <div className="flex items-center space-x-3">
          <img src="https://i.pravatar.cc/40?u=bot" alt="Bot Avatar" className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <h3 className="font-bold text-white">Atendente Virtual</h3>
            <p className="text-xs text-gray-200">online</p>
          </div>
        </div>
        <button onClick={handleRefresh} className="text-white hover:text-gray-300 p-1" title="Recarregar e reiniciar conversa">
            <RefreshIcon />
        </button>
      </div>

      <div className="flex-grow p-3 bg-cover bg-center overflow-y-auto" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')" }}>
        <div className="flex flex-col space-y-3 h-full pr-1">
            {displayState.conversation.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  {renderMessageContent(msg)}
              </div>
            ))}
            {displayState.isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleUserInputSubmit} className="bg-[#F0F0F0] p-2 flex items-center space-x-2 flex-shrink-0 border-t border-gray-300">
         <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={!displayState.isWaitingForInput}
            placeholder={displayState.isWaitingForInput ? "Digite sua resposta..." : "Mensagem"}
            className="flex-grow bg-white rounded-full py-2 px-4 text-sm text-gray-800 focus:outline-none disabled:bg-gray-300"
        />
         <button type="submit" disabled={!displayState.isWaitingForInput || !userInput.trim()} className="text-white rounded-full p-2 disabled:bg-gray-400" style={{ backgroundColor: '#128C7E' }}>
            <SendIcon />
         </button>
      </form>
    </div>
  );
};

export default PhonePreview;