import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';


const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!fullName) {
      setError('Please enter your name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter the password');
      return;
    }

    let profileImageUrl = '';
    try {
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }

      // Call Register API
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profilePic: profileImageUrl, // ✅ include image URL
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-sm text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              required
            />
            <div className="col-span-2">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                placeholder="Enter your password"
                type="password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded mt-4 btn-primary"
          >
            SIGN UP
          </button>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

          <p className="font-medium text-primary underline mt-3">
            <Link className="text-primary" to="/login">
              Already have an Account? Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;