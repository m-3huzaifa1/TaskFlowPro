import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  // console.log(user)
  if (!user || user === undefined || user == {} || user === null)
    router.push('/login');

  return user ? children : null;
};

export default ProtectedRoute;
