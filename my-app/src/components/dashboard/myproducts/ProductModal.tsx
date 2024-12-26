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

const ProductModal = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [previewImages, setPreviewImages] = useState([]);
    const [images, setImages] = useState([]);

    const [farms, setFarms] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(false);
    const {accessToken} = useAuthService();
    const [product, setProduct] = useState();

    const axiosInstance = useAxiosWithIntercepter();

    const initialValues = {
        name: '',
        farm_id: '',
        category: '',
        sub_category: '',
        price: 0,
        quantity: 0,
        unit: '',
        description: '',
        image_urls: []
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Product name is required'),
        farm_id: Yup.string().required('Farm is required'),
        category: Yup.string().required('Category is required'),
        sub_category: Yup.string().required('Sub-category is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
        unit_type: Yup.string().required('Unit type is required'),
        description: Yup.string().required('Description is required'),
        images: Yup.array()
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
            console.log('Form Data:', values);
            values.quantity = parseInt(values.quantity)
            values.price = parseFloat(values.price)

            if (productId) {
                delete values['image_urls'];
                console.log(values);
                const response = await axiosInstance.put(`/products/${productId}/`, values, {
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
                await createProduct(values);
                //console.log(response);
            }
            navigate(-1);
        }
    });


    useEffect(()=>{
        async function fetchData(){
            try {
                setLoading(true);
                const response = await axiosInstance.get('/products/create-product', {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
                });
                console.log(response.data);
                setFarms(response.data.farms);
                setCategories(response.data.categories);
            } catch (error) {
            //react-toasts should show messages
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[]);




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
      if (productId) {

        axiosInstance.get(`/products/${productId}`)
          .then((response) => {
            const data = response.data;
            console.log(data);
            formik.values.farm_id = data.farm_id
            formik.values.name = data.name
            formik.values.price = data.price
            formik.values.category = data.category
            formik.values.sub_category = data.subcategory
            formik.values.unit = data.unit_name
            formik.values.quantity = data.quantity
            formik.values.description = data.description
            const imageUrls = data.image_urls.map(image=>`${BASE_URL}${image}`);
            setPreviewImages(imageUrls);
            setProduct(response.data)
          })
          .catch((error) => {
            console.error('Error fetching product:', error);
          });
      }
    }, [productId]);

    console.log(images, product)

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedPreviews = previewImages.filter((_, i) => i !== index);
        setImages(updatedImages);
        setPreviewImages(updatedPreviews);
    };

    const handleSubmit = (event) => {
        event?.preventDefault()
        formik.handleSubmit();
    };


    const createProduct = async (values) => {
        const formData = new FormData();

        // Append product fields to FormData
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('quantity', values.quantity);
        formData.append('description', values.description);
        formData.append('farm_id', values.farm_id);
        formData.append('category', values.category);
        formData.append('sub_category', values.sub_category);
        formData.append('unit', values.unit);

        // Append image files to FormData
        values.image_urls.forEach((file) => {
            formData.append('image_urls', file);  // 'image_urls' matches the field in the serializer
        });

        try {
            console.log(formData)
            const response = await axiosInstance.post('http://127.0.0.1:8000/products/', formData, {
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
            <form className='py-4 px-6 w-[540px] bg-white rounded-3xl flex flex-col gap-8 m-auto' onSubmit={handleSubmit}>
            
                <div className="flex flex-col space-y-6 w-full">
                    <div className='flex justify-between'>
                        <div className="flex flex-col w-[65%]">
                            <label htmlFor="name" className="text-gray-900 font-semibold mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name='name'
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                className="border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                            />
                        </div>
                        <div className="flex flex-col w-[30%]">
                            <label htmlFor="farm_id" className="text-gray-900 font-semibold mb-2">
                                Farm
                            </label>
                            <select 
                                name="farm_id" 
                                id="farm_id" 
                                className='p-2 h-[50px] text-lg text-[#7b7b7b] border border-[#7b7b7b] rounded-md'
                                onChange={formik.handleChange}
                                value={formik.values.farm_id}
                            >
                                <option value=""></option>
                                {farms.length>0 && farms.map(farm=>(<option value={farm.farm_id}>{farm.farm_name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className="flex flex-col w-[47%]">
                            <label htmlFor="category" className="text-gray-900 font-semibold mb-2">
                                Category
                            </label>
                            <select 
                                name="category" 
                                id="category" 
                                className='p-2 h-[50px] text-lg text-[#7b7b7b] border border-[#7b7b7b] rounded-md'
                                value={formik.values.category}
                                onChange={formik.handleChange}
                            >
                                <option value=""></option>
                                {categories && Object.keys(categories).map(category=><option value={category}>{category}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col w-[47%]">
                            <label htmlFor="sub_category" className="text-gray-900 font-semibold mb-2">
                                Sub Category
                            </label>
                            <select 
                                name="sub_category" 
                                id="sub_category" 
                                className='p-2 h-[50px] text-lg text-[#7b7b7b] border border-[#7b7b7b] rounded-md'
                                onChange={formik.handleChange}
                                value={formik.values.sub_category}
                            >   
                                <option value=""></option>
                                {formik.values.category && categories[formik.values.category] && categories[formik.values.category].map(subCategory=><option value={subCategory}>{subCategory}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className="flex flex-col w-[30%]">
                            <label htmlFor="price" className="text-gray-900 font-semibold mb-2">
                                Price
                            </label>
                            <input
                                type="text"
                                id="price"
                                name='price'
                                onChange={formik.handleChange}
                                value={formik.values.price}
                                className="border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                            />
                        </div>
                        <div className="flex flex-col w-[30%]">
                            <label htmlFor="quantity" className="text-gray-900 font-semibold mb-2">
                                Quantity
                            </label>
                            <input
                                type="text"
                                id="quantity"
                                name='quantity'
                                onChange={formik.handleChange}
                                value={formik.values.quantity}
                                className="border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                            />
                        </div>
                        <div className="flex flex-col w-[30%]">
                            <label htmlFor="unit" className="text-gray-900 font-semibold mb-2">
                                Unit Type
                            </label>
                            <select 
                                name="unit" 
                                id="unit" 
                                className='p-2 h-[42px] text-lg text-[#7b7b7b] border border-[#7b7b7b] rounded-md'
                                onChange={formik.handleChange}
                                value={formik.values.unit}
                            >
                                <option value=""></option>
                                <option value="kg">KG</option>
                                <option value="pcs">Piece</option>
                                <option value="litres">Litre</option>
                            </select>
                        </div>
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
                        <label htmlFor="image" className="text-gray-900 font-semibold mb-2 flex justify-between">
                            Images
                        </label>
                        {!productId && <input
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
                                {!productId && <button type="button" onClick={() => handleRemoveImage(index)}>
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
                    <button type='submit' className='text-blue-600' onSubmit={formik.handleSubmit}>
                        {productId ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </form>
        </DialogContent>
      </Dialog>
    );
};

export default ProductModal;
