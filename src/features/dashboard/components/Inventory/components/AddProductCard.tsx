import React, { useEffect, useState } from 'react';
import { addProduct, setInventoryActiveContent, selectStatus3 } from '../inventorySlice.js';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; 
import { getAllCategories, getAllSuppliers } from '../inventoryApi.js';
import { useAppDispatch, useAppSelector } from '../../../../../hooks.js';
import type { ProductFormState } from '../../../dashboardTypes.js';

const AddProductCard = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus3);
  const defaultImage = "https://vallabhcomponent.com/assets/images/default.jpg"; // Default image
  const [imagesFiles, setImagesFiles] = useState<(File | string)[]>([defaultImage]);
  const [images, setImages] = useState<(File | string)[] | null>([defaultImage]);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [isCustomSupplier, setIsCustomSupplier] = useState<boolean>(false);

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

  const [formData, setFormData] = useState<ProductFormState>({
    name: '',
    description: '',
    price: Number(''),
    quantity: Number(''),
    category: '',
    supplier: '',
    discountPercent: Number(''),
    coverImg: null,
    status: 'Active',
    lowStockThreshold: Number(''),
    photos: null
  });

  useEffect(() => {
    setFormData({ ...formData, photos: imagesFiles })
  },[imagesFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setFormData((prev) => ({ ...prev, category: inputValue }));

    // Check if input value exists in predefined categories
    if (categories.includes(inputValue)) {
      setIsCustomCategory(false);
    } else {
      setIsCustomCategory(true);
    }
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  return (
    <div className="relative p-6 rounded-2xl m-4 border border-gray-900 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl max-w-4xl mx-auto">
        <div className="flex flex-col">
          {/* Images */}
        <div className='flex flex-col md:flex-row justify-around items-center mb-4 gap-4'>
          <div className="flex flex-col items-center">
            <div 
            className="size-40 bg-white bg-contain bg-no-repeat bg-center rounded-full border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110" 
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
                className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
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
          loop={!!images && images.length > 1 }
          className="w-80 h-52 border rounded-lg shadow-lg bg-white"
          >
          {images?.map((img, index) => (
          <SwiperSlide key={index} className="relative">
            <img src={typeof img === "string" ? img : URL.createObjectURL(img)} alt={`Slide ${index}`} className="w-full h-full object-contain rounded-lg" />
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
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
          >
          Upload Images
          </label>
          </div>
        </div>

          {/* Name */}
          <div className="mb-4">
            {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Product Name</label> */}
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Product Name' className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full" />
          </div>

          {/* Description */}
          <div className="mb-4">
            {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2"></label> */}
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder='Description' className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"></textarea>
          </div>

          {/* Price & Discount Percent */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              {/* <label className="text-lg font-semibold text-gray-500 mb-1 ml-2">Price</label> */}
              <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder='Price' className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full" />
            </div>
            <div className="w-1/2">
              {/* <label className="text-lg font-semibold text-gray-500 mb-1 ml-2"></label> */}
              <input type="number" name="discountPercent" value={formData.discountPercent} placeholder='Discount (%)' onChange={handleChange}  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full" />
            </div>
          </div>

          {/* Category & Supplier & Status */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Category</label> */}
              <div className="relative">
                {/* Input Field */}
                <input
                  type="text"
                  list="category-options"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
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
              {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Supplier</label> */}
              <div className="relative">
                {/* Input Field for Supplier */}
                <input
                  type="text"
                  list="supplier-options"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleSupplierChange}
                  className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full"
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
              {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Quantity</label> */}
              <input type="number" min={0} name="quantity" value={formData.quantity} onChange={handleChange} placeholder='Quantity' className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full" />
            </div>
            <div className="w-1/2">
              {/* <label className="text-lg font-semibold text-gray-700 mb-1 ml-2">Set Stock Threshold Limit</label> */}
              <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} placeholder='Low Stock Limit' onChange={handleChange} className="bg-gray-800 text-white border border-gray-600 p-3 rounded-md w-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6">
            <button onClick={handleSave} className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl" disabled={status === 'loading'}>
              {status === 'loading' ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} className="px-5 py-3 bg-gray-700 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </div>
    </div>
  );
};

export default AddProductCard;