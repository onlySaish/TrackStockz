import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { selectAllProducts } from "../../inventory/inventorySlice";
import { removeSelectedItem, selectOrder, showPopup5, updateOrderItems } from "../sellSlice";

const OrderSummaryCard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector(selectAllProducts);
  let allProducts = products || [];

  const {items} = useSelector(selectOrder);
  const selectedItems = items || [];    
  const selectedProductIds = selectedItems.map((prod) => prod.product);

  const totalProducts = (allProducts.filter(
    (product) => {
      return selectedProductIds.includes(product._id);
    }
  ));

  const updatedTotalProducts = totalProducts.map(product => {
    const { quantity, ...rest } = product;
    return { ...rest, availableQuantity: quantity };
  });

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
  
  const finalProducts = mergeAndKeepKeys(updatedTotalProducts, selectedItems, keysToKeep, keyToAdd) || [];
  
  const [showInnerComponent, setShowInnerComponent] = useState(false);
  const handleInnerComponent = () => {
    setShowInnerComponent((prev) => !prev);
    // console.log(selectedItems);
  };

  const handleProductDelete = async (productId) => {
    dispatch(removeSelectedItem(productId))
    dispatch(showPopup5({
      message: "Product Removed From Cart",
      duration: 3000,
      type: "success",
    }))
  };

  const quantityRefs = useRef({});
  const handleUpdateProduct = async(productId) => {
    const quantity = quantityRefs.current[productId]?.value;
    if (quantity !== undefined) {
      dispatch(updateOrderItems({productId, quantity}));
      dispatch(showPopup5({
        message: "Product Updated",
        duration: 3000,
        type: "success",
      }))
    }
  }

  return (
    <div>
      
      <div className="flex items-center justify-between px-10 py-8 bg-white rounded-3xl h-20 mx-auto 
      border-4 bg-clip-padding transition-all duration-300 transform hover:scale-105 
      hover:shadow-3xl mb-4 cursor-pointer"
      onClick={handleInnerComponent}
      >
        <div className="text-3xl font-bold text-gray-800">Order Summary</div>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <div className="w-full flex flex-col bg-white items-center shadow-2xl rounded-3xl border-4 bg-clip-padding py-4">
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
            {finalProducts.length > 0 ? (
              finalProducts.map((product) => (
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
      </motion.div>
    </div>
  )
}

export default OrderSummaryCard