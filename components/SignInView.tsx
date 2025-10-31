
import React, { useState } from 'react';
import { ArrowLeftIcon } from './Icons';

interface SignInViewProps {
  onBack: () => void;
}

const SignInView: React.FC<SignInViewProps> = ({ onBack }) => {
  const [studentId, setStudentId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.length === 10 && /^\d+$/.test(studentId)) {
      setSubmitted(true);
    } else {
      alert('Please enter a valid 10-digit student ID.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        {submitted ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
            <p className="text-gray-700">You can now proceed.</p>
            <button
              onClick={onBack}
              className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  maxLength={10}
                  placeholder="Enter your 10-digit ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Sign In
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInView;
