export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}