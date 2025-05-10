const express = require('express');

const { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  getEmployeesByDepartment
} = require( '../controllers/employeeController.js');

const router = express.Router();

// Get all employees
router.get('/', getEmployees);

// Get employee by ID
router.get('/:id', getEmployeeById);

// Create new employee
router.post('/', createEmployee);

// Update employee
router.put('/:id', updateEmployee);

// Delete employee
router.delete('/:id', deleteEmployee);

// Get employees by department
router.get('/department/:departmentId', getEmployeesByDepartment);

module.exports = router;