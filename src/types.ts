export type ToolMode = 
  | 'select'
  | 'text'
  | 'highlight'
  | 'underline'
  | 'strikethrough'
  | 'shape-rect'
  | 'shape-circle'
  | 'shape-line'
  | 'shape-arrow'
  | 'pen'
  | 'signature'
  | 'stamp'
  | 'form-field'
  | 'redact';

export type ActiveTab = 'edit' | 'organize' | 'fill-sign' | 'ai-pro';

export type AnnotationType = 'text' | 'highlight' | 'underline' | 'strikethrough' | 'shape' | 'drawing' | 'signature' | 'stamp' | 'form-field' | 'redact';

export interface Annotation {
  id: string;
  pageIndex: number;
  type: AnnotationType;
  x: number; // percentage or pixels
  y: number;
  width?: number;
  height?: number;
  content?: string; // for text, form fields, stamps
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  strokeWidth?: number;
  points?: { x: number; y: number }[]; // for freehand drawing
  shapeType?: 'rect' | 'circle' | 'line' | 'arrow';
  signatureDataUrl?: string;
  isRedacted?: boolean;
}

export interface PDFPageData {
  pageNumber: number;
  width: number;
  height: number;
  text: string;
  rotation: number; // 0, 90, 180, 270
}

export interface PDFDocumentData {
  title: string;
  fileName: string;
  fileSize: string;
  author?: string;
  subject?: string;
  pages: PDFPageData[];
  annotations: Annotation[];
  isProtected?: boolean;
  encryptionLevel?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
