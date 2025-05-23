import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllProducts,
  selectAllProducts, 
  setActiveProduct, 
  setInventoryActiveContent, 
  showPopup4, 
  toggleDeleteProduct,
  toggleProductStatus
} from "../../inventory/inventorySlice.js";
import { getAllCategories } from "../../inventory/inventoryApi.js";
import { motion } from 'framer-motion';
import { selectOrder, setSelectedItem, showPopup5 } from "../sellSlice.js";


function SelectProductCard() {
  const dispatch = useDispatch();
  const { products, totalPages, currentPage } = useSelector(selectAllProducts);
  let allProducts = products || [];
  allProducts = allProducts.map(product => ({
    ...product,
    selectedQuantity: 0,
  }))

  const {items} = useSelector(selectOrder);
  const selectedItems = items || [];

  const [timeActive, setTimeActive] = useState(true);
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [showInnerComponent, setShowInnerComponent] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAllProducts({ page, sort, order, search, isDeleted: false, category, status:"Active" }));
  }, [dispatch, page, sort, order, search, category]);

  useEffect(() => {
    const getter = async() => {
      const result = await getAllCategories();
      setCategories(result);
    }
    getter();
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
  }

  const handleSortChange = (e) => {
    if (e.target.value === "createdAt"){
      setTimeActive(true);
    }else {
      setTimeActive(false); 
    }
    setSort(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleProductSelect = async (product) => {
    if (product.selectedQuantity === 0){
      return;
    }
    dispatch(setSelectedItem({product: product._id, quantity: product.selectedQuantity}))
    dispatch(showPopup5({
      message: "Product Selected",
      duration: 3000,
      type: "success",
    }))
  };

  const handleInnerComponent = () => {
    setShowInnerComponent((prev) => !prev);
  };

  return (
    <div>

      <div className="flex items-center justify-between px-10 py-8 text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-md h-20 mx-auto 
      border border-gray-800 bg-clip-padding hover:shadow-3xl mb-4 cursor-pointer"
      onClick={handleInnerComponent}
      >
        <div className="text-3xl font-bold">Select Products</div>
        <div className="capitalize px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md cursor-default">Selected Products: {selectedItems.length}</div>

      </div>

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
    <div className="w-full flex flex-col text-white bg-gradient-to-br from-gray-800 to-gray-900 items-center shadow-2xl rounded-md border border-gray-900 bg-clip-padding py-4 mb-4">
      <div className="flex flex-row gap-3 items-center mb-4 self-start ml-12">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
        value={search}
        onChange={handleSearch}
        />

      <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
        <option value="createdAt">Time</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <select value={order} onChange={handleOrderChange} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
        <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
        <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
      </select>

      <select value={category} onChange={handleCategory} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
        <option value="">All Categories</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select> 

      </div>

      <table className="w-11/12 bg-gray-800 text-white rounded-sm">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Active Price</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Available Quantity</th>
            <th className="px-4 py-2">Discount Percent</th>
            <th className="px-4 py-2">Discounted Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                <td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{backgroundImage: `url(${product.coverImg})`}}></div></td>
                <td className="px-4 py-2 capitalize">{product.name}</td>
                <td className="px-4 py-2">{product.price[0]?.price}</td>
                <td className="px-4 py-2 capitalize">{product.category}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.discountPercent}%</td>
                <td className="px-4 py-2">{(product.price[0].price)-((product.discountPercent/100)*(product.price[0].price))}</td>
                <td className="px-4 py-2">
                  <input 
                  onChange={(e) => product.selectedQuantity = e.target.value} 
                  className="border border-gray-600 bg-gray-800 w-4/5 rounded-md p-2" 
                  type="number"
                  min={0} max={product.quantity}
                  placeholder="0"/>
                </td>
                <td className="flex flex-row justify-center py-5">

                <button
                onClick={() => handleProductSelect(product)}
                className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                >
                  <div>Select</div>
                </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded-md mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-700"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </motion.div>
    </div>
  )
}

export default SelectProductCard