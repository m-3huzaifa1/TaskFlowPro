import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null)
  // api.interceptors.response.use(
  //   response => response,
  //   async error => {
  //     const prevRequest = error?.config;
  //     if (error?.response?.status === 401 && !prevRequest?.sent) {
  //       prevRequest.sent = true;
  //       const { data } = await axios.get('/api/auth/refresh', {
  //         withCredentials: true
  //       });
  //       console.log(data)
  //       prevRequest.headers['Authorization'] = `Bearer ${data?.accessToken}`;
  //       return axios(prevRequest);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  const login = async (email, password) => {
    await api.post('/api/auth/login', { email, password })
      .then(res => {
        console.log(JSON.stringify(res))
        setUser(res?.data?.user)
      })
      .catch(err => {
        console.log(err)
        if (!err?.response) {
          alert("No Server Response");
        } else if (err.response?.status === 400) {
          alert("Missing Username or Password");
        } else if (err.response?.status === 401) {
          alert("Unauthorized");
        } else {
          alert("Login Failed");
        }
      })

  };

  const register = async (userData) => {
    await api.post('/api/auth/register', userData)
      .then(res => {
        console.log(JSON.stringify(res))
        alert('Registered Successfully!')
      })
      .catch(err => {
        console.log(err)
        alert('Error: Registration Failed!')
      })
  };

  const logout = async () => {
    setUser(null);
    try {
      const response = await api.get('/api/auth/logout', {
        withCredentials: true
      });

    }
    catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await api.get('/api/auth/me');
  //       setUser(res.data.user);
  //     } catch (err) {
  //       setUser(null);
  //     }
  //   };
  //   checkAuth();
  // }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;