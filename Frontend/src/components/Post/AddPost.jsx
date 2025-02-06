import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

const AddPost = () => {
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    // image: null,
  });
  const navigate = useNavigate();
  
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); 
      }
    }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSingleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('singleImage', formData.image);
    // console.log(formData.image);
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post('http://localhost:8000/api/posts', data, {
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, 
        },
      });
      // console.log(response.data);
      navigate("/home")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div>
          <Link to="/UserDashboard" className='bg-blue-400 rounded-md hover:bg-blue-500 py-2 px-3'>Back to home</Link>
        </div>
          <form onSubmit={handleSubmit}>
          <h1 className="mt-7 mb-5 text-center text-3xl font-bold">Add New Post</h1>
            <div className='mt-2'>
                <label className="block text-md font-medium leading-5 text-gray-700" >Title:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
              </div>
              <div className='mt-2'>
                <label className='block text-md font-medium leading-5 text-gray-700'>content:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="content" value={formData.content} onChange={handleChange} required />
                </div>
              </div>
              <div className='mt-2'>
                <label className='block text-md font-medium leading-5 text-gray-700'>image:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="file" name="image" onChange={handleSingleImageChange} required />
                </div>
              </div>
              <div className="mt-6 flex flex-row items-center">
                <button type="submit" className="bg-green-500 hover:bg-green-600 mx-auto text-white font-bold py-2 px-4 rounded inline-flex items-center">Add Post</button>
              </div>
          </form>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default AddPost;
