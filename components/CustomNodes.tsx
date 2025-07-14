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


const handleStyle = { 
    width: 12, 
    height: 12,
    background: '#9CA3AF',
    border: '2px solid #1F2937',
    zIndex: 10,
};

const GroupNode: React.FC<NodeProps<GroupBlock>> = ({ data, id }) => {
    const { updateNode, deleteNode, duplicateNode } = useFlowContext();
    return (
        <div className="bg-gray-500/10 border-2 border-dashed border-gray-500 rounded-xl shadow-lg nowheel">
            <Handle type="target" position={Position.Top} style={{opacity: 0}} />
            <div className="p-2 bg-gray-800/50 rounded-t-lg">
                <input 
                    value={data.label}
                    onChange={(e) => updateNode(id, {...data, label: e.target.value})}
                    className="bg-transparent text-white font-bold text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                />
            </div>
            {/* Child nodes will be rendered here by React Flow */}
        </div>
    );
};

const CustomNode: React.FC<NodeProps<ChatBlock>> = ({ data, id }) => {
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
        return <TextBlockEditor block={data as TextBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Image:
        return <ImageBlockEditor block={data as ImageBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Audio:
        return <AudioBlockEditor block={data as AudioBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Video:
        return <VideoBlockEditor block={data as VideoBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Document:
        return <DocumentBlockEditor block={data as DocumentBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Location:
        return <LocationBlockEditor block={data as LocationBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Template:
        return <TemplateBlockEditor block={data as TemplateBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Options:
        return <OptionsButtonBlockEditor block={data as OptionsButtonBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.List:
        return <ListButtonBlockEditor block={data as ListButtonBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.SaveResponse:
        return <SaveResponseBlockEditor block={data as SaveResponseBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.AICall:
        return <AICallBlockEditor block={data as AICallBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Condition:
        return <ConditionBlockEditor block={data as ConditionBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Delay:
        return <DelayBlockEditor block={data as DelayBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Integration:
        return <IntegrationBlockEditor block={data as IntegrationBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock} />;
      case BlockType.Group:
          return <GroupBlockEditor block={data as GroupBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock}/>
      default:
        return <div>Tipo de bloco desconhecido</div>;
    }
  };

  const renderSourceHandles = () => {
    switch(type) {
        case BlockType.Options: {
            const block = data as OptionsButtonBlock;
            const baseTop = 168; 
            const optionHeight = 48;
            return block.options.map((option, index) => (
                <Handle
                    key={option.id}
                    type="source"
                    position={Position.Right}
                    id={option.id}
                    style={{ ...handleStyle, top: `${baseTop + index * optionHeight}px` }}
                />
            ));
        }
        case BlockType.List: {
             const block = data as ListButtonBlock;
             const baseTop = 202;
             const optionHeight = 48;
             return block.options.map((option, index) => (
                <Handle
                    key={option.id}
                    type="source"
                    position={Position.Right}
                    id={option.id}
                    style={{ ...handleStyle, top: `${baseTop + index * optionHeight}px` }}
                />
            ));
        }
        case BlockType.Condition:
            return <>
                <Handle type="source" position={Position.Right} id="then" style={{ ...handleStyle, top: '120px' }}>
                     <div className="absolute -left-12 -translate-y-1/2 text-xs text-green-400 bg-dark-surface px-2 py-0.5 rounded border border-dark-border">Então</div>
                </Handle>
                <Handle type="source" position={Position.Right} id="else" style={{ ...handleStyle, top: '170px' }}>
                    <div className="absolute -left-12 -translate-y-1/2 text-xs text-red-400 bg-dark-surface px-2 py-0.5 rounded border border-dark-border">Senão</div>
                </Handle>
            </>;
        case BlockType.Start:
             return <Handle type="source" position={Position.Bottom} style={handleStyle} />;
        default:
            return <Handle type="source" position={Position.Right} style={handleStyle} />;
    }
  }

  return (
    <div>
      {!isStart && type !== BlockType.Group && <Handle type="target" position={Position.Top} id="a" style={handleStyle} />}
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