import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, setInventoryActiveContent, selectStatus3 } from '../inventorySlice.js';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getAllCategories, getAllSuppliers } from '../inventoryApi.js';

const AddProductCard = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus3);
  const defaultImage = "https://vallabhcomponent.com/assets/images/default.jpg"; // Default image
  const [imagesFiles, setImagesFiles] = useState([defaultImage]);
  const [images, setImages] = useState([defaultImage]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomSupplier, setIsCustomSupplier] = useState(false);

  
  useEffect(() => {
    const getter = async () => {
      try {
        const result = await getAllCategories();
        const result2 = await getAllSuppliers();
        
        setCategories(Array.isArray(result) ? result : []);
        setSuppliers(Array.isArray(result2) ? result2 : []);
      } catch (error) {
        console.error("Error fetching categories or suppliers:", error);
        setCategories([]); // Fallback to an empty array
        setSuppliers([]);
      }
    };
    getter();
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    supplier: '',
    discountPercent: '',
    coverImg: null,
    status: 'Active',
    lowStockThreshold: '',
    photos: null
  });

  useEffect(() => {
    setFormData({ ...formData, photos: imagesFiles })
  },[imagesFiles])

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setFormData((prev) => ({ ...prev, category: inputValue }));

    // Check if input value exists in predefined categories
    if (categories.includes(inputValue)) {
      setIsCustomCategory(false);
    } else {
      setIsCustomCategory(true);
    }
  };

  const handleSupplierChange = (e) => {
    const inputValue = e.target.value;
    setFormData((prev) => ({ ...prev, supplier: inputValue }));

    // Check if input value exists in predefined categories
    if (suppliers.includes(inputValue)) {
      setIsCustomSupplier(false);
    } else {
      setIsCustomSupplier(true);
    }
  };


  const [coverImgPreview, setCoverImgPreview] = useState(formData.coverImg || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbmNxhl6aFUDwBtyelBzun4EnBJLblVb56w&s');
  // const [photoPreviews, setPhotoPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const formDataData = new FormData();
  
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'photos' && Array.isArray(value)) {
        value.forEach((file) => {
          formDataData.append("photos", file); 
        });
      } else if (key === 'coverImg' && value) {
        formDataData.append('coverImg', value);
      } else {
        formDataData.append(key, value);
      }
    });
  
    // console.log([...formDataData.entries()]); // For Debugging
    dispatch(addProduct(formDataData));
  };
  

  const handleCancel = () => {
    dispatch(setInventoryActiveContent("Display"));
  };

  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      formData.coverImg = file;
      setCoverImgPreview(URL.createObjectURL(file)); // Generate a preview URL
      setFormData({ ...formData, coverImg: e.target.files[0] });
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length - (images.includes(defaultImage) ? 1 : 0) > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images.filter((img) => img !== defaultImage), ...newImages]);
    setImagesFiles([...imagesFiles.filter((img) => img !== defaultImage), ...files])
  };

  // Handle replacing a single image
  const handleReplaceImage = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newImageUrl = URL.createObjectURL(file);
        setImagesFiles((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index] = file;
          return updatedImages;
        })
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index] = newImageUrl;
          return updatedImages;
        });
      }
    };
    input.click();
  };
  
  return (
    <div className="relative p-6 rounded-2xl border-2 bg-white shadow-2xl max-w-4xl mx-auto transition-transform duration-300 hover:scale-105 z-10">
      <div className="relative bg-white rounded-2xl p-6">
        <div className="flex flex-col">
          {/* Images */}
        <div className='flex flex-row justify-around items-center mb-4'>
          <div className="flex flex-col items-center">
            <div 
            className="size-40 bg-contain bg-no-repeat bg-center rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110" 
            style={{backgroundImage: `url(${coverImgPreview})`}}>
            </div>
            
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
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                Choose Image
              </label>
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
            <img src={img} alt={`Slide ${index}`} className="w-full h-full object-contain rounded-lg" />
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
            className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
          Upload Images
          </label>
          </div>
        </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"></textarea>
          </div>

          {/* Price & Discount Percent */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Discount (%)</label>
              <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
          </div>

          {/* Category & Supplier & Status */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Category</label>
              <div className="relative">
                {/* Input Field */}
                <input
                  type="text"
                  list="category-options"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm appearance-none"
                  placeholder="Type or select a category"
                />

                {/* Datalist (Browsers do not allow styling directly) */}
                <datalist id="category-options" className="bg-white border border-gray-300 shadow-lg rounded-md">
                {categories.map((cat, index) => (
                  <option key={index} value={cat} className="p-2 hover:bg-blue-100 cursor-pointer">
                  {cat}
                  </option>
                ))}
                </datalist>
              </div>

              {/* Informative Message for New Category */}
              {isCustomCategory && (
                <p className="text-sm text-gray-500 mt-1">New category will be added</p>
              )}
            </div>

            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Supplier</label>
              <div className="relative">
                {/* Input Field for Supplier */}
                <input
                  type="text"
                  list="supplier-options"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleSupplierChange}
                  className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full bg-white shadow-sm appearance-none"
                  placeholder="Type or select a supplier"
                />

                {/* Datalist for Suppliers */}
                <datalist id="supplier-options" className="bg-white border border-gray-300 shadow-lg rounded-md">
                  {suppliers.map((sup, index) => (
                    <option key={index} value={sup} className="p-2 hover:bg-blue-100 cursor-pointer" />
                  ))}
                </datalist>
              </div>

              {/* Informative Message for New Supplier */}
              {isCustomSupplier && (
                <p className="text-sm text-gray-500 mt-1">New supplier will be added</p>
              )}
            </div>
          </div>

          {/* Quantity and Threshold Limit */}
          <div className='flex gap-4 mb-4'>
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div className="w-1/2">
              <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Set Stock Threshold Limit</label>
              <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className="border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6">
            <button onClick={handleSave} className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl" disabled={status === 'loading'}>
              {status === 'loading' ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="px-5 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductCard;