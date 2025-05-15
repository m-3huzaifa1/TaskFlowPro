import { useAuth } from '../context/AuthContext';
// import { useNavigate } from "react-router";
import api from './api';

export const loginUser = async (email, password) => {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data;
};

export const registerUser = async (userData) => {
  await api.post('/api/auth/register', userData);
};

export const logoutUser = () =>{
    const {setUser} = useAuth();
    // const Navigate = useNavigate()
    const logout = async () => {
        setUser();
        try{
            const response = await api.get('/api/auth/logout', {
                withCredentials: true
            });
            
        }
        catch(error){
            console.log(error);
        }
    }
    return logout;
}
