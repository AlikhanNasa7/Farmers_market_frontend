import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { useFormik, Form } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import useAxiosWithIntercepter from '../../../helpers/jwtintercepters';
import { useAuthService } from '../../../services/AuthService';
import { BASE_URL } from '../../../config';

const FarmModal = () => {
    const { farmId } = useParams();
    const navigate = useNavigate();
    const [previewImages, setPreviewImages] = useState([]);
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const {accessToken} = useAuthService();

    const axiosInstance = useAxiosWithIntercepter();

    const initialValues = {
        farm_name: '',
        farm_size: '',
        farm_location: '',
        description: '',
        image_urls: []
    };

    const validationSchema = Yup.object({
        farm_name: Yup.string().required('Farm name is required'),
        farm_size: Yup.string().required('Farm size is required'),
        farm_location: Yup.string().required('Farm location is required'),
        description: Yup.string().required('Description is required'),
        image_urls: Yup.array()
          .of(Yup.mixed().required('Image is required'))
          .max(5, 'You can upload a maximum of 5 images')
          .test('fileSize', 'File size is too large', value => {
            if (!value) return true; // skip validation if no file is uploaded
            return value.every(file => file.size <= 5000000); // 5MB size limit
          })
    });

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
          if (farmId) {
            delete values['image_urls'];
            console.log(values);
            const response = await axiosInstance.put(`/farms/${farmId}/`, values, {
                headers: {
                    'Content-Type': 'application/json',  // Specify that the content is multipart/form-data
                }
            });
            console.log(response)
          } else {
              values['image_urls'] = images;
              // const response = await axiosInstance.post('/products/', values, {
              //     headers: {
              //         'Content-Type': 'multipart/form-data',  // Specify that the content is multipart/form-data
              //     }
              // });
              await createFarm(values);
              //console.log(response);
          }
          navigate(-1);
        }
    });






    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles.length > 5) {
          alert("You can only upload a maximum of 5 images.");
          return;
        }
        const newImages = Array.from(selectedFiles);
        setImages([...images, ...newImages]);

        // Generate preview URLs for the selected images
        const imagePreviews = Array.from(selectedFiles).map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewImages([...previewImages, ...imagePreviews]);
    }

  

    useEffect(() => {
      if (farmId){
        axiosInstance.get(`/farms/${farmId}`)
          .then(response=>{
            const data = response.data;
            console.log(data)
            formik.values.farm_name = data.farm_name
            formik.values.farm_size = data.farm_size
            formik.values.farm_location = data.farm_location
            formik.values.description = data.description
            const imageUrls = data.image_urls.map(image=>`${BASE_URL}${image}`);
            setPreviewImages(imageUrls);
          })
          .catch((error) => {
            console.error('Error fetching product:', error);
          });
      }
      setLoading(false);

    }, [farmId]);

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedPreviews = previewImages.filter((_, i) => i !== index);
        setImages(updatedImages);
        setPreviewImages(updatedPreviews);
    };


    const createFarm = async (values) => {
      const formData = new FormData();

      // Append product fields to FormData
      formData.append('farm_name', values.farm_name);
      formData.append('description', values.description);
      formData.append('farm_id', values.farm_id);
      formData.append('farm_location', values.farm_location);
      formData.append('farm_size', values.farm_size);

      // Append image files to FormData
      values.image_urls.forEach((file) => {
          formData.append('image_urls', file);  // 'image_urls' matches the field in the serializer
      });

      try {
        console.log(formData)
          const response = await axiosInstance.post('http://127.0.0.1:8000/farms/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',  // Ensure the content type is correct for file uploads
              }
          });

          if (response.status === 201) {
              console.log('Product created successfully:', response.data);
              alert('Product created successfully!');
          } else {
              console.error('Error creating product:', response);
              alert('Failed to create product');
          }
      } catch (error) {
          console.error('Error creating product:', error);
          alert('An error occurred while creating the product.');
      }
  };

  
    return (
      <Dialog open={true} onClose={() => navigate(-1)}
      BackdropProps={{
        style: {
            backdropFilter: 'blur(5px)',  // Apply blur effect
            backgroundColor: 'rgba(0, 0, 0, 0.4)',  // Semi-transparent background
          },
      }}
      >
        <DialogContent>
            <form className='py-4 px-6 w-[540px] bg-white rounded-3xl flex flex-col gap-8 m-auto' onSubmit={formik.handleSubmit}>
              {!loading && (
                <>
                <div className="flex flex-col space-y-6 w-full">
                    <div className='flex justify-between'>
                        <div className="flex flex-col w-[47%]">
                            <label htmlFor="farm_name" className="text-gray-900 font-semibold mb-2">
                                Farm Name
                            </label>
                            <input
                                type="text"
                                id="farm_name"
                                name='farm_name'
                                onChange={formik.handleChange}
                                value={formik.values.farm_name}
                                className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                            />
                        </div>
                        <div className="flex flex-col w-[47%]">
                            <label htmlFor="farm_size" className="text-gray-900 font-semibold mb-2">
                                Farm Size
                            </label>
                            <input
                                type="text"
                                id="farm_size"
                                name='farm_size'
                                onChange={formik.handleChange}
                                value={formik.values.farm_size}
                                className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                            />
                        </div>
                    </div>
                    <div className='flex flex-col relative'>
                        <label htmlFor="farm_location" className="text-gray-900 font-semibold mb-2">
                            Farm Location
                        </label>
                        <input
                            type="text"
                            id="farm_location"
                            name='farm_location'
                            onChange={formik.handleChange}
                            value={formik.values.farm_location}
                            className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                        />
                    </div>
                  
                    <div className="flex flex-col relative">
                        <label htmlFor="description" className="text-gray-900 font-semibold mb-2 flex justify-between">
                            Description
                        </label>
                        <textarea 
                            id="description" name="description" 
                            rows={4} cols={50} placeholder="Description"
                            className='border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800'
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        ></textarea>
                    </div>
                    <div className="flex flex-col relative">
                        {!farmId && <label htmlFor="image" className="text-gray-900 font-semibold mb-2 flex justify-between">
                            Images
                        </label>}
                        {!farmId && <input
                            id="image"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />}
                        <div className="image-previews">
                            {previewImages.map((imageSrc, index) => (
                                <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
                                <img
                                    src={imageSrc}
                                    alt={`preview-${index}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                {!farmId && <button type="button" onClick={() => handleRemoveImage(index)}>
                                    Remove
                                </button>}
                                </div>
                            ))}
                        </div>
                    </div>
                    {formik.errors.role && formik.touched.role && (
                        <div style={{ color: 'red' }}>{formik.errors.role}</div>
                    )}
                </div>
                <div className='flex m-auto gap-4'>
                    <button onClick={() => navigate(-1)} className='text-red-500'>
                        Cancel
                    </button>
                    <button type='submit' className='text-blue-600'>
                        {farmId ? 'Save Changes' : 'Create Farm'}
                    </button>
                </div>
                </>
                )
              }
              {loading && <p>Loading</p>}
            </form>
        </DialogContent>
      </Dialog>
    );
}

export default FarmModal