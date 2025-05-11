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

router.get('/', getEmployees);

router.get('/:id', getEmployeeById);

router.post('/', createEmployee);

router.put('/:id', updateEmployee);

router.delete('/:id', deleteEmployee);

router.get('/department/:departmentId', getEmployeesByDepartment);

module.exports = router;