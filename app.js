// Initialize Chart.js instances
let pieChart = null;
let barChart = null;

// Store expenses in localStorage
const STORAGE_KEY = 'finassist_expenses';
let expenses = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let editingExpenseId = null;

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseContent = document.getElementById('expenseContent');
const emptyState = document.getElementById('emptyState');
const expenseTableBody = document.getElementById('expenseTableBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// Set today's date as the default date
document.getElementById('date').valueAsDate = new Date();

// Initialize the UI
updateUI();

// Event Listeners
expenseForm.addEventListener('submit', handleExpenseSubmit);
chatForm.addEventListener('submit', handleChatSubmit);

function handleExpenseSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;

  // Validate amount and date
  if (amount <= 0) {
    alert('Amount must be positive');
    return;
  }

  if (new Date(date) > new Date()) {
    alert('Cannot add future expenses');
    return;
  }

  if (editingExpenseId) {
    // Update existing expense
    expenses = expenses.map(exp => 
      exp.id === editingExpenseId 
        ? { ...exp, amount, category, date, description }
        : exp
    );
    editingExpenseId = null;
    document.querySelector('#expenseForm button[type="submit"]').textContent = 'Add Expense';
  } else {
    // Add new expense
    expenses.push({
      id: Date.now().toString(),
      amount,
      category,
      date,
      description
    });
  }

  saveExpenses();
  updateUI();
  expenseForm.reset();
  document.getElementById('date').valueAsDate = new Date();
}

function editExpense(id) {
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return;

  document.getElementById('amount').value = expense.amount;
  document.getElementById('category').value = expense.category;
  document.getElementById('date').value = expense.date;
  document.getElementById('description').value = expense.description;
  
  editingExpenseId = id;
  document.querySelector('#expenseForm button[type="submit"]').textContent = 'Update Expense';
  document.getElementById('amount').focus();
}

function handleChatSubmit(e) {
  e.preventDefault();
  
  const query = chatInput.value.trim();
  if (!query) return;

  // Add user message
  addChatMessage(query, true);
  chatInput.value = '';

  // Generate and add bot response
  const response = generateChatResponse(query);
  addChatMessage(response, false);
}

function addChatMessage(text, isUser) {
  const message = document.createElement('div');
  message.className = `message ${isUser ? 'user' : 'bot'}`;
  
  if (!isUser && text.includes('Here are some questions')) {
    // Create clickable questions for the initial greeting
    const [greeting, ...questions] = text.split('\n');
    message.innerHTML = greeting + '\n' + questions.map(q => {
      const questionText = q.replace(/^\d+\.\s/, '').trim();
      return `<button class="chat-question">${questionText}</button>`;
    }).join('\n');
  } else {
    message.textContent = text;
  }
  
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Add click handlers for chat questions
  const questionButtons = message.querySelectorAll('.chat-question');
  questionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const questionText = button.textContent;
      addChatMessage(questionText, true);
      const response = generateChatResponse(questionText);
      addChatMessage(response, false);
    });
  });
}

function generateChatResponse(query) {
  const lowercaseQuery = query.toLowerCase();
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyIncome = 50000; // Example monthly income
  const savings = monthlyIncome - totalExpenses;
  const categories = [...new Set(expenses.map(exp => exp.category))];
  
  if (lowercaseQuery.includes('hi') || lowercaseQuery.includes('hello') || lowercaseQuery.includes('hey')) {
    return `Hello! Here are some questions you can ask me:
What are my total expenses?
What are my spending categories?
How can I save more?
What's my spending pattern?
Any budgeting tips?
How to reduce daily expenses?
Investment advice?
Emergency fund tips?`;
  }
  
  if (lowercaseQuery.includes('total expenses')) {
    return `Your total expenses are ₹${totalExpenses.toFixed(2)}.`;
  }
  
  if (lowercaseQuery.includes('saving')) {
    return `Based on a monthly income of ₹${monthlyIncome}, your savings are ₹${savings.toFixed(2)}. ${
      savings < 10000 ? "That's quite low. Would you like some saving tips?" : "Great job on your savings!"
    }`;
  }
  
  if (lowercaseQuery.includes('categories')) {
    return `You have expenses in these categories: ${categories.join(', ')}.`;
  }
  
  if (lowercaseQuery.includes('highest expense')) {
    const highest = expenses.reduce((max, exp) => exp.amount > max.amount ? exp : max);
    return `Your highest expense was ₹${highest.amount.toFixed(2)} for ${highest.description} in the ${highest.category} category.`;
  }
  
  if (lowercaseQuery.includes('save more')) {
    return `Here are some tips to save more:
1. Follow the 50/30/20 rule
2. Cut down on non-essential expenses
3. Use public transport when possible
4. Cook meals at home
5. Cancel unused subscriptions
6. Look for better utility plans
Would you like more specific advice about any of these?`;
  }
  
  if (lowercaseQuery.includes('spending pattern')) {
    const categoryTotals = categories.map(cat => {
      const total = expenses
        .filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { category: cat, total };
    }).sort((a, b) => b.total - a.total);
    
    return `Here's your spending pattern:
${categoryTotals.map(({ category, total }) => 
  `${category}: ₹${total.toFixed(2)}`
).join('\n')}

Your highest spending category is ${categoryTotals[0].category}.`;
  }
  
  if (lowercaseQuery.includes('budgeting tips')) {
    return `Here are some effective budgeting tips:
1. Track every expense
2. Set realistic spending limits
3. Use cash for discretionary spending
4. Plan meals in advance
5. Wait 24 hours before large purchases
6. Review your budget weekly`;
  }
  
  if (lowercaseQuery.includes('reduce daily expenses')) {
    return `Tips to reduce daily expenses:
1. Make a shopping list and stick to it
2. Use public transportation or carpool
3. Bring lunch to work
4. Use reusable water bottles
5. Cancel unused subscriptions
6. Compare prices before purchasing
7. Use cashback and rewards programs`;
  }
  
  if (lowercaseQuery.includes('investment')) {
    return `Consider these investment options:
1. Fixed Deposits
2. Mutual Funds
3. PPF (Public Provident Fund)
4. National Pension System
5. Stock Market (with research)
Always consult a financial advisor before making investment decisions.`;
  }
  
  if (lowercaseQuery.includes('emergency fund')) {
    return `Emergency Fund Tips:
1. Aim for 3-6 months of expenses
2. Keep it in a separate savings account
3. Start small but be consistent
4. Use windfall money wisely
5. Replenish after using`;
  }
  
  return "I'm not sure about that. Try asking about your total expenses, savings, categories, or type 'hi' for a list of questions!";
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  updateUI();
}

function updateUI() {
  if (expenses.length === 0) {
    expenseContent.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    expenseContent.classList.remove('hidden');
    emptyState.classList.add('hidden');
    updateExpenseTable();
    updateCharts();
  }
}

function updateExpenseTable() {
  expenseTableBody.innerHTML = '';
  
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(expense => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(expense.date)}</td>
      <td>${expense.category}</td>
      <td>${expense.description}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>
        <button onclick="editExpense('${expense.id}')" class="btn-primary mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
        <button onclick="deleteExpense('${expense.id}')" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </td>
    `;
    expenseTableBody.appendChild(row);
  });
}

function updateCharts() {
  // Prepare data for charts
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const monthlyData = expenses.reduce((acc, expense) => {
    const month = formatDate(expense.date, 'MMM');
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Update pie chart
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData),
        backgroundColor: [
          '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
          '#8884D8', '#82CA9D', '#FDB462'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Update bar chart
  const barCtx = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();
  barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: 'Monthly Expenses',
        data: Object.values(monthlyData),
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function formatDate(dateString, format = 'full') {
  const date = new Date(dateString);
  if (format === 'MMM') {
    return date.toLocaleString('default', { month: 'short' });
  }
  return date.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
}