export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
  retryPayload?: string;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  message: string;
  conversation: ConversationTurn[];
  page: string;
}

export interface AIChatResponse {
  reply: string;
}
