import api from './api';

const getAllAuditLogs = (pageable) => {
  console.debug('[AuditLogService] getAllAuditLogs pageable=', pageable);
  return api.get('/audit-logs', { params: pageable });
};

const getAuditLogById = (id) => {
  console.debug('[AuditLogService] getAuditLogById id=', id);
  return api.get(`/audit-logs/${id}`);
};

const createAuditLog = (logData) => {
  console.debug('[AuditLogService] createAuditLog data=', logData);
  return api.post('/audit-logs/post', logData);
};

const updateAuditLog = (id, logData) => {
  console.debug('[AuditLogService] updateAuditLog id=', id, 'data=', logData);
  return api.put(`/audit-logs/${id}`, logData);
};

const deleteAuditLog = (id) => {
  console.debug('[AuditLogService] deleteAuditLog id=', id);
  return api.delete(`/audit-logs/${id}`);
};

const auditLogService = {
  getAllAuditLogs,
  getAuditLogById,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog,
};

export default auditLogService;