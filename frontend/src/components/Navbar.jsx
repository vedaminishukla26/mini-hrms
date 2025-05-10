import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="font-bold text-xl">
            <Link to="/">HRMS</Link>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={`hover:text-blue-200 ${isActive('/') && location.pathname === '/' ? 'font-semibold' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/employees" 
              className={`hover:text-blue-200 ${isActive('/employees') ? 'font-semibold' : ''}`}
            >
              Employees
            </Link>
            <Link 
              to="/departments" 
              className={`hover:text-blue-200 ${isActive('/departments') ? 'font-semibold' : ''}`}
            >
              Departments
            </Link>
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;