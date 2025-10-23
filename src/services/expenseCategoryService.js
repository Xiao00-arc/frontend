import api from './api';

const getAllCategories = (pageable) => {
  console.debug('[ExpenseCategoryService] getAllCategories pageable=', pageable);
  return api.get('/expense-categories', { params: pageable });
};

const getCategoryById = (id) => {
  console.debug('[ExpenseCategoryService] getCategoryById id=', id);
  return api.get(`/expense-categories/${id}`);
};

const createCategory = (categoryData) => {
  console.debug('[ExpenseCategoryService] createCategory data=', categoryData);
  return api.post('/expense-categories/post', categoryData);
};

const updateCategory = (id, categoryData) => {
  console.debug('[ExpenseCategoryService] updateCategory id=', id, 'data=', categoryData);
  return api.put(`/expense-categories/${id}`, categoryData);
};

const deleteCategory = (id) => {
  console.debug('[ExpenseCategoryService] deleteCategory id=', id);
  return api.delete(`/expense-categories/${id}`);
};

const expenseCategoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default expenseCategoryService;