import { useLoginMutation } from '../../features/api/adminAuth/AdminAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const AdminLogin = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Regex patterns for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = {
      adminEmail: formData.get('email'),
      password: formData.get('password'),
    };

    if (!emailRegex.test(values.adminEmail)) {
      toast.error('Invalid email format.');
      return;
    }

    if (!passwordRegex.test(values.password)) {
      toast.error('Password must be at least 8 characters long, contain at least one letter, one number, and one special character.');
      return;
    }

    try {
      const response = await login(values).unwrap();
      toast.success('Login successful.');

      localStorage.setItem('adminId', JSON.stringify(response?._id));
      localStorage.setItem('adminToken', JSON.stringify(response?.token));
      localStorage.setItem('adminName', JSON.stringify(response?.name));

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://media.licdn.com/dms/image/v2/D560BAQHY67lmgwmhXw/company-logo_200_200/company-logo_200_200/0/1709031437058/nearpay_innovations_logo?e=1738195200&v=beta&t=9Zy86pLo2cWly_wLCwvS96QF1a8FaK2la7JIx4sfLg8"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"} {/* Change to an icon if you prefer */}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

         
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
