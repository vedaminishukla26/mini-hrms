const express = require('express');

const { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} =require( '../controllers/departmentController.js');

const router = express.Router();

// Get all departments
router.get('/', getDepartments);

// Get department by ID
router.get('/:id', getDepartmentById);

// Create new department
router.post('/', createDepartment);

// Update department
router.put('/:id', updateDepartment);

// Delete department
router.delete('/:id', deleteDepartment);

module.exports = router;