import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { editOrder, selectActiveOrder, selectStatus5, setOrderActiveContent, showPopup6 } from '../orderSlice';
import { 
  fetchAllProducts,
  selectAllProducts, 
} from "../../inventory/inventorySlice.js";
import { getAllCategories } from "../../inventory/inventoryApi.js";

const EditOrderCard = () => {
  const dispatch = useDispatch();
  const order = useSelector(selectActiveOrder);
  const status = useSelector(selectStatus5);
  
  const productDetails = order.productDetails;
  const updatedProductDetails = productDetails.map(product => {
    const { quantity, ...rest } = product;
    return { ...rest, availableQuantity: quantity };
  });
  const productQuantityArray = order.products;

  const mergeAndKeepKeys = (array1, array2, keysToKeep, keyToAdd) => {
    const map = new Map(array2.map(item => [item.product, item[keyToAdd]]));
  
    return array1.map(product => {
      const newObj = keysToKeep.reduce((acc, key) => {
        if (key in product) {
          acc[key] = product[key];
        }
        return acc;
      }, {});
  
      if (map.has(product._id)) {
        newObj[keyToAdd] = map.get(product._id);
      }
  
      return newObj;
    });
  };
  
  const keysToKeep = ['_id', 'coverImg', 'name', 'discountPercent', 'price', 'availableQuantity'];
  const keyToAdd = 'quantity';
  
  let finalOrder = mergeAndKeepKeys(updatedProductDetails, productQuantityArray, keysToKeep, keyToAdd) || [];
  const [OrderedProducts, setOrderedProducts] = useState(finalOrder);

  const quantityRefs = useRef({});
  const handleUpdateProduct = async(productId) => {
    const quantity = quantityRefs.current[productId]?.value;
    
    if (quantity !== undefined) {
      setOrderedProducts(
        OrderedProducts.map((order) => 
          order._id === productId 
            ? { ...order, quantity: Number(quantity) } 
            : order
        )
      );
      dispatch(showPopup6({
        message: "Product Updated",
        duration: 3000,
        type: "success",
      }));
    }

  }

  const handleProductDelete = async (productId) => {
    setOrderedProducts(
      OrderedProducts.filter((order) => order._id !== productId)
    )
    dispatch(showPopup6({
      message: "Product Deleted",
      duration: 3000,
      type: "success",
    }));
  };
  
  const { products, totalPages, currentPage } = useSelector(selectAllProducts);
    let allProducts = products || [];
    allProducts = allProducts.map(product => ({
      ...product,
      selectedQuantity: 0,
    }))
    
    const updatedAllProducts = allProducts.filter(item1 => 
      !OrderedProducts.some(item2 => item1._id === item2._id)
    );
  
    const [timeActive, setTimeActive] = useState(true);
    const [categories, setCategories] = useState([]);
  
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);

    useEffect(() => {
      dispatch(fetchAllProducts({ page, sort, order: sortOrder, search, isDeleted: false, category, status:"Active" }));
    }, [dispatch, page, sort, sortOrder, search, category]);
  
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
      setSortOrder(e.target.value);
      setPage(1);
    };
  
    const handlePageChange = (newPage) => {
      setPage(newPage);
    };
  
    const handleProductSelect = async (product) => {
      if (product.selectedQuantity === 0){
        return;
      }
      const newProduct = {
        _id: product._id,
        name: product.name,
        coverImg: product.coverImg,
        availableQuantity: product.quantity,
        discountPercent: product.discountPercent,
        price: product.price,
        quantity: Number(product.selectedQuantity)
      }

      // finalOrder = [...finalOrder, newProduct];
      setOrderedProducts([...OrderedProducts, newProduct]);
      dispatch(showPopup6({
        message: "Product Added To Cart",
        duration: 3000,
        type: "success",
      }));
    };

    const [additionalDiscountPercent, setAdditionalDiscountPercent] = useState(order.additionalDiscountPercent);
    let totalPrice = 0;
    let initialDiscountedPrice = 0;
    
    for (const item of OrderedProducts) {
    const itemTotalPrice = item.quantity * item.price[0].price;
    const itemDiscount = (item.discountPercent / 100) * itemTotalPrice;
    const itemDiscountedPrice = itemTotalPrice - itemDiscount;

    totalPrice += itemTotalPrice;
    initialDiscountedPrice += itemDiscountedPrice;
    }

    const finalDiscountedPrice = initialDiscountedPrice  - ( (additionalDiscountPercent / 100) * initialDiscountedPrice);

    const handleConfirmOrder = () => {
      const sendingOrder = OrderedProducts.map(({ _id, quantity }) => ({ _id, quantity }));
      dispatch(editOrder({orderId: order._id, products: sendingOrder, additionalDiscountPercent})); 
    }

    const handleCancel = () => {
      dispatch(setOrderActiveContent("DisplayOrders"));
    };
  return (
    <>
      <div>   {/* Show Orders */}
        <div className="w-full flex flex-col bg-white items-center shadow-2xl rounded-3xl border-4 bg-clip-padding py-4">
          <div className='flex flex-row justify-between w-full mb-2'>
            <div className='text-2xl font-bold ml-12'>Current Order</div>
            <div className="capitalize mr-12 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-md cursor-default">Selected Products: {OrderedProducts.length}</div>
          </div>
          <table className="bg-white border border-gray-300 w-11/12">
            <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {OrderedProducts.length > 0 ? (
              OrderedProducts.map((product) => (
                <tr key={product._id} className="border hover:bg-gray-100 text-center">
                  <td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{backgroundImage: `url(${product.coverImg})`}}></div></td>
                  <td className="px-4 py-2 capitalize">{product.name}</td>
                  <td className="px-4 py-2">{(product.price[0].price)-((product.discountPercent/100)*(product.price[0].price))}</td>
                  <td className="px-4 py-2">
                  <input
                    className="border border-gray-600 w-2/5 rounded-lg p-2"
                    type="number"
                    min={1}
                    max={product.availableQuantity}
                    placeholder={product.quantity}
                    ref={(el) => (quantityRefs.current[product._id] = el)} 
                  />
                  </td>

                  <td className="flex flex-row justify-center py-5 gap-3">

                  <button
                  onClick={() => handleUpdateProduct(product._id)}
                  className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                  >
                    <div>Update</div>
                  </button>

                  <button
                  onClick={() => handleProductDelete(product._id)}
                  className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                  >
                    <div>Delete</div>
                  </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    
      <div>   {/* Show other Products */}
        <div className="w-full flex flex-col bg-white items-center shadow-2xl rounded-3xl border-4 bg-clip-padding py-4">
        <div className='text-2xl font-semibold self-start ml-12 mb-2'>Add Products</div>
        <div className="flex flex-row gap-3 items-center mb-4 self-start ml-12">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={handleSearch}
          />

        <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded-md">
          <option value="createdAt">Time</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        <select value={sortOrder} onChange={handleOrderChange} className="border px-3 py-2 rounded-md">
          <option value="asc">{ (timeActive) ? "Oldest" : "Ascending"}</option>
          <option value="desc">{ (timeActive) ? "Newest" : "Descending"}</option>
        </select>

        <select value={category} onChange={handleCategory} className="border px-3 py-2 rounded-md">
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select> 

        </div>

        <table className="bg-white border border-gray-300 w-11/12">
          <thead>
            <tr className="bg-gray-200">
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
            {updatedAllProducts.length > 0 ? (
              updatedAllProducts.map((product) => (
                <tr key={product._id} className="border hover:bg-gray-100 text-center">
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
                    className="border border-gray-600 w-4/5 rounded-lg p-2" 
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
              className={`px-4 py-2 border rounded-md mx-1 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        </div>
      </div>
          
      <div> {/* Payment Details */}
      <div className="w-full flex flex-col bg-white items-center shadow-2xl rounded-3xl border-4 bg-clip-padding py-4">
          <table className="min-w-full bg-white border-gray-300">
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="px-4 py-2">Total Price</td>
                <td className="px-4 py-2 text-right">{(totalPrice === 0) ? "NA" : `${totalPrice}`}</td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="px-4 py-2">Discounted Price</td>
                <td className="px-4 py-2 text-right">{(initialDiscountedPrice === 0) ? "NA" : `${initialDiscountedPrice}`}</td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="px-4 py-2">Enter Additional Discount %</td>
                <td className="px-4 py-2 text-right">
                <input 
                  onChange={(e) => setAdditionalDiscountPercent(e.target.value)} 
                  className="border border-gray-600 w-2/5 rounded-lg p-2" 
                  type="number"
                  min={0} max={100}
                  placeholder={additionalDiscountPercent}/>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="px-4 py-2">Final Discounted Price</td>
                <td className="px-4 py-2 text-right">{(finalDiscountedPrice === 0) ? "NA" : `${finalDiscountedPrice}`}</td>
              </tr>
              <tr>
                <td></td>
                <td className="flex flex-row justify-end">
                <button
                  onClick={handleConfirmOrder}
                  className="text-lg relative group mr-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 font-semibold rounded-md transition flex items-center gap-1"
                  >
                  <div>{(status === "loading") ? "Updating" : "Update Order"}</div>
                </button>
                <button onClick={handleCancel} className="px-5 py-3 mr-8 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400">
                  Cancel
                </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default EditOrderCard