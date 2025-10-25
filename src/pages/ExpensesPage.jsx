import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import expenseCategoryService from '../services/expenseCategoryService';
import approvalService from '../services/approvalService';
import receiptService from '../services/receiptService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, FileIcon, UploadIcon } from 'lucide-react';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const [categories, setCategories] = useState([
    { id: 1, categoryName: 'Travel' },
    { id: 2, categoryName: 'Meals' },
    { id: 3, categoryName: 'Office Supplies' },
    { id: 4, categoryName: 'Training' },
    { id: 5, categoryName: 'Entertainment' }
  ]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    categoryId: 1
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [receipts, setReceipts] = useState({});
  const [viewingReceipts, setViewingReceipts] = useState(null);

  const fetchExpenses = async () => {
    console.log('[ExpensesPage] Starting fetchExpenses');
    console.log('User:', user);
    
    if (!user) {
      console.log('No user found');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Enhanced role checking - check both role formats
      const userRoles = user.role || user.roles || [];
      console.log('All user role data:', { role: user.role, roles: user.roles, userRoles });
      
      const isAdminOrFinance = userRoles.some(role => 
        role === 'ROLE_ADMIN' || role === 'ADMIN' ||
        role === 'ROLE_FINANCE_MANAGER' || role === 'FINANCE_MANAGER' ||
        role === 'ROLE_MANAGER' || role === 'MANAGER'
      );
      
      console.log('User roles array:', userRoles);
      console.log('Is admin/finance/manager?', isAdminOrFinance);
      
      let response;
      if (isAdminOrFinance) {
        console.log('Calling getAllExpenses for admin/finance...');
        response = await expenseService.getAllExpenses({ 
          page: 0, 
          size: 50, 
          sort: 'expenseDate,desc' 
        });
      } else {
        console.log('Calling getMyExpenses for regular user...');
        response = await expenseService.getMyExpenses({ 
          page: 0, 
          size: 20, 
          sort: 'expenseDate,desc' 
        });
      }
      
      console.log('Response received:', response);
      console.log('Response data:', response.data);
      
      // According to API docs, paginated responses have a 'content' array
      let expensesData = [];
      if (response.data) {
        if (Array.isArray(response.data.content)) {
          // Standard pagination response from API
          expensesData = response.data.content;
          console.log('Using paginated content, total elements:', response.data.totalElements);
        } else if (Array.isArray(response.data)) {
          // Direct array response
          expensesData = response.data;
          console.log('Using direct array response');
        } else {
          console.warn('Unexpected response structure:', response.data);
          expensesData = [];
        }
      }
      
      console.log('Setting expenses:', expensesData);
      setExpenses(expensesData);
      
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 401) {
          setError('Authentication required. Please login again.');
        } else if (error.response.status === 403) {
          setError('Access denied. You do not have permission to view expenses.');
        } else {
          setError(`Server error: ${error.response.status}. Please try again later.`);
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await expenseCategoryService.getAllCategories({ page: 0, size: 100 });
      console.log('Categories response:', response.data);
      
      const categoryData = response.data.content || response.data || [];
      if (categoryData.length > 0) {
        setCategories(categoryData);
        console.log('Categories loaded:', categoryData);
      } else {
        console.log('No categories from API, using defaults');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      console.log('Using default categories due to fetch error');
      // Keep the default categories that are already set
    }
  };

  // Find approval ID for a given expense ID
  const findApprovalIdForExpense = async (expenseId) => {
    try {
      console.log(`Finding approval ID for expense ${expenseId}...`);
      const response = await approvalService.getAllApprovals();
      const approvals = response.data.content || response.data || [];
      
      const matchingApproval = approvals.find(approval => approval.expenseId === expenseId);
      
      if (matchingApproval) {
        console.log(`Found approval ID: ${matchingApproval.id} for expense ${expenseId}`);
        return matchingApproval.id;
      } else {
        console.log(`No approval found for expense ${expenseId}`);
        return null;
      }
    } catch (error) {
      console.error('Error finding approval ID:', error);
      return null;
    }
  };

  // Improved approval function that finds the correct approval ID first
  const handleApproval = async (expenseId, action, comments = '') => {
    try {
      console.log(`=== EXPENSE APPROVAL PROCESS ===`);
      console.log(`Action: ${action.toUpperCase()}`);
      console.log(`Expense ID: ${expenseId}`);
      console.log(`User token present:`, !!localStorage.getItem('userToken'));
      
      // Step 1: Find the approval ID for this expense
      const approvalId = await findApprovalIdForExpense(expenseId);
      if (!approvalId) {
        throw new Error(`No approval record found for expense ${expenseId}`);
      }
      
      console.log(`Using approval ID: ${approvalId}`);
      
      // Step 2: Call the approval action endpoint with the correct approval ID
      const actionData = {
        status: action.toUpperCase(), // APPROVED or REJECTED
        comments: comments || `${action.toUpperCase()} via web interface`
      };
      
      // Debug: Show current user authentication details
      console.log('=== AUTH DEBUG ===');
      console.log('Current user object:', user);
      console.log('Token from localStorage:', localStorage.getItem('userToken'));
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Token payload:', payload);
        } catch (e) {
          console.error('Failed to decode token:', e);
        }
      }
      console.log('==================');
      
      // Test API call first to check authentication
      console.log('=== API TEST ===');
      try {
        const testResponse = await api.get('/approvals');
        console.log('API test successful - can access approvals endpoint');
        console.log('Test response status:', testResponse.status);
      } catch (apiError) {
        console.error('API test failed:', apiError.response?.status, apiError.response?.data);
        if (apiError.response?.status === 403) {
          setError('Authentication issue: Your account may not have the required permissions. Please log out and log in again.');
          return;
        }
      }
      console.log('================');
      
      console.log('Calling approvalService.approveOrReject with:', actionData);
      const response = await approvalService.approveOrReject(approvalId, actionData);
      
      console.log('Approval successful:', response.data);
      setError('');
      fetchExpenses(); // Refresh the list
      return;
      
    } catch (error) {
      console.error('Approval failed:', error);
      
      // Enhanced error handling
      if (error.response?.status === 403) {
        setError('Access denied. You may not have permission to approve this expense or your session may have expired.');
      } else if (error.response?.status === 404) {
        setError('Approval record not found. This expense may not be ready for approval.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(`Approval failed: ${error.message || 'Unknown error'}`);
      }
      
      // Fallback: Update local state for UI feedback
      console.log('Updating local state as fallback...');
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense.id === expenseId 
            ? { ...expense, status: action.toUpperCase() }
            : expense
        )
      );
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(expenseId);
        console.log('Expense deleted successfully');
        fetchExpenses();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        setError('Failed to delete expense. Please try again.');
      }
    }
  };

  // Enhanced role checking function
  const hasRole = (rolesToCheck) => {
    if (!user || !user.role) return false;
    
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    return rolesToCheck.some(role => 
      userRoles.some(userRole => 
        userRole && (userRole.includes(role) || userRole === role)
      )
    );
  };

  // Check if current user can approve expenses (only admin, manager, finance_manager)
  const canApprove = user && hasRole(['ROLE_ADMIN', 'ADMIN', 'ROLE_MANAGER', 'MANAGER', 'ROLE_FINANCE_MANAGER', 'FINANCE_MANAGER']);

  // Check if current user is admin (only admin)
  const isAdmin = user && hasRole(['ROLE_ADMIN', 'ADMIN']);

  // Debug role information
  React.useEffect(() => {
    if (user) {
      console.log('=== USER ROLE DEBUG ===');
      console.log('User object:', user);
      console.log('User role:', user.role);
      console.log('Role type:', typeof user.role);
      console.log('Can approve:', canApprove);
      console.log('Is admin:', isAdmin);
      console.log('======================');
    }
  }, [user, canApprove, isAdmin]);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert categoryId to number for proper handling
    const processedValue = name === 'categoryId' ? parseInt(value) || '' : value;
    
    setNewExpense({ ...newExpense, [name]: processedValue });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PNG, JPG, JPEG, and PDF files are allowed');
        return;
      }
      
      setSelectedFile(file);
      setError(''); // Clear any previous errors
    }
  };

  const handleViewReceipts = async (expenseId) => {
    try {
      setViewingReceipts(expenseId);
      
      // Check if receipts are already cached
      if (!receipts[expenseId]) {
        console.log('Fetching receipts for expense:', expenseId);
        const response = await receiptService.getReceiptsByExpenseId(expenseId);
        console.log('Receipts fetched:', response.data);
        
        setReceipts(prev => ({
          ...prev,
          [expenseId]: response.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
      setError('Failed to load receipts. Please try again.');
    }
  };

  const downloadReceipt = async (filename) => {
    try {
      console.log('Downloading receipt:', filename);
      const response = await receiptService.getReceiptFile(filename);
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download receipt:', error);
      setError('Failed to download receipt. Please try again.');
    }
  };

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    
    try {
      // According to API docs, the request should follow ExpenseCreateRequest format
      const expenseData = {
        employeeId: user.id || user.userId, // Get from JWT token
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        expenseDate: newExpense.expenseDate,
        categoryId: parseInt(newExpense.categoryId)
        // status is set automatically by backend to PENDING
      };
      
      console.log('Creating expense with data:', expenseData);
      const response = await expenseService.createExpense(expenseData);
      
      console.log('Expense created successfully:', response.data);
      
      // If there's a file selected, upload it
      if (selectedFile && response.data && response.data.id) {
        try {
          console.log('Uploading receipt for expense ID:', response.data.id);
          await receiptService.uploadReceipt(selectedFile, response.data.id);
          console.log('Receipt uploaded successfully');
        } catch (uploadError) {
          console.error('Failed to upload receipt:', uploadError);
          setError('Expense created but receipt upload failed. You can upload it later.');
        }
      }
      
      // Reset form and close modal
      setIsModalOpen(false);
      setNewExpense({
        description: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        categoryId: categories.length > 0 ? categories[0].id : 1
      });
      setSelectedFile(null);
      
      // Clear any previous errors
      setError('');
      
      // Refresh the expense list
      fetchExpenses();
      
    } catch (error) {
      console.error('Failed to create expense:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 400) {
          // Handle validation errors - API returns field-specific errors
          if (typeof error.response.data === 'object') {
            const errorMessages = Object.values(error.response.data).join(', ');
            setError(`Validation error: ${errorMessages}`);
          } else {
            setError('Invalid data provided. Please check your input.');
          }
        } else if (error.response.status === 401) {
          setError('Authentication required. Please login again.');
        } else {
          setError(`Server error: ${error.response.status}. Please try again.`);
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {canApprove ? 'All Expenses' : 'My Expenses'}
          </h1>
          {canApprove && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Admin/Manager view - showing all system expenses
            </p>
          )}
        </div>
        
        <div className="flex space-x-3 items-center">
          {canApprove && (
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              Pending: {expenses.filter(e => e.status === 'PENDING').length}
            </div>
          )}
          
          {/* Debug button to test API connectivity */}
          <button
            onClick={async () => {
              const token = localStorage.getItem('userToken');
              console.log('=== API TEST ===');
              console.log('Token exists:', !!token);
              console.log('Token preview:', token?.substring(0, 20) + '...');
              
              try {
                const testResponse = await fetch('http://localhost:8080/api/expenses/my-expenses?page=0&size=5', {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('Test API Status:', testResponse.status);
                console.log('Test API Response:', await testResponse.text());
              } catch (err) {
                console.error('Test API Error:', err);
              }
            }}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
          >
            Test API
          </button>
          
          <button
            onClick={() => {
              // Reset form with proper initial values
              setNewExpense({
                description: '',
                amount: '',
                expenseDate: new Date().toISOString().split('T')[0],
                categoryId: categories.length > 0 ? categories[0].id : 1
              });
              setSelectedFile(null);
              setIsModalOpen(true);
            }}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {expenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">No expenses found</p>
            <p className="text-sm mt-2">Click "New Expense" to add your first expense</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {canApprove && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Employee
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {canApprove && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        Employee ID: {expense.employeeId || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {categories.find(cat => cat.id === expense.categoryId)?.categoryName || `Category ${expense.categoryId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      ${expense.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        expense.status === 'APPROVED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : expense.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {expense.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewReceipts(expense.id)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="View Receipts"
                        >
                          <FileIcon className="h-4 w-4" />
                        </button>
                        
                        {(canApprove || isAdmin) && (
                          <>
                            <button 
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            
                            {canApprove && expense.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleApproval(expense.id, 'approved')}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="Approve"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleApproval(expense.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Reject"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            {isAdmin && (
                              <button 
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Create New Expense
            </h2>
            
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Client lunch, Office supplies"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="expenseDate"
                  value={newExpense.expenseDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={newExpense.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading categories...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Receipt (Optional)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    {selectedFile ? 'Change File' : 'Upload Receipt'}
                  </label>
                  {selectedFile && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported formats: PNG, JPG, JPEG, PDF (max 5MB)
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Receipts Modal */}
      {viewingReceipts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Receipts for Expense #{viewingReceipts}
              </h2>
              <button
                onClick={() => setViewingReceipts(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {receipts[viewingReceipts] && receipts[viewingReceipts].length > 0 ? (
                receipts[viewingReceipts].map((receipt) => (
                  <div key={receipt.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {receipt.fileName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receipt ID: {receipt.id}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadReceipt(receipt.fileName)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Download
                      </button>
                    </div>
                    {receipt.ocrText && (
                      <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">OCR Text:</p>
                        <p className="text-gray-800 dark:text-gray-200">{receipt.ocrText}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No receipts found for this expense</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingReceipts(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;