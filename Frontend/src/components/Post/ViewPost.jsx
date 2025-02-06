import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [forms, setForms] = useState({});
  const { id } = useParams();

  // console.log(id);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      // console.log(token);
      const response = await axios.get(`http://localhost:8000/api/posts/${id}`,{
        headers:{
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

  return (
    <div className="container w-4/5 mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div>
          <Link to="/UserDashboard" className="bg-blue-400 rounded-md hover:bg-blue-500 py-2 px-3">Back to home</Link>
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-gray-800 text-center">User Information</h3>
          <h2 className="text-2xl text-gray-800"><strong>Title: </strong>{forms.title}</h2>
          <p className="text-gray-600"><strong>Content: </strong>{forms.content}</p>
          <p className="text-gray-600 mt-5"><strong>Main Image:</strong>
            <img className="h-44 w-48 object-cover rounded-t-xl" src={`http://localhost:8000/${forms.singleImage}`}  alt="image" />
          </p>
        </div>
        <div className="text-center">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
