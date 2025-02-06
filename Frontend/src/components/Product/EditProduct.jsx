import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const EditProduct = () => {
  const [formData, setFormData] = useState({
    productname: '',
    productcontent:'',
    productprice:'',
  });
  const navigate = useNavigate();
  const {id} = useParams();  
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    const newImages = files.map(file => {
      return URL.createObjectURL(file);
    });
    setImages(prevImages => [...prevImages, ...newImages]);

};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = id; // Replace with the actual user ID

    const data = new FormData();
    console.log(formData);
    data.append('productname', formData.productname);
    data.append('productcontent', formData.productcontent);
    data.append('productprice', formData.productprice);
    console.log(formData);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:8000/api/products/${userId}/update-product`, formData, {
            headers: {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            }
        });
      console.log('Product updated:', response.data);
    } catch (error) {
      console.error('There was an error updating the product!', error);
    }

    const formData2 = new FormData();
    Array.from(selectedImages).forEach(image => {
        formData2.append('multipleimages', image);
    });
    // console.log(formData2);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:8000/api/products/${userId}/update-images`, formData2, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        });
        // console.log('Updated Object:', response.data);
        navigate("/Products")
    } catch (error) {
        console.error('Error uploading images:', error);
    }
  };
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/products/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`, 
          },
      });
      setFormData(response.data);
    //   console.log(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const deleteImage = async (imgpath, objId) => {
    const imageUrl = imgpath;
    // console.log(imageUrl);
    const objectId = objId;
    console.log(objectId);
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:8000/api/products/${objectId}/delete-image`, { imageUrl },{
      headers:{
          Authorization: `Bearer ${token}`,
      },
    });
    console.log('Updated Object:', response.data);
  } catch (error) {
      console.error('Error deleting image:', error);
  }
  // fetchForms();
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
                <h1 className="text-center text-2xl font-bold">Edit User Data</h1>
                    <div className='mt-2'>
                        <label className="block text-md font-medium leading-5 text-gray-700" >Product Name:</label>
                        <div className="mt-1 rounded-md shadow-sm">
                        <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="productname" value={formData.productname} onChange={handleChange} placeholder="Name" required />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <label className="block text-md font-medium leading-5 text-gray-700" >Product Content:</label>
                        <div className="mt-1 rounded-md shadow-sm">
                        <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="text" name="productcontent" value={formData.productcontent} onChange={handleChange} placeholder="Content" required />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <label className='block text-md font-medium leading-5 text-gray-700'>Product Price:</label>
                        <div className="mt-1 rounded-md shadow-sm">
                        <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="number" name="productprice" value={formData.productprice} onChange={handleChange} placeholder="Price"  required />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <label className='bloack text-md font-medium leading-5 text-gray-700'>Multiple Images:</label>
                        <div className="mt-1 rounded-md shadow-sm">
                        <input className='w-full px-3 py-2 border border-gray-300 rounded-md' type="file" accept="image/*" multiple onChange={handleImageChange} />
                        </div>
                        <div>
                            <div>
                                <div>
                                {images.map((image, index) => (
                                    <img key={index} src={image} alt={`uploaded ${index}`} className="uploaded-image"/>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div key={formData._id} className="w-fit mx-auto grid grid-cols-2 lg:grid-cols-2 md:grid-cols-3 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                            {formData.multipleimages && formData.multipleimages.length > 0 ? (
                                formData.multipleimages.map((image, index) => (
                                    <div key={index} className="w-28 h-24 bg-white shadow-md rounded-xl ">
                                        <button onClick={()=> deleteImage(image, formData._id)} className="hover:text-red-600 mx-auto text-black font-bold py-2 px-6 rounded inline-flex items-center">X</button>
                                        <img src={`http://localhost:8000/${image}`} alt="Product" className="h-24 w-28 object-cover rounded-t-xl" />
                                    </div>    
                                    ))
                                ) : (
                                    <p>Loading images...</p>
                                )}
                        </div>
                    </div>
                    {/* <button>Submit</button> */}
                    <div className="mt-6 flex flex-row items-center">
                        <button  type="submit" className="bg-green-500 hover:bg-green-600 mx-auto text-white font-bold py-2 px-4 rounded inline-flex items-center">Update User</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    </>
  );
};

export default EditProduct;