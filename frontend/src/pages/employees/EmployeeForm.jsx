import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService, departmentService } from '../../api/services';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joiningDate: '',
    salary: '',
    isActive: true,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAll();
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      }
    };

    fetchDepartments();
    
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          const response = await employeeService.getById(id);
          const employeeData = response.data;
          
          // Format date for input field (YYYY-MM-DD)
          const joiningDate = employeeData.joiningDate ? 
            new Date(employeeData.joiningDate).toISOString().split('T')[0] : '';
          
          setFormData({
            ...employeeData,
            department: employeeData.department?._id || '',
            joiningDate,
            // Ensure address object exists
            address: employeeData.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            }
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching employee:', err);
          setError('Failed to load employee data');
          setLoading(false);
        }
      };
      
      fetchEmployee();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (address)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      
      // Clean empty address fields
      const submissionData = {
        ...formData,
        address: Object.entries(formData.address).reduce((acc, [key, value]) => {
          if (value && value.trim() !== '') {
            acc[key] = value;
          }
          return acc;
        }, {})
      };
      
      if (isEditMode) {
        await employeeService.update(id, submissionData);
        setSuccess('Employee updated successfully');
      } else {
        await employeeService.create(submissionData);
        setSuccess('Employee created successfully');
        // Reset form after successful creation
        if (!isEditMode) {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            joiningDate: '',
            salary: '',
            isActive: true,
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            }
          });
        }
      }
      
      // Navigate back to employee list after a short delay
      setTimeout(() => {
        navigate('/employees');
      }, 1000);
      
      setLoading(false);
    } catch (err) {
      console.error('Error saving employee:', err);
      setError(err.response?.data?.message || 'Failed to save employee');
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="flex justify-center items-center h-64">Loading employee data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Employment Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Employment Information</h2>
            
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                id="department"
                name="department"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <input
                type="text"
                id="position"
                name="position"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
              <input
                type="number"
                id="salary"
                name="salary"
                required
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active Employee</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Address */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Address</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                id="street"
                name="address.street"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="address.city"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.address.city}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
              <input
                type="text"
                id="state"
                name="address.state"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="address.zipCode"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="address.country"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.address.country}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;