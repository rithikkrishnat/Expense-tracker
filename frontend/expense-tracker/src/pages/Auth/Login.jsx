import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if(!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //Login API CALL
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token , user } = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. PLease try again");
      }
    }
  }
 

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">WELCOME BACK</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded mt-4 btn-primary"
          >
            Log In
          </button>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          <p className="font-medium text-primary underline mt-3">
            {' '}
            <Link className="text-primary" to="/signup">
              Don't have an account?Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
