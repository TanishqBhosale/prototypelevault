import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

const MFA = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
          <p className="text-gray-400">
            Enter the 6-digit code sent to your device
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center space-x-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-xl font-semibold text-white bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || code.join('').length !== 6}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-4">
          <button className="text-blue-400 hover:text-blue-500 text-sm font-medium">
            Didn't receive a code? Resend
          </button>
          <div className="flex items-center justify-center text-sm text-gray-400">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <button className="hover:text-gray-300">Back to login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFA;