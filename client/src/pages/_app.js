import "@/styles/globals.css";
import { AuthProvider } from '../context/AuthContext';
import { registerSW } from '../utils/registerSW';
import { useEffect } from "react";

export default function App({ Component, pageProps }) { 
  useEffect(() => {
    registerSW();
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
