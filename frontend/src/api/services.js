import apiClient from './client';

// Employee services
export const employeeService = {
  getAll: () => apiClient.get('/employees'),
  getById: (id) => apiClient.get(`/employees/${id}`),
  create: (data) => apiClient.post('/employees', data),
  update: (id, data) => apiClient.put(`/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/employees/${id}`),
  getByDepartment: (departmentId) => apiClient.get(`/employees/department/${departmentId}`)
};

// Department services
export const departmentService = {
  getAll: () => apiClient.get('/departments'),
  getById: (id) => apiClient.get(`/departments/${id}`),
  create: (data) => apiClient.post('/departments', data),
  update: (id, data) => apiClient.put(`/departments/${id}`, data),
  delete: (id) => apiClient.delete(`/departments/${id}`)
};

