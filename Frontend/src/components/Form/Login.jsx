import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8000/api/users/login', formData);
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token); 
      localStorage.setItem('role', data.user.role); 
      localStorage.setItem('username', data.user.username);
      // console.log(username);
      // Redirect based on user role
      if (data.user.role === 'super-admin' || data.user.role === 'admin') {
        window.location.href = '/Dashboard'; // Redirect to admin dashboard
      } else {
        window.location.href = '/UserDashboard'; // Redirect to user dashboard
      }
      
    } catch ({ response }) {
      console.error('Login failed:', response.data);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center pt-6 mt-16">
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Login Here</h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input type="email" name="email" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="abc@gmail.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" value={formData.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login</button>
            </form>
            {error && <div className="text-red-600 mt-2">{error}</div>} 
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
