import React from 'react';
import { Edge } from 'reactflow';
import {
    CustomNode, BlockType, SaveResponseBlock, OptionsButtonBlock,
    ListButtonBlock, ConditionBlock, DocumentBlock, LocationBlock, TemplateBlock,
    AudioBlock, VideoBlock, ImageBlock, DelayBlock, IntegrationBlock, AICallBlock
} from '../types';
import { generateAiResponse } from './geminiService';
import { AudioIcon, DocumentIcon, LocationIcon, VideoIcon } from '../components/icons';

export interface DisplayMessage {
    id: string;
    content: React.ReactNode;
    isUser: boolean;
    options?: any[];
    listButtonText?: string;
}

export interface DisplayState {
    conversation: DisplayMessage[];
    isTyping: boolean;
    isWaitingForInput: boolean;
}

export class FlowRunner {
    private nodes: CustomNode[];
    private edges: Edge[];
    private nodeMap: Map<string, CustomNode>;
    private variables: Record<string, any> = {};
    private currentNodeId: string | undefined;
    private onStateChange: (state: DisplayState) => void;
    private state: DisplayState;

    constructor(nodes: CustomNode[], edges: Edge[], onStateChange: (state: DisplayState) => void) {
        this.nodes = nodes;
        this.edges = edges;
        this.nodeMap = new Map(nodes.map(node => [node.id, node]));
        this.onStateChange = onStateChange;
        this.state = {
            conversation: [],
            isTyping: false,
            isWaitingForInput: false,
        };
    }

    private _updateState(updater: (prevState: DisplayState) => DisplayState) {
        this.state = updater(this.state);
        this.onStateChange({ ...this.state });
    }

    private _addMessage(message: Omit<DisplayMessage, 'id' | 'isUser'>, isUser: boolean) {
        this._updateState(s => ({
            ...s,
            conversation: [...s.conversation, { ...message, id: `msg-${Date.now()}-${s.conversation.length}`, isUser }]
        }));
    }

    private _replaceVariables(text: string): string {
        if (typeof text !== 'string') return String(text);
        return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
            const value = this.variables[varName.trim()];
            if (value === undefined || value === null) return match;
            if (typeof value === 'object') return JSON.stringify(value, null, 2);
            return String(value);
        });
    }

    private _getNextNodeId(sourceId: string, sourceHandle?: string): string | undefined {
        const edge = this.edges.find(e => e.source === sourceId && (!sourceHandle || e.sourceHandle === sourceHandle));
        return edge?.target;
    }

    public start(welcomeMessage?: string) {
        this.variables = {};
        const conversation = welcomeMessage ? [{ id: 'welcome', content: React.createElement('p', { className: 'text-sm whitespace-pre-wrap' }, welcomeMessage), isUser: false }] : [];
        
        this._updateState(() => ({
            conversation,
            isTyping: false,
            isWaitingForInput: false,
        }));
        
        const startNode = this.nodes.find(n => n.data.type === BlockType.Start);
        if (startNode) {
            this.currentNodeId = this._getNextNodeId(startNode.id);
            this.run();
        }
    }

    public async provideInput(value: string, option?: { handleId: string, label: string }) {
        if (option) {
            this._addMessage({ content: React.createElement('p', { className: 'text-sm' }, option.label) }, true);
            this.currentNodeId = this._getNextNodeId(this.currentNodeId!, option.handleId);
        } else {
            const waitingVar = (this.nodeMap.get(this.currentNodeId!)?.data as SaveResponseBlock).variableToSave;
            this.variables[waitingVar] = value;
            this._addMessage({ content: React.createElement('p', { className: 'text-sm' }, value) }, true);
            this.currentNodeId = this._getNextNodeId(this.currentNodeId!);
        }
        this._updateState(s => ({...s, isWaitingForInput: false}));
        this.run();
    }

    private async run() {
        while (this.currentNodeId) {
            const node = this.nodeMap.get(this.currentNodeId);
            if (!node || node.data.type === BlockType.Group) { // Skip group nodes
                this.currentNodeId = this._getNextNodeId(this.currentNodeId!);
                if(!node) break;
                else continue;
            };
            
            const block = node.data;
            let shouldContinue = true;

            await new Promise(res => setTimeout(res, 300));
            
            switch (block.type) {
                case BlockType.Text:
                    this._addMessage({ content: React.createElement('p', { className: 'text-sm whitespace-pre-wrap' }, this._replaceVariables(block.content) || "...") }, false);
                    break;
                case BlockType.Image:
                    this._addMessage({ content: React.createElement('img', { src: this._replaceVariables((block as ImageBlock).url) || 'https://picsum.photos/200/150', alt: 'preview', className: 'rounded-md' }) }, false);
                    break;
                case BlockType.Options:
                case BlockType.List:
                    this._addMessage({
                        content: React.createElement('p', { className: 'text-sm whitespace-pre-wrap' }, this._replaceVariables(block.message) || "..."),
                        options: (block as OptionsButtonBlock | ListButtonBlock).options,
                        listButtonText: (block as ListButtonBlock).buttonText,
                    }, false);
                    shouldContinue = false;
                    break;
                case BlockType.SaveResponse:
                    this._addMessage({ content: React.createElement('p', { className: 'text-sm whitespace-pre-wrap' }, this._replaceVariables(block.message) || "...") }, false);
                    this._updateState(s => ({ ...s, isWaitingForInput: true }));
                    shouldContinue = false;
                    break;
                case BlockType.Condition:
                    const { variable, operator, value } = (block as ConditionBlock).clause;
                    const varValue = this.variables[variable] || '';
                    let conditionMet = false;
                    switch(operator) {
                        case 'equals': conditionMet = String(varValue) === value; break;
                        case 'not_equals': conditionMet = String(varValue) !== value; break;
                        case 'contains': conditionMet = String(varValue).includes(value); break;
                    }
                    this.currentNodeId = this._getNextNodeId(node.id, conditionMet ? 'then' : 'else');
                    continue; 
                case BlockType.Delay:
                    this._updateState(s => ({ ...s, isTyping: true }));
                    await new Promise(res => setTimeout(res, block.seconds * 1000));
                    this._updateState(s => ({ ...s, isTyping: false }));
                    break;
                case BlockType.AICall:
                case BlockType.Integration:
                     this._updateState(s => ({ ...s, isTyping: true }));
                     let responseData: any;
                     try {
                        if(block.type === BlockType.AICall) {
                            responseData = await generateAiResponse(this._replaceVariables((block as AICallBlock).prompt));
                        } else {
                            const b = block as IntegrationBlock;
                            const replacedUrl = this._replaceVariables(b.url);
                            const replacedHeaders = JSON.parse(this._replaceVariables(b.headers || '{}'));
                            const replacedBody = b.body ? JSON.parse(this._replaceVariables(b.body)) : undefined;

                            const response = await fetch(replacedUrl, { method: b.method, headers: replacedHeaders, body: b.body ? JSON.stringify(replacedBody) : undefined });
                            responseData = await response.json().catch(() => response.text());
                        }
                        if (block.variableToSave) {
                            this.variables[block.variableToSave] = responseData;
                        }
                     } catch(e) {
                         console.error("Error in block execution", e);
                     }
                     this._updateState(s => ({ ...s, isTyping: false }));
                     break;
                case BlockType.Audio:
                    this._addMessage({ content: React.createElement('div', { className: 'flex items-center space-x-2' }, React.createElement(AudioIcon), React.createElement('a', { href: this._replaceVariables(block.url), target: '_blank', rel: 'noreferrer', className: 'text-xs italic text-blue-600 truncate underline' }, 'Ouvir áudio')) }, false);
                    break;
                case BlockType.Video:
                    this._addMessage({ content: React.createElement('div', { className: 'flex items-center space-x-2' }, React.createElement(VideoIcon), React.createElement('a', { href: this._replaceVariables(block.url), target: '_blank', rel: 'noreferrer', className: 'text-xs italic text-blue-600 truncate underline' }, 'Assistir vídeo')) }, false);
                    break;
                case BlockType.Document:
                    this._addMessage({ content: React.createElement('div', { className: 'flex items-center space-x-2 p-2 bg-gray-100 rounded-md w-full' }, React.createElement(DocumentIcon), React.createElement('a', { href: this._replaceVariables(block.url), target: '_blank', rel: 'noreferrer', className: 'font-medium text-sm text-blue-600 underline' }, this._replaceVariables((block as DocumentBlock).filename) || 'Documento')) }, false);
                    break;
                case BlockType.Location:
                    this._addMessage({ content: React.createElement('div', { className: 'flex items-center space-x-2' }, React.createElement(LocationIcon), React.createElement('span', { className: 'font-medium text-sm text-blue-600' }, this._replaceVariables((block as LocationBlock).name) || 'Localização')) }, false);
                    break;
                case BlockType.Template:
                    this._addMessage({ content: React.createElement('p', { className: 'text-sm italic text-gray-500' }, 'Usando template: ' + this._replaceVariables((block as TemplateBlock).templateName)) }, false);
                    break;
            }

            if (!shouldContinue) {
                break;
            }
            
            this.currentNodeId = this._getNextNodeId(this.currentNodeId);
        }
        if (!this.currentNodeId && !this.state.isWaitingForInput) {
            // End of flow
        }
    }
}