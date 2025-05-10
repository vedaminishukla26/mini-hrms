import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../../api/services';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await employeeService.getAll();
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        
        // Extract unique departments from employee data
        const uniqueDepartments = Array.from(
          new Set(response.data.map(emp => emp.department?.name))
        ).filter(Boolean);
        
        setDepartments(uniqueDepartments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search term and department
    const filtered = employees.filter(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matchesSearch = !searchTerm || 
        fullName.includes(searchTerm.toLowerCase()) || 
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !filterDepartment || 
        employee.department?.name === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });
    
    setFilteredEmployees(filtered);
  }, [searchTerm, filterDepartment, employees]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        setEmployees(employees.filter(emp => emp._id !== id));
        setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== id));
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError('Failed to delete employee');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading employees...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Link 
          to="/employees/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Employee
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, email, or position"
              className="w-full p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              id="department"
              className="w-full p-2 border border-gray-300 rounded"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee List */}
      {filteredEmployees.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Position</th>
                  <th className="py-3 px-6 text-left">Department</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredEmployees.map(employee => (
                  <tr key={employee._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                    </td>
                    <td className="py-3 px-6 text-left">{employee.position}</td>
                    <td className="py-3 px-6 text-left">{employee.department?.name || 'N/A'}</td>
                    <td className="py-3 px-6 text-left">{employee.email}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-4">
                        <Link to={`/employees/${employee._id}`} className="text-blue-500 hover:underline">
                          View
                        </Link>
                        <Link to={`/employees/edit/${employee._id}`} className="text-yellow-500 hover:underline">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(employee._id)} 
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No employees found</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;