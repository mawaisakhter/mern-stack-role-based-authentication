import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';

const UserDashboard = () => {
    const [forms, setForms] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
      fetchForms();
      const name = localStorage.getItem('username'); 
      
      if (name) {
        setUserName(name); 
      }
    }, []);
  
  
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log(token);
        if (!token) {
          console.warn('No token found. Redirecting to login...');
          window.location.href = '/User/login';
          return;
        }
        const response = await axios.get('http://localhost:8000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });        
        const jData = response.data; 
        setForms(jData);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      }
    };

    const delPost = async (PostId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (confirmDelete) {
        // console.log(PostId);
        try {
          const token = localStorage.getItem('token');
          // console.log(token);
          const response = await axios.delete(`http://localhost:8000/api/posts/${PostId}`,{
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          setForms((prevPosts) => prevPosts.filter((post) => post._id !== PostId));
        } catch (error) {
          console.error('Error deleting post:', error.response?.data || error.message);
        }
      }else {
        console.log('Post deletion cancelled');
      }
    };
    
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found. Redirecting to login...');
          window.location.href = '/User/login'; 
          return;
        }
  
        console.log('Attempting to log out with token:', token);
        // localStorage.removeItem('token');
        await axios.post(
          'http://localhost:8000/api/users/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
    
        console.log('Logout successful. Clearing token...');
        localStorage.removeItem('token'); 
        localStorage.removeItem('username')
        window.location.href = '/User/login';
      } catch (error) {
        console.error('Logout failed:', error.response || error.message);
        if (error.response?.status === 401) {
          console.log('Token invalid or expired. Clearing token...');
          localStorage.removeItem('token'); 
          window.location.href = '/User/login';
        }
      }
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString(); 
    };
  
    return (
      <>
        <div className='p-20'>
        <h1>Welcome, {userName || 'User'}</h1>
        <div className='flex flex-row justify-between w-full'>
          <Link to="/AddPost" className='bg-green-400 rounded-sm hover:bg-green-500 py-2 px-4'>Create New Post</Link>
          <Link to="/Products" className='bg-blue-400 rounded-sm hover:bg-blue-500 py-2 px-4'>Products</Link>
          <button className='ms=60 bg-red-400 rounded-sm hover:bg-red-500 py-2 px-4' onClick={handleLogout}>Logout</button>
        </div>
          <div>
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light text-surface">
                    <thead className="border-b border-neutral-200 font-medium ">
                      <tr>
                        <th scope="col" className="px-6 py-4">#</th>
                        <th scope="col" className="px-6 py-4">Title</th>
                        <th scope="col" className="px-6 py-4">Content</th>
                        <th scope="col" className="px-6 py-4">Image</th>
                        <th scope="col" className="px-6 py-4">Created</th>
                        {/* <th scope="col" className="px-6 py-4">Updated</th> */}
                        <th scope="col" className="px-6 py-4">Action</th>
                        <th scope="col" className="px-6 py-4">Action</th>
                        <th scope="col" className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        forms.map((post, index) => {
                          return(
                            <tr className="border-b border-neutral-200" key={post._id}>
                              <th className="px-6 py-4">{index + 1}</th>
                              <td className="px-6 py-4 font-medium">{post.title}</td>
                              <td className="px-6 py-4 font-medium">{post.content}</td>
                              <td className="px-6 py-4">
                                <img src={`http://localhost:8000/${post.singleImage}`} className='w-20 h-16' alt="" />
                              </td>
                              <td className="px-6 py-4 font-medium">{formatDate(post.createdAt)}</td> 
                              {/* <td className="px-6 py-4 font-medium">{formatDate(post.updatedAt)}</td>  */}
                              <td className="px-6 py-4">
                                <Link to={`/ViewPost/` + post._id}  className="bg-blue-500 hover:bg-blue-600 mx-auto text-white font-bold py-2 px-6 rounded inline-flex items-center">View</Link>
                              </td>
                              <td className="px-6 py-4">
                                <Link to={`/EditPost/` + post._id} className="bg-blue-500 hover:bg-blue-600 mx-auto text-white font-bold py-2 px-6 rounded inline-flex items-center">Edit</Link>
                              </td>
                              <td className="px-6 py-4">
                                <button onClick={() => delPost(post._id)} className="bg-red-500 hover:bg-red-600 mx-auto text-white font-bold py-2 px-6 rounded inline-flex items-center">Delete</button>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
export default UserDashboard;