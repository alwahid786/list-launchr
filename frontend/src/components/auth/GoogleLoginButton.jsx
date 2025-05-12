import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  
  useEffect(() => {
    // Load the Google API script
    const loadGoogleScript = () => {
      // Check if script already exists
      if (document.querySelector('script#google-login')) {
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'google-login';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        initializeGoogleButton();
      };
    };
    
    // Initialize Google One Tap Button
    const initializeGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;
      
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      });
      
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: '100%',
      });
    };
    
    loadGoogleScript();
    
    return () => {
      // Clean up
      const script = document.querySelector('script#google-login');
      if (script) {
        document.body.removeChild(script);
      }
      
      // Cancel any Google prompt
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);
  
  // Handle the Google response
  const handleGoogleResponse = async (response) => {
    try {
      const { credential } = response;
      
      // Send the token to our backend
      await googleLogin(credential);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-center my-4">
        <div className="border-t border-gray-300 flex-grow"></div>
        <div className="mx-4 text-sm text-gray-500">OR</div>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>
      <div ref={googleButtonRef} className="w-full flex justify-center"></div>
    </div>
  );
};

export default GoogleLoginButton;