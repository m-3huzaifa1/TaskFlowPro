import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });
  const { register } = useAuth();
  const router = useRouter();

  const EMAIL =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [validemail, setValidemail] = useState(true);
  const [validpassword, setValidpassword] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setValidemail(EMAIL.test(userData?.email));
  }, [userData?.email]);
  useEffect(() => {
    setValidpassword(PASSWORD.test(userData?.password));
  }, [userData?.password]);

  useEffect(() => {
    setErrMsg("");
  }, [userData?.email, userData?.password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(userData);
      router.push('/login');
      setUserData({
        name: '',
        email: '',
        password: '',
        role:'User'
      })
      console.log("submitted candidate");
    }
    catch (err) {
      console.log(err)
      alert('Server Error')
    };
  }
  const checkSubmit = userData?.name && userData?.email && userData?.password

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TaskFlow
            <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Create your team management account
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="John Doe"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="name@company.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!checkSubmit}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Create Account
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 cursor-pointer hover:text-blue-700 font-medium"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;