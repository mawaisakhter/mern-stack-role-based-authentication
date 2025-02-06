import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productname: '',
    productcontent:'',
    productprice:'',
    multipleimages: [],
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleMultipleImagesChange = (e) => {
    setFormData({ ...formData, multipleimages: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('productname', formData.productname);
    data.append('productcontent', formData.productcontent);
    data.append('productprice', formData.productprice);
    for (let i = 0; i < formData.multipleimages.length; i++) {
      data.append('multipleimages', formData.multipleimages[i]);
    }
    // console.log(data);
    try {
        const token = localStorage.getItem('token');
        // console.log(token);
        // console.log(data);
        const response = await axios.post('http://localhost:8000/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, 
        },
      });
      console.log(response.data);
      navigate("/Products")
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
          <Link to="/" className='bg-blue-400 rounded-md hover:bg-blue-500 py-2 px-3'>Back to home</Link>
        </div>
          <form onSubmit={handleSubmit}>
          <h1 className="mt-7 mb-5 text-center text-3xl font-bold">Add New Product</h1>
            <div className='mt-2'>
                <label className="block text-md font-medium leading-5 text-gray-700" > Product Name:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="productname" value={formData.productname} onChange={handleChange} required />
                </div>
              </div>
              <div className='mt-2'>
                <label className="block text-md font-medium leading-5 text-gray-700" >Product Conetent:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="productcontent" value={formData.productcontent} onChange={handleChange} required />
                </div>
              </div>
              <div className='mt-2'>
                <label className='block text-md font-medium leading-5 text-gray-700'>Product Price:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="number" name="productprice" value={formData.productprice} onChange={handleChange} required />
                </div>
              </div>
              <div className='mt-2'>
                <label className='bloack text-md font-medium leading-5 text-gray-700'>Multiple Images:</label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="file" name="multipleimages" onChange={handleMultipleImagesChange} multiple required />
                </div>
              </div>
              {/* <button>Submit</button> */}
              <div className="mt-6 flex flex-row items-center">
                <button type="submit" className="bg-green-500 hover:bg-green-600 mx-auto text-white font-bold py-2 px-4 rounded inline-flex items-center">Add New Product</button>
              </div>
          </form>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default AddProduct;