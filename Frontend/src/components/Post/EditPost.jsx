import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    singleImage: null,
  });

  const { id } = useParams();
// console.log(id);
  const [singleImagePreview, setSingleImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, singleImage: file });
    setSingleImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    // data.append('_method', 'PUT');
    if (formData.singleImage) {
      data.append('singleImage', formData.singleImage);
    } else {
      data.append('existingImage', existingImage); 
    }
    try {
      const token = localStorage.getItem('token');
      // console.log(id);
      const response = await axios.put(`http://localhost:8000/api/posts/${id}`, data, {
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      // console.log('User updated:', response.data);
    } catch (error) {
      console.error('There was an error updating the user!', error);
    }
  };

  useEffect(() => {
    fetchForms(id);
  }, []);

  const fetchForms = async (id) => {
    // console.log(id);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/posts/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`,
        },
      });
      const jData = response.data;
      // console.log(jData);
      setFormData(jData);
      if (jData.singleImage) {
        setExistingImage(jData.singleImage);
        setSingleImagePreview(`http://localhost:8000/${jData.singleImage}`); 
      }
      console.log(singleImagePreview);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <Link to="/UserDashboard" className='bg-blue-400 rounded-md hover:bg-blue-500 py-2 px-3'>Back to home</Link>
          </div>
          <form onSubmit={handleSubmit}>
            <h1 className="text-center text-2xl font-bold">Edit Post</h1>
            <div className='mt-2'>
              <label className="block text-md font-medium leading-5 text-gray-700">Title:</label>
              <div className="mt-1 rounded-md shadow-sm">
                <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
            </div>
            <div className='mt-2'>
              <label className='block text-md font-medium leading-5 text-gray-700'>Description:</label>
              <div className="mt-1 rounded-md shadow-sm">
                <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="content" value={formData.content} onChange={handleChange} required />
              </div>
            </div>
            <div className='mt-2'>
              <label className='block text-md font-medium leading-5 text-gray-700'>Single Image:</label>
              <div className="mt-1 rounded-md shadow-sm">
                <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="file" name="singleImage"  onChange={handleSingleImageChange} />
              </div>
              <div>
                  {singleImagePreview && <img src={singleImagePreview} alt="Single Image Preview" width="100" />}
              </div>
            </div>
            <div className="mt-6 flex flex-row items-center">
              <button type="submit" className="bg-green-500 hover:bg-green-600 mx-auto text-white font-bold py-2 px-4 rounded inline-flex items-center">Update Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
