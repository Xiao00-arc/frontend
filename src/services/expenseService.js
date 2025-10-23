import api from './api';

const getAllExpenses = (pageable) => {
  console.log('[ExpenseService] getAllExpenses called with params:', pageable);
  return api.get('/expenses', { params: pageable });
};

const getMyExpenses = (pageable) => {
  console.log('[ExpenseService] getMyExpenses called with params:', pageable);
  return api.get('/expenses/my-expenses', { params: pageable });
};

const createExpense = (expenseData) => {
  console.log('[ExpenseService] createExpense called with data:', expenseData);
  return api.post('/expenses/post', expenseData);
};

const getExpenseById = (id) => {
  console.log('[ExpenseService] getExpenseById called with id:', id);
  return api.get(`/expenses/${id}`);
};

const updateExpense = (id, expenseData) => {
  console.log('[ExpenseService] updateExpense called with id:', id, 'data:', expenseData);
  return api.put(`/expenses/${id}`, expenseData);
};

const deleteExpense = (id) => {
  console.log('[ExpenseService] deleteExpense called with id:', id);
  return api.delete(`/expenses/${id}`);
};

const expenseService = {
  getAllExpenses,
  getMyExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};

export default expenseService;