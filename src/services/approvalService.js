import api from './api';

const getAllApprovals = (pageable) => {
  console.debug('[ApprovalService] getAllApprovals pageable=', pageable);
  return api.get('/approvals', { params: pageable });
};

const getApprovalById = (id) => {
  console.debug('[ApprovalService] getApprovalById id=', id);
  return api.get(`/approvals/${id}`);
};

const updateApproval = (id, approvalData) => {
  console.debug('[ApprovalService] updateApproval id=', id, 'data=', approvalData);
  return api.put(`/approvals/${id}`, approvalData);
};

const deleteApproval = (id) => {
  console.debug('[ApprovalService] deleteApproval id=', id);
  return api.delete(`/approvals/${id}`);
};

const approveOrReject = (id, actionData) => {
  console.log('[ApprovalService] approveOrReject id=', id, 'actionData=', actionData);
  return api.put(`/approvals/${id}/action`, actionData);
};

const approvalService = {
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval,
  approveOrReject,
};

export default approvalService;