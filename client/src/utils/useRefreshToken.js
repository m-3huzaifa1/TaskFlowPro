import api from './api';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { useRef } from 'react';

const useRefreshToken = () => {
    const { user, setUser } = useAuth();
    // let socket = useRef();
    /*const socket = io.connect('http://localhost:8080',{
        transports: ['websocket']
     })*/

    const refresh = async () => {
        const response = await api.get('/api/refresh', {
            withCredentials: true
        });
        console.log(response?.data);

        // socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_URL);

        // socket.on("connect_error", (err) => {
        //     console.log(`connect_error due to ${err.message}`);
        // });

        setUser(prev => {
            console.log(prev);
            // console.log(response?.data?.accessToken);
            // if (prev?.socket) {
                return {
                    ...prev,
                    accessToken: response?.data?.accessToken,
                    foundUser: response?.data?.foundUser,
                }
            // }
            // else {
            //     return {
            //         ...prev,
            //         accessToken: response?.data?.accessToken,
            //         foundUser: response?.data?.foundUser,
            //         socket
            //     }
            // }

        });
        console.log(user);
        return response?.data?.accessToken;
    }
    return refresh;
};

export default useRefreshToken;

/*export const useRefreshCandidates = () => {
    const { auth,setAuth } = useAuth();
    let socket = useRef();

    const refresh = async () => {
        const response = await axios.get('/api/refresh/candidate', {
            withCredentials: true
        });
        console.log(response?.data);

        socket = io(BASE_URL,{path: '/api/socket.io'});

        setAuth(prev => {
            console.log(prev);
            // console.log(JSON.stringify(response.data));
            console.log(response.data.accessToken);
            if(prev?.socket){
                return { 
                    ...prev, 
                    role: response?.data?.role,
                    accessToken: response?.data?.accessToken,
                    foundUser: response?.data?.foundUser,
                    candidate: response?.data?.candidate ? response?.data?.candidate : null,
                    
                }
            }else{
                return { 
                    ...prev, 
                    role: response?.data?.role,
                    accessToken: response?.data?.accessToken,
                    foundUser: response?.data?.foundUser,
                    candidate: response?.data?.candidate ? response?.data?.candidate : null,
                    socket
                    
                }
            }
        });
        // console.log(auth);
        return response.data.accessToken;
    }
    return refresh;
}*/