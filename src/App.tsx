import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseCharts } from './components/ExpenseCharts';
import { Chatbot } from './components/Chatbot';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense = {
      ...newExpense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [...prev, expense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">FinAssist</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ExpenseForm
            onAddExpense={handleAddExpense}
          />

          {expenses.length > 0 && (
            <>
              <ExpenseCharts expenses={expenses} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ExpenseList
                    expenses={expenses}
                    onDeleteExpense={handleDeleteExpense}
                    onEditExpense={handleEditExpense}
                  />
                </div>
                
                <div>
                  <Chatbot expenses={expenses} />
                </div>
              </div>
            </>
          )}

          {expenses.length === 0 && (
            <div className="text-center py-12">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Empty state illustration"
                className="mx-auto h-48 w-48 object-cover rounded-full mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">No expenses yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first expense above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;