import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
    ChatBlock, BlockType, OptionsButtonBlock, ListButtonBlock, TextBlock, ImageBlock, AudioBlock, 
    VideoBlock, DocumentBlock, LocationBlock, TemplateBlock, AICallBlock, ConditionBlock, SaveResponseBlock,
    DelayBlock, IntegrationBlock, GroupBlock
} from '../types';
import { 
    StartBlockEditor, TextBlockEditor, ImageBlockEditor, OptionsButtonBlockEditor, ListButtonBlockEditor, 
    AICallBlockEditor, ConditionBlockEditor, AudioBlockEditor, VideoBlockEditor, DocumentBlockEditor, 
    LocationBlockEditor, TemplateBlockEditor, SaveResponseBlockEditor, DelayBlockEditor, IntegrationBlockEditor,
    GroupBlockEditor
} from './BlockEditors';
import { useFlowContext } from '../FlowContext';

// Extend NodeProps to include flowId
interface CustomNodeProps<T = any> extends NodeProps<T> {
  flowId?: string | null;
}

const handleStyle = { 
    width: 16, 
    height: 16,
    background: '#8B5CF6',
    border: '3px solid #FFFFFF',
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
    zIndex: 10,
};

const GroupNode: React.FC<CustomNodeProps<GroupBlock>> = ({ data, id, flowId }) => {
    const { updateNode, deleteNode, duplicateNode } = useFlowContext();
    return (
        <div className="bg-purple-50/80 border-3 border-dashed border-purple-400 rounded-2xl shadow-xl nowheel backdrop-blur-sm">
            <Handle type="target" position={Position.Top} style={{...handleStyle, opacity: 0}} />
            <div className="p-3 bg-purple-600/90 rounded-t-2xl">
                <input 
                    value={data.label}
                    onChange={(e) => updateNode(id, {...data, label: e.target.value})}
                    className="bg-transparent text-white font-bold text-base w-full focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 py-1"
                />
            </div>
            {/* Child nodes will be rendered here by React Flow */}
        </div>
    );
};

const CustomNode: React.FC<CustomNodeProps<ChatBlock>> = ({ data, id, flowId }) => {
  const { type } = data;
  const { updateNode, deleteNode, duplicateNode } = useFlowContext();
  const isStart = type === BlockType.Start;
  
  const renderEditor = () => {
    // We pass the generic update/delete functions from context, but typed to the specific block
    const updateBlock = (updatedData: ChatBlock) => updateNode(id, updatedData);
    const deleteBlock = () => deleteNode(id);
    const duplicateBlock = () => duplicateNode(id);

    switch (type) {
      case BlockType.Start:
        return <StartBlockEditor />;
      case BlockType.Text:
        return <TextBlockEditor block={data as TextBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Image:
        return <ImageBlockEditor block={data as ImageBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Audio:
        return <AudioBlockEditor block={data as AudioBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Video:
        return <VideoBlockEditor block={data as VideoBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Document:
        return <DocumentBlockEditor block={data as DocumentBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Location:
        return <LocationBlockEditor block={data as LocationBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Template:
        return <TemplateBlockEditor block={data as TemplateBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Options:
        return <OptionsButtonBlockEditor block={data as OptionsButtonBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.List:
        return <ListButtonBlockEditor block={data as ListButtonBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.SaveResponse:
        return <SaveResponseBlockEditor block={data as SaveResponseBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.AICall:
        return <AICallBlockEditor block={data as AICallBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Condition:
        return <ConditionBlockEditor block={data as ConditionBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Delay:
        return <DelayBlockEditor block={data as DelayBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Integration:
        return <IntegrationBlockEditor block={data as IntegrationBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />;
      case BlockType.Group:
          return <GroupBlockEditor block={data as GroupBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} flowId={flowId} />
      default:
        return <div>Tipo de bloco desconhecido</div>;
    }
  };

  const renderSourceHandles = () => {
    switch(type) {
        case BlockType.Options: {
            const block = data as OptionsButtonBlock;
            const baseTop = 180; 
            const optionHeight = 52;
            return block.options.map((option, index) => (
                <Handle
                    key={option.id}
                    type="source"
                    position={Position.Right}
                    id={option.id}
                    style={{ ...handleStyle, top: `${baseTop + index * optionHeight}px`, background: '#F97316' }}
                />
            ));
        }
        case BlockType.List: {
             const block = data as ListButtonBlock;
             const baseTop = 220;
             const optionHeight = 52;
             return block.options.map((option, index) => (
                <Handle
                    key={option.id}
                    type="source"
                    position={Position.Right}
                    id={option.id}
                    style={{ ...handleStyle, top: `${baseTop + index * optionHeight}px`, background: '#F97316' }}
                />
            ));
        }
        case BlockType.Condition:
            return <>
                <Handle type="source" position={Position.Right} id="then" style={{ ...handleStyle, top: '140px', background: '#22C55E' }}>
                     <div className="absolute -left-14 -translate-y-1/2 text-xs text-white bg-green-500 px-2 py-1 rounded-md font-medium shadow-lg">Então</div>
                </Handle>
                <Handle type="source" position={Position.Right} id="else" style={{ ...handleStyle, top: '190px', background: '#EF4444' }}>
                    <div className="absolute -left-14 -translate-y-1/2 text-xs text-white bg-red-500 px-2 py-1 rounded-md font-medium shadow-lg">Senão</div>
                </Handle>
            </>;
        case BlockType.Start:
             return <Handle type="source" position={Position.Bottom} style={{...handleStyle, background: '#22C55E'}} />;
        default:
            return <Handle type="source" position={Position.Right} style={handleStyle} />;
    }
  }

  return (
    <div>
      {!isStart && type !== BlockType.Group && <Handle type="target" position={Position.Top} id="a" style={{...handleStyle, background: '#6B7280'}} />}
      {renderEditor()}
      {renderSourceHandles()}
    </div>
  );
};

export const nodeTypes = {
  [BlockType.Start]: memo(CustomNode),
  [BlockType.Text]: memo(CustomNode),
  [BlockType.Image]: memo(CustomNode),
  [BlockType.Audio]: memo(CustomNode),
  [BlockType.Video]: memo(CustomNode),
  [BlockType.Document]: memo(CustomNode),
  [BlockType.Location]: memo(CustomNode),
  [BlockType.Template]: memo(CustomNode),
  [BlockType.Options]: memo(CustomNode),
  [BlockType.List]: memo(CustomNode),
  [BlockType.AICall]: memo(CustomNode),
  [BlockType.Condition]: memo(CustomNode),
  [BlockType.SaveResponse]: memo(CustomNode),
  [BlockType.Delay]: memo(CustomNode),
  [BlockType.Integration]: memo(CustomNode),
  [BlockType.Group]: memo(GroupNode),
};