import api from './api';

const getAllDepartments = (pageable) => {
  console.debug('[DepartmentService] getAllDepartments pageable=', pageable);
  return api.get('/departments', { params: pageable });
};

const getDepartmentById = (id) => {
  console.debug('[DepartmentService] getDepartmentById id=', id);
  return api.get(`/departments/${id}`);
};

const createDepartment = (departmentData) => {
  console.debug('[DepartmentService] createDepartment data=', departmentData);
  return api.post('/departments/post', departmentData);
};

const updateDepartment = (id, departmentData) => {
  console.debug('[DepartmentService] updateDepartment id=', id, 'data=', departmentData);
  return api.put(`/departments/${id}`, departmentData);
};

const deleteDepartment = (id) => {
  console.debug('[DepartmentService] deleteDepartment id=', id);
  return api.delete(`/departments/${id}`);
};

const departmentService = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default departmentService;