import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  const EMAIL =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [validemail, setValidemail] = useState(true);
  const [validpassword, setValidpassword] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  // const [user, setUser] = useState("");
  // const errRef = useRef();

  useEffect(() => {
    setValidemail(EMAIL.test(email));
  }, [email]);
  useEffect(() => {
    setValidpassword(PASSWORD.test(password));
  }, [password]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
      setEmail("");
      setPassword("");
    } catch (err) {
      setError('Invalid credentials - please try again');
      // errRef.current.focus();
    }
  };
  // console.log(user)
  const checkSubmit = email && password

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TaskFlow
            <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Streamline your team's productivity
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 p-2 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                {/* Error icon */}
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!checkSubmit}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {/* Lock icon */}
              Sign in
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;