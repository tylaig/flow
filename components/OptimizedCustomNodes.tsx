import React, { memo, useMemo } from 'react';
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

// Handles otimizados com 40px de diâmetro
const optimizedHandleStyle = { 
    width: 40,
    height: 40,
    background: '#FF6B2B',
    border: '3px solid #FFFFFF',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(255, 107, 43, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

// Componente Handle otimizado
const OptimizedHandle = memo<{
  type: 'source' | 'target';
  position: Position;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}>(({ type, position, id, style = {}, children }) => (
  <Handle 
    type={type} 
    position={position} 
    id={id}
    style={{
      ...optimizedHandleStyle,
      ...style,
    }}
    className="optimized-handle"
  >
    {children}
  </Handle>
));

OptimizedHandle.displayName = 'OptimizedHandle';

// Componente Group otimizado
const OptimizedGroupNode = memo<NodeProps<GroupBlock>>(({ data, id }) => {
    const { updateNode } = useFlowContext();
    
    const handleLabelChange = useMemo(() => (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNode(id, { ...data, label: e.target.value });
    }, [id, data, updateNode]);

    return (
        <div className="optimized-group-node">
            <OptimizedHandle type="target" position={Position.Top} style={{ opacity: 0 }} />
            <div className="group-header">
                <input 
                    value={data.label}
                    onChange={handleLabelChange}
                    className="group-input"
                />
            </div>
        </div>
    );
});

OptimizedGroupNode.displayName = 'OptimizedGroupNode';

// Componente principal otimizado
const OptimizedCustomNode = memo<NodeProps<ChatBlock>>(({ data, id, selected }) => {
  const { type } = data;
  const { updateNode, deleteNode, duplicateNode } = useFlowContext();
  const isStart = type === BlockType.Start;
  
  // Memoizar funções de callback
  const updateBlock = useMemo(() => (updatedData: ChatBlock) => updateNode(id, updatedData), [id, updateNode]);
  const deleteBlock = useMemo(() => () => deleteNode(id), [id, deleteNode]);
  const duplicateBlock = useMemo(() => () => duplicateNode(id), [id, duplicateNode]);

  // Memoizar editor baseado no tipo
  const editor = useMemo(() => {
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
        return <GroupBlockEditor block={data as GroupBlock} updateBlock={updateBlock} deleteBlock={deleteBlock} duplicateBlock={duplicateBlock}/>;
      default:
        return <div>Tipo de bloco desconhecido</div>;
    }
  }, [type, data, updateBlock, deleteBlock, duplicateBlock]);

  // Memoizar handles de origem
  const sourceHandles = useMemo(() => {
    switch(type) {
        case BlockType.Options: {
            const block = data as OptionsButtonBlock;
            const baseTop = 168; 
            const optionHeight = 48;
            return block.options.map((option, index) => (
                <OptimizedHandle
                    key={option.id}
                    type="source"
                    position={Position.Right}
                    id={option.id}
                    style={{ top: `${baseTop + index * optionHeight}px` }}
                />
            ));
        }
        case BlockType.List: {
             const block = data as ListButtonBlock;
             const baseTop = 202;
             const optionHeight = 48;
             return block.options.map((option, index) => (
                <OptimizedHandle
                    key={option.id}
                    type="source"
                    position={Position.Right}
                    id={option.id}
                    style={{ top: `${baseTop + index * optionHeight}px` }}
                />
            ));
        }
        case BlockType.Condition:
            return (
                <>
                    <OptimizedHandle 
                        type="source" 
                        position={Position.Right} 
                        id="then" 
                        style={{ top: '120px' }}
                    >
                        <div className="condition-label condition-then">Então</div>
                    </OptimizedHandle>
                    <OptimizedHandle 
                        type="source" 
                        position={Position.Right} 
                        id="else" 
                        style={{ top: '170px' }}
                    >
                        <div className="condition-label condition-else">Senão</div>
                    </OptimizedHandle>
                </>
            );
        case BlockType.Start:
             return <OptimizedHandle type="source" position={Position.Bottom} />;
        default:
            return <OptimizedHandle type="source" position={Position.Right} />;
    }
  }, [type, data]);

  return (
    <div className={`optimized-node ${selected ? 'selected' : ''} ${type.toLowerCase()}-node`}>
      {!isStart && type !== BlockType.Group && (
        <OptimizedHandle type="target" position={Position.Top} id="a" />
      )}
      {editor}
      {sourceHandles}
    </div>
  );
});

OptimizedCustomNode.displayName = 'OptimizedCustomNode';

// Tipos de nós otimizados
export const nodeTypes = {
  [BlockType.Start]: OptimizedCustomNode,
  [BlockType.Text]: OptimizedCustomNode,
  [BlockType.Image]: OptimizedCustomNode,
  [BlockType.Audio]: OptimizedCustomNode,
  [BlockType.Video]: OptimizedCustomNode,
  [BlockType.Document]: OptimizedCustomNode,
  [BlockType.Location]: OptimizedCustomNode,
  [BlockType.Template]: OptimizedCustomNode,
  [BlockType.Options]: OptimizedCustomNode,
  [BlockType.List]: OptimizedCustomNode,
  [BlockType.AICall]: OptimizedCustomNode,
  [BlockType.Condition]: OptimizedCustomNode,
  [BlockType.SaveResponse]: OptimizedCustomNode,
  [BlockType.Delay]: OptimizedCustomNode,
  [BlockType.Integration]: OptimizedCustomNode,
  [BlockType.Group]: OptimizedGroupNode,
};