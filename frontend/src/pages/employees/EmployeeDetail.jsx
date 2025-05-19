import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeService } from '../../api/services';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Fetch employee and their leave requests in parallel
        const [employeeResponse, leaveRequestsResponse] = await Promise.all([
          employeeService.getById(id),
         
        ]);
        
        setEmployee(employeeResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee data');
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        navigate('/employees');
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError('Failed to delete employee');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading employee data...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  if (!employee) {
    return <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">Employee not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <div className="space-x-4">
          <Link
            to={`/employees/edit/${id}`}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{employee.phone || 'Not specified'}</p>
                </div>
                {employee.address && Object.values(employee.address).some(val => val) && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {[
                        employee.address.street,
                        employee.address.city,
                        employee.address.state,
                        employee.address.zipCode,
                        employee.address.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Employment Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{employee.department?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>               
    </div>
  );
};

export default EmployeeDetail;