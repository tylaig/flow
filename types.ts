import { Node, Edge } from 'reactflow';

export enum BlockType {
  Start = 'Start',
  Text = 'Text',
  Image = 'Image',
  Audio = 'Audio',
  Video = 'Video',
  Document = 'Document',
  Location = 'Location',
  Template = 'Template',
  Options = 'Options',
  List = 'List',
  AICall = 'AICall',
  Condition = 'Condition',
  SaveResponse = 'SaveResponse',
  Delay = 'Delay',
  Integration = 'Integration',
  Group = 'Group',
}

export interface BlockOption {
  id: string;
  label: string;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface StartBlock extends BaseBlock {
  type: BlockType.Start;
}

export interface TextBlock extends BaseBlock {
  type: BlockType.Text;
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: BlockType.Image;
  url: string;
}

export interface AudioBlock extends BaseBlock {
  type: BlockType.Audio;
  url: string;
}

export interface VideoBlock extends BaseBlock {
  type: BlockType.Video;
  url: string;
}

export interface DocumentBlock extends BaseBlock {
  type: BlockType.Document;
  url: string;
  filename: string;
}

export interface LocationBlock extends BaseBlock {
  type: BlockType.Location,
  latitude: string;
  longitude: string;
  name: string;
  address: string;
}

export interface TemplateBlock extends BaseBlock {
    type: BlockType.Template,
    templateName: string;
    variables: string; // Comma-separated
}

export interface OptionsButtonBlock extends BaseBlock {
  type: BlockType.Options;
  message: string;
  options: BlockOption[];
}

export interface ListButtonBlock extends BaseBlock {
  type: BlockType.List;
  message: string;
  buttonText: string;
  options: BlockOption[];
}

export interface AICallBlock extends BaseBlock {
  type: BlockType.AICall;
  prompt: string;
  variableToSave: string;
}

export interface ConditionClause {
    variable: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: string;
}

export interface ConditionBlock extends BaseBlock {
    type: BlockType.Condition;
    clause: ConditionClause;
}

export interface SaveResponseBlock extends BaseBlock {
  type: BlockType.SaveResponse;
  message: string;
  variableToSave: string;
}

export interface DelayBlock extends BaseBlock {
  type: BlockType.Delay;
  seconds: number;
}

export interface IntegrationBlock extends BaseBlock {
  type: BlockType.Integration;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: string; // JSON string
  body: string; // JSON string
  variableToSave: string;
}

export interface GroupBlock extends BaseBlock {
  type: BlockType.Group;
  label: string;
}

export type ChatBlock = 
  | StartBlock 
  | TextBlock 
  | ImageBlock 
  | AudioBlock
  | VideoBlock
  | DocumentBlock
  | LocationBlock
  | TemplateBlock
  | OptionsButtonBlock 
  | ListButtonBlock 
  | AICallBlock 
  | ConditionBlock
  | SaveResponseBlock
  | DelayBlock
  | IntegrationBlock
  | GroupBlock;

export type CustomNode = Node<ChatBlock>;

export interface AnalyticsData {
  messagesSent: number;
  activeConversations: number;
  buttonClickRate: number;
  engagementByHour: { hour: string; interactions: number }[];
  popularButtons: { name: string; clicks: number }[];
}

export interface WidgetConfig {
  title: string;
  avatarUrl: string;
  themeColor: string;
  welcomeMessage: string;
}