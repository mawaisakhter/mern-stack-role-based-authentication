import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {jwtDecode} from 'jwt-decode';

const Add_User = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User', 
  });

  const [username, setUsername] = useState('');
  const [availability, setAvailability] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.role === 'SuperAdmin') {
          setIsSuperAdmin(true); 
        }
      } catch (error) {
        console.error('Error decoding JWT token', error);
      }
    }
  }, []);

  const checkUsername = async (username) => {
    if (!username) {
      setAvailability(null);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/users/check-username?username=${username}`);
      if (response.data.available) {
        setAvailability("Username is available");
      } else {
        setAvailability("Username is taken");
      }
    } catch (error) {
      setAvailability("Error checking username");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
    setFormData(prev => ({ ...prev, username: value }));
    checkUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (availability === "Username is taken" || availability === "Error checking username") {
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);

    try {
      const response = await axios.post('http://localhost:8000/api/users/register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col items-center pt-6 mt-3">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Add New User</h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input 
                type="text" 
                name="username" 
                id="username" 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                placeholder="Emelia Erickson" 
                value={username} 
                onChange={handleUsernameChange}
                required
              />
              {availability && <p className={availability.includes('taken') ? 'text-red-500' : 'text-green-500'}>{availability}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                placeholder="emelia_erickson24" 
                value={formData.email} 
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                value={formData.password} 
                onChange={handleChange}
                required
              />
            </div>
            {isSuperAdmin && (
              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Role</label>
                <select 
                  name="role" 
                  id="role" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                  value={formData.role} 
                  onChange={handleChange}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
            <button 
              type="submit" 
              className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting || availability === "Username is taken" ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || availability === "Username is taken"}
            >
              {isSubmitting ? 'Submitting...' : 'Create an account'}
            </button>
            <p className="text-sm font-light text-gray-500">Already have an account? <a className="font-medium text-blue-600 hover:underline" href="/signin">Sign in here</a></p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Add_User;
