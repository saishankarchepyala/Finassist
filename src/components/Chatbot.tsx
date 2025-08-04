import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatbotProps {
  expenses: Expense[];
}

export function Chatbot({ expenses }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your financial assistant. Ask me about your expenses!",
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');

  const generateResponse = (query: string): string => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categories = [...new Set(expenses.map(exp => exp.category))];
    
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('total expenses')) {
      return `Your total expenses are $${totalExpenses.toFixed(2)}.`;
    }
    
    if (lowercaseQuery.includes('categories')) {
      return `You have expenses in these categories: ${categories.join(', ')}.`;
    }
    
    if (lowercaseQuery.includes('highest expense')) {
      const highest = expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max);
      return `Your highest expense was $${highest.amount.toFixed(2)} for ${highest.description} in the ${highest.category} category.`;
    }
    
    return "I'm not sure about that. Try asking about your total expenses, expense categories, or highest expense!";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true
    };

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: generateResponse(input),
      isUser: false
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[400px] flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Financial Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your expenses..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}