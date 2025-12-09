import { useState, useEffect } from "react";
import { LoginView } from "./login/LoginView";
import { RegisterView } from "./register/RegisterView";
import { X } from "@phosphor-icons/react";
import { useAppSelector } from "../../app/hook"; // 🎯 Import useAppSelector

interface AuthModalProps {
  onClose: () => void; // function prop to close the modal
}

const Auth: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false); // toggle between login & register
  const toggleView = () => setIsRegister(!isRegister);

  // 1. Listen to Redux state for successful operations
  // We check the 'redirectTo' field, as that is set only upon successful login/register
  const loginRedirectTo = useAppSelector((state) => state.login.redirectTo);
  const registerRedirectTo = useAppSelector((state) => state.register.redirectTo);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // 2. CRITICAL: Effect to close the modal after successful login or registration
  useEffect(() => {
    // If either authentication flow sets a dynamic redirect path, close the modal.
    if (loginRedirectTo || registerRedirectTo) {
      onClose();
    }
    // Dependency array ensures this runs only when the redirect path changes
  }, [loginRedirectTo, registerRedirectTo, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)] min-h-screen">
      <div className="relative w-full max-w-4xl mx-auto h-[500px] bg-transparent rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 bg-gray-500 rounded-full p-1 text-white hover:bg-gray-800 hover:text-white transition"
        >
          <X size={20} />
        </button>
        <div
          className={`relative max-w-7xl h-[500px] rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-white transition-all duration-700 ${isRegister ? "alt-active" : ""}`}
        >
          {/* LEFT — Login Form */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-white flex flex-col justify-center items-center transition-transform duration-700 ${isRegister ? "translate-x-full" : "translate-x-0"}`}
          >
            <LoginView />
          </div>

          {/* RIGHT — Register Form */}
          <div
            className={`absolute top-0 right-0 h-full w-1/2 bg-white flex flex-col justify-center items-center transition-transform duration-700 ${isRegister ? "translate-x-0" : "translate-x-full"}`}
          >
            <RegisterView />
          </div>

          {/* OVERLAY AREA */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full flex flex-col justify-center items-center text-white bg-gradient-to-br from-indigo-600 to-rose-600 transition-transform duration-700 z-10 ${isRegister ? "-translate-x-full" : "translate-x-0"}`}
          >
            <h1 className="text-3xl font-bold mb-4">
              {isRegister ? "Welcome Back!" : "Hello, New User!"}
            </h1>

            <p className="w-3/4 text-center mb-6">
              {isRegister
                ? "Already have an account? Login now!"
                : "Join us today! Switch to register form."}
            </p>

            <button
              onClick={toggleView}
              className="px-6 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-700 transition"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;