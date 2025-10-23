import api from './api';

const uploadReceipt = (file, expenseId) => {
  console.debug('[ReceiptService] uploadReceipt expenseId=', expenseId);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expenseId', expenseId);
  return api.post('/receipts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

const getReceiptFile = (filename) => {
  console.debug('[ReceiptService] getReceiptFile filename=', filename);
  return api.get(`/receipts/files/${filename}`, { responseType: 'blob' });
};

const getAllReceipts = (pageable) => {
  console.debug('[ReceiptService] getAllReceipts pageable=', pageable);
  return api.get('/receipts', { params: pageable });
};

const getReceiptById = (id) => {
  console.debug('[ReceiptService] getReceiptById id=', id);
  return api.get(`/receipts/${id}`);
};

const updateReceipt = (id, receiptData) => {
  console.debug('[ReceiptService] updateReceipt id=', id, 'data=', receiptData);
  return api.put(`/receipts/${id}`, receiptData);
};

const deleteReceipt = (id) => {
  console.debug('[ReceiptService] deleteReceipt id=', id);
  return api.delete(`/receipts/${id}`);
};

const getReceiptsByExpenseId = (expenseId) => {
  console.debug('[ReceiptService] getReceiptsByExpenseId expenseId=', expenseId);
  return api.get(`/receipts/expense/${expenseId}`);
};

const receiptService = {
  uploadReceipt,
  getReceiptFile,
  getAllReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getReceiptsByExpenseId,
};

export default receiptService;