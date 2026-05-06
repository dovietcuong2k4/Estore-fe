export interface ChatbotHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotRequest {
  message: string;
  history: ChatbotHistoryMessage[];
}

export interface ChatbotProductSuggestion {
  id: number;
  name: string;
  price: number;
  categoryName?: string;
  brandName?: string;
  thumbnailUrl?: string;
  cpu?: string;
  ram?: string;
  stockQuantity?: number;
}

export interface ChatbotResponse {
  answer: string;
  suggestions: ChatbotProductSuggestion[];
  aiEnabled: boolean;
}
