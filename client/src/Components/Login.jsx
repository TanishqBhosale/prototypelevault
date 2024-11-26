import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import MouseTracker from './Mouse'; // Ensure you have this component
import KeyStrokeTracker from './key'; // Ensure you have this component
import { auth } from "../Auth/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mousePath: [],
    keystrokes: [],
  });
  const nav = useNavigate();
  const [error, setError] = useState(null);
  const [stopTracking, setStopTracking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if username and password are provided
    if (!formData.username || !formData.password) {
      setError("Both username and password are required");
      return;
    }
  
    try {
      setError(null);
  
      // Step 1: Call the prediction API with form data
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch prediction. Please try again.');
      }
  
      const prediction = await response.json();
      console.log("Prediction response:", prediction);  // Log the prediction response for debugging
  
      // Step 2: Handle the prediction result
      if (prediction.label === 0) {
        // If prediction indicates potential anomaly, navigate to MFA
        setError("Suspicious activity detected. Please verify your identity.");
        nav('/mfa'); // Navigate to MFA page
        return; // Ensure login process stops here
      } else {
        // If prediction is true, proceed with login
  
        // Step 3: Verify the password with Firebase Authentication
        await signInWithEmailAndPassword(auth, formData.username, formData.password);
        console.log("Password verification successful");
  
        // Step 4: Allow login if prediction is positive
        console.log("Prediction positive, allowing login");
        setStopTracking(true); // Stop any tracking components
        nav('/'); // Navigate to the home page
      }
    } catch (error) {
      console.error("Error during login or prediction:", error);
      setError("An error occurred. Please try again.");
    }
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

  const handlePaste = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="relative w-full max-w-md p-8 mx-4">
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="space-y-4">
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
            </div>
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
              Sign In
            </button>
            <div className="text-center text-gray-400">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign up
              </a>
            </div>
          </form>

          <MouseTracker onPathUpdate={handleMousePathUpdate} stopTracking={stopTracking} />
          <KeyStrokeTracker onKeystrokeUpdate={handleKeystrokeUpdate} />
        </div>
      </div>
      </div>
      )
      }

      export default Login;