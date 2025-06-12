import React, { useEffect, useState } from 'react';
import {
  setInventoryActiveContent,
  selectActiveProduct,
  selectStatus3,
  updateProductDetails,
  updatePrice,
  toggleProductStatus,
  updateCoverImage,
  updatePhotos,
} from '../inventorySlice.js';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useAppDispatch, useAppSelector } from '../../../../../hooks.js';
import type { ProductFormState } from '../../../dashboardTypes.js';

const EditProductCard = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus3);
  const product = useAppSelector(selectActiveProduct);
  if (!product) return;

  const defaultImage = "https://vallabhcomponent.com/assets/images/default.jpg";

  const [formData, setFormData] = useState<ProductFormState>({
    name: product.name || '',
    description: product.description || '',
    price: product.price?.[0]?.price || 0,
    quantity: product.quantity || 0,
    category: product.category || '',
    supplier: product.supplier || '',
    status: product.status || 'Active',
    lowStockThreshold: product.lowStockThreshold || 1,
    discountPercent: product.discountPercent || 0,

    coverImg: product.coverImg || null,
    photos: product.photos || null
  });

  const [coverImgPreview, setCoverImgPreview] = useState<string | File>(formData.coverImg || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbmNxhl6aFUDwBtyelBzun4EnBJLblVb56w&s');
  const [images, setImages] = useState<(File | string)[]>(formData.photos ||[defaultImage]);  //It holds Image links links for SLider Image Preview
  const [imagesFiles, setImagesFiles] = useState<(File | string)[]>([defaultImage]); //It holds image files which are required while uploading

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photos: imagesFiles.includes(defaultImage) ? imagesFiles.filter((img) => img !== defaultImage) : imagesFiles
    }));
  }, [imagesFiles]);

  const handleCoverImgUpload = () => {
    const coverImgFormData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'coverImg' && value) {
        coverImgFormData.append('coverImg', value); 
      } 
    });
    console.log(product._id);
    
    // console.log([...coverImgFormData.entries()]); // For Debugging
    dispatch(updateCoverImage({productId: product._id,formData: coverImgFormData}));
  };

  const handlePhotosUpload = () => {
    const imgFormData = new FormData();
  
    formData.photos?.forEach((file) => {
      imgFormData.append("photos", file);
    });
    // console.log([...imgFormData.entries()]);

    dispatch(updatePhotos({ productId: product._id, formData: imgFormData }));
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'lowStockThreshold' || name === 'discountPercent' 
        ? parseFloat(value) || 0
        : value,
    }));
  };

  // const handleCoverImgChange = (e) => {
  //   const file = e.target.files[0];
    
  //   if (file) {
  //     formData.coverImg = file;
  //     setCoverImgPreview(URL.createObjectURL(file)); // Generate a preview URL
  //     setFormData({ ...formData, coverImg: e.target.files[0] });
  //   }
  // };

  const handleCoverImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
  
    if (file) {
      formData.coverImg = file;
      setCoverImgPreview(URL.createObjectURL(file)); // Generate a preview URL
      setFormData({ ...formData, coverImg: file });
    }
  };

  // Handle file input change
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(event.target.files);
  //   if (files.length + images.length - (images.includes(defaultImage) ? 1 : 0) > 3) {
  //     alert("You can only upload up to 3 images.");
  //     return;
  //   }

  //   const newImages = files.map((file) => URL.createObjectURL(file));
  //   setImages([...images.filter((img) => img !== defaultImage), ...newImages]);
  //   setImagesFiles([...imagesFiles.filter((img) => img !== defaultImage), ...files])
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    if (!images) return;
    const hasDefaultImage = Array.isArray(images) && images.includes(defaultImage);
    if (files.length + images.length - (hasDefaultImage ? 1 : 0) > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    const imagesArr = Array.isArray(images) ? images : Array.from(images);
    setImages([
      ...imagesArr.filter((img): img is string => typeof img === "string" && img !== defaultImage),
      ...newImages
    ]);
    const imagesFilesArr = Array.isArray(imagesFiles) ? imagesFiles : Array.from(imagesFiles || []);
    setImagesFiles([...(imagesFilesArr.filter((img) => img !== defaultImage) as (File | string)[]), ...files])
  };

  // Handle replacing a single image
  // const handleReplaceImage = (index) => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.onchange = (e) => {
  //     const file = e.target.files[0];
      
  //     if (file) {
  //       const newImageUrl = URL.createObjectURL(file);
  //       setImagesFiles((prevImages) => {
  //         const updatedImages = [...prevImages];
  //         updatedImages[index] = file;
  //         return updatedImages;
  //       })
  //       setImages((prevImages) => {
  //         const updatedImages = [...prevImages];
  //         updatedImages[index] = newImageUrl;
  //         return updatedImages;
  //       });
  //     }
  //   };
  //   input.click();
  // };

  const handleReplaceImage = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement | null;
      if (!target || !target.files || target.files.length === 0) return;
      const file = target.files[0];
      if (file) {
        const newImageUrl = URL.createObjectURL(file);
        setImagesFiles((prevImages) => {
          const imagesArr = Array.isArray(prevImages) ? prevImages : [];
          const updatedImages = [...imagesArr];
          updatedImages[index] = file;
          return updatedImages;
        })
        setImages((prevImages) => {
          const imagesArr = Array.isArray(prevImages) ? prevImages : [];
          const updatedImages = [...imagesArr];
          updatedImages[index] = newImageUrl;
          return updatedImages;
        });
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (product.price?.[0]?.price !== formData.price) {
      dispatch(updatePrice({ productId: product._id, newPrice: Number(formData.price) }));
    }
    if (product.status !== formData.status) {
      dispatch(toggleProductStatus(product._id));
    }
    dispatch(updateProductDetails({ productId: product._id, updatedData: formData }));
  };

  const handleCancel = () => {
    dispatch(setInventoryActiveContent('Display'));
  };

  return (
    <div className="relative p-6 rounded-2xl m-4 border border-gray-900 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl max-w-4xl mx-auto">
      
        <div className="flex flex-col">
        {/* Images */}
        <div className='flex flex-col md:flex-row justify-around items-center mb-4 gap-4'>
          <div className="flex flex-col items-center">
            <div 
            className="size-40 bg-contain bg-no-repeat bg-center rounded-full border-4 bg-white border-white shadow-lg transition-transform duration-300 hover:scale-110" 
            style={{backgroundImage: `url(${coverImgPreview})`}}>
            </div>
            
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col items-center mt-6'>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImgChange}
                className="hidden"
                id="avatarUpload"
              />
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Choose Image
              </label>
            </div>

            <div className='flex flex-col items-center mt-6'>
              <input
                type="button"
                onClick={handleCoverImgUpload}
                className="hidden"
                id="coverImgUpload"
                disabled={status === 'loading'}
              />
              <label
                htmlFor="coverImgUpload"
                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                {(status === "loading")? "Uploading" : "Upload Image"}
              </label>
            </div>
          </div>
          </div>

          {/* Photos Display */}
          <div className="flex flex-col items-center gap-4">
          {/* Swiper Slider */}
          <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={images.length > 1 }
          className="w-80 h-52 border rounded-lg shadow-lg"
          >
          {images.map((img, index) => (
          <SwiperSlide key={index} className="relative">
            <img src={typeof img === "string" ? img : URL.createObjectURL(img)} alt={`Slide ${index}`} className="w-full bg-white h-full object-contain rounded-lg" />
            {img !== defaultImage && (
              <button
                className="absolute top-2 right-2 bg-gray-800 text-white text-sm px-2 py-1 rounded"
                onClick={() => handleReplaceImage(index)}
              >
                Change
              </button>
            )}
          </SwiperSlide>
          ))}
          </Swiper>

          {/* Upload Button */}
        <div className='flex flex-row gap-3'>
          <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
          >
          Choose Images
          </label>

          <div className='flex flex-col items-center'>
            <input
              type="button"
              onClick={handlePhotosUpload}
              className="hidden"
              id="photosInput"
              disabled={status === 'loading'}
            />
            <label
              htmlFor="photosInput"
              className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              {(status === "loading")? "Uploading" : "Upload Images"}
            </label>
          </div>
        </div>
          </div>
        </div>

        {/* Name and Category */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Product Name</label> */}
            <input
              type="text"
              name="name"
              placeholder='Product Name'
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>
          <div className="w-1/2">
            {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Category</label> */}
            <input
              type="text"
              name="category"
              placeholder='Category'
              value={formData.category}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="flex flex-col mb-4">
          {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Description</label> */}
          <textarea
            name="description"
            value={formData.description}
            placeholder='Product Description...'
            onChange={handleChange}
            className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
          />
        </div>
        
        {/* Price and Quantity */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="text-lg font-semibold text-gray-500 mb-1 ml-2">Price</label>
            <input
              type="number"
              name="price"
              placeholder='Price'
              value={formData.price}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="text-lg font-semibold text-gray-500 mb-1 ml-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>
        </div>
        {/* Low Stock Threshold and Discount */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="text-lg font-semibold text-gray-500 mb-1 md:ml-2">Low Stock Threshold</label>
            <input
              type="number"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="text-lg font-semibold text-gray-500 mb-1 ml-2">Discount (%)</label>
            <input
              type="number"
              name="discountPercent"
              value={formData.discountPercent}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>
        </div>

        {/* Supplier and Status */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Supplier</label> */}
            <input
              type="text"
              name="supplier"
              placeholder='Supplier'
              value={formData.supplier}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            />
          </div>
          <div className="w-1/2">
            {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Status</label> */}
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <button
            onClick={handleSave}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-3 bg-gray-700 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
        </div>
    </div>
  );
};

export default EditProductCard;
