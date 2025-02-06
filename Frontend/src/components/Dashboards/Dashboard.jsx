import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role); 
    }
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login...');
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('http://localhost:8000/api/users', {
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

  const updateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login...');
        window.location.href = '/login';
        return;
      }
      const response = await axios.put(`http://localhost:8000/api/users/${userId}/role`, 
        { role: newRole }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log(`Role updated successfully for ${userId}`);
      
      // Update the role in the state immediately
      setForms((prevForms) =>
        prevForms.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating role:', error.response?.data || error.message);
    }
  };

  const delUser = async (UserId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:8000/api/users/${UserId}`,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setForms((prevUsers) => prevUsers.filter((user) => user._id !== UserId));
      } catch (error) {
        console.error('Error deleting user:', error.response?.data || error.message);
      }
    }else {
      console.log('User deletion cancelled');
    }
    
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <>
      <div className='p-20'>
        <div className='flex flex-row justify-between w-full'>
          <div>
            <Link to="/Adduser" className='bg-green-400 rounded-sm hover:bg-green-500 py-2 px-4'>Add New User</Link>
          </div>
          <div>
            <Link to="/Posts" className='bg-lime-300 rounded-sm hover:bg-green-500 py-2 px-4'>Posts</Link>
          </div>
          <div>
            <button className='bg-blue-400 rounded-sm hover:bg-green-500 py-2 px-4' onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light text-surface">
                <thead className="border-b border-neutral-200 font-medium">
                  <tr>
                    <th scope="col" className="px-6 py-4">#</th>
                    <th scope="col" className="px-6 py-4">Username</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Role</th>
                    <th scope="col" className="px-6 py-4">Created</th>
                    <th scope="col" className="px-6 py-4">Updated</th>
                    <th scope="col" className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    forms.map((user, index) => (
                      <tr className="border-b border-neutral-200" key={user._id}>
                        <th className="px-6 py-4">{index + 1}</th>
                        <td className="px-6 py-4 font-medium">{user.username}</td>
                        <td className="px-6 py-4 font-medium">{user.email}</td>
                        <td className="px-6 py-4 font-medium">
                          {
                            userRole === 'SuperAdmin' ? (
                              <select
                                defaultValue={user.role}
                                className="border rounded px-2 py-1"
                                onChange={(e) => updateRole(user._id, e.target.value)} 
                              >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="SuperAdmin">SuperAdmin</option>
                              </select>
                            ) : (
                              user.role
                            )
                          }
                        </td>
                        <td className="px-6 py-4 font-medium">{formatDate(user.createdAt)}</td>
                        <td className="px-6 py-4 font-medium">{formatDate(user.updatedAt)}</td>
                        <td className="px-6 py-4">
                          <Link to={'/view_user/' + user._id} className="bg-green-500 hover:bg-blue-600 mx-auto text-white font-bold py-2 px-6 rounded inline-flex items-center">View</Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/Edituser/${user._id}`} className="bg-blue-500 hover:bg-blue-600 mx-auto text-white font-bold py-2 px-6 rounded inline-flex items-center">Edit</Link>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => delUser(user._id)} className="bg-red-500 hover:bg-red-600 mx-auto text-white font-bold py-2 px-6 rounded inline-flex items-center">Delete</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
