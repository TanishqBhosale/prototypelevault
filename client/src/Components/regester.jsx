import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MouseTracker from './Mouse'; // Ensure you have this component
import KeyStrokeTracker from './key'; // Ensure you have this component
import { Lock, Mail, User, MapPin, Home, Hash } from 'lucide-react';
import axios from 'axios';
import { auth } from "../Auth/Firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
    zipCode: '',
    location: { lat: null, lon: null },
    mousePath: [],
    keystrokes: [],
  });

  const [stopTracking, setStopTracking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMousePathUpdate = (path) => {
    setFormData((prevData) => ({
      ...prevData,
      mousePath: path,
    }));
  };

  const handleKeystrokeUpdate = (keystrokeData) => {
    setFormData((prevData) => ({
      ...prevData,
      keystrokes: keystrokeData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    setStopTracking(true);
  
    const { email, password, confirmPassword, name } = formData;
  
    // Validation
    if (!email || !password || !name) {
      alert('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      
  
      // await axios.post('/your-backend-endpoint', {
      //   ...formData,
      //   uid: user.uid,
      // });
  
      console.log('User registered successfully:', user);
  
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Error saving data:', error.message || error.response?.data);
      alert('Registration failed. Please try again.');
    }
  };
  

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          }));
          console.log('Current Location:', position.coords);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent pasting
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="relative w-full max-w-md p-8 mx-4">
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input fields with icons */}
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  autocomplete="off"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full py-3 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-400 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Get Current Location
              </button>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Mouse and Keystroke Trackers */}
          <MouseTracker onPathUpdate={handleMousePathUpdate} stopTracking={stopTracking} />
          <KeyStrokeTracker onKeystrokeUpdate={handleKeystrokeUpdate} />
        </div>
      </div>
    </div>
  );
};

export default Register;
