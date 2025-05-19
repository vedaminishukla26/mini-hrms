import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService, departmentService } from '../api/services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          employeesResponse, 
          departmentsResponse
        ] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll()
        ]);


        setStats({
          totalEmployees: employeesResponse.data.length,
          totalDepartments: departmentsResponse.data.length
        });
        
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Employees</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEmployees}</p>
          <Link to="/employees" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
            View all employees
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Departments</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalDepartments}</p>
          <Link to="/departments" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
            View all departments
          </Link>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/employees/new" className="block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center">
              Add New Employee
            </Link>
            <Link to="/departments/new" className="block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 text-center">
              Add New Department
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;