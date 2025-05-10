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

// Leave request services
export const leaveRequestService = {
  getAll: () => apiClient.get('/leave-requests'),
  getById: (id) => apiClient.get(`/leave-requests/${id}`),
  create: (data) => apiClient.post('/leave-requests', data),
  update: (id, data) => apiClient.put(`/leave-requests/${id}`, data),
  delete: (id) => apiClient.delete(`/leave-requests/${id}`),
  getByEmployee: (employeeId) => apiClient.get(`/leave-requests/employee/${employeeId}`)
};