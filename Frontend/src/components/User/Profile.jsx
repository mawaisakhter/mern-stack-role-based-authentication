import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Profile = () => {
  const [forms, setForms] = useState({});
  const [userRole, setUserRole] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); 
      }
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      const jData = response.data;
      setForms(jData);
      // console.log(jData);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

//   const imageUrl = forms.image ? `http://localhost:8000/uploads/${forms.image}` : '';
// console.log(imageUrl);
  return (
    <div className="container w-4/5 mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div>
          <Link to="/" className="bg-blue-400 rounded-md hover:bg-blue-500 py-2 px-3">Back to home</Link>
        </div>

        <div>
          <h3 className="text-3xl font-semibold text-gray-800 text-center">User Information</h3>
          <h2 className="text-2xl text-gray-800"><strong>User name: </strong>{forms.username}</h2>
          <p className="text-gray-600 mt-5"><strong>User email: </strong>{forms.email}</p>
          {/* <div className="text-center">
            {imageUrl && <img className="h-44 w-48 object-cover rounded-t-xl" src={imageUrl} alt="Post Image" />}
          </div> */}
        </div>

        <div className="text-center">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
