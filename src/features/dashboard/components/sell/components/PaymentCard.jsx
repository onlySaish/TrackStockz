import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { addOrder, selectOrder, selectStatus4 } from "../sellSlice";
import { selectAllProducts } from "../../inventory/inventorySlice";

const PaymentCard = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus4);
  const { products } = useSelector(selectAllProducts);
  const [additionalDiscountPercent, setAdditionalDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  let allProducts = products || [];

  const {customerId,items} = useSelector(selectOrder);
  const selectedItems = items || [];   
  const selectedProductIds = selectedItems.map((prod) => prod.product);

  const totalProducts = allProducts.filter(
    (product) => {
      return selectedProductIds.includes(product._id);
    }
  )

  const totalPrice = selectedItems.reduce((acc, item) => {
    const product = totalProducts.find((prod) => prod._id === item.product);
    if (product) {
      return acc + product.price[0].price * item.quantity;
    }
    return acc;
  }, 0);

  const initialDiscountedPrice = selectedItems.reduce((acc, item) => {
    const product = totalProducts.find((prod) => prod._id === item.product);
    if (product) {
      return acc + (product.price[0].price - ((product.discountPercent/100) * product.price[0].price)) * item.quantity;
    }
    return acc;
  }, 0);

  const finalDiscountedPrice = initialDiscountedPrice - ((additionalDiscountPercent/100) * initialDiscountedPrice);

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value)
  }

  const [showInnerComponent, setShowInnerComponent] = useState(false);
  const handleInnerComponent = () => {
    setShowInnerComponent((prev) => !prev);
  };

  const finalOrder = {
    customerId,
    products: items,
    totalPrice,
    initialDiscountedPrice,
    additionalDiscountPercent,
    finalDiscountedPrice,
    paymentMethod
  };

  const handleConfirmOrder = () => {
    dispatch(addOrder(finalOrder));
  }
  
  return (
    <div>
      <div className="flex items-center justify-between px-10 py-8 bg-white rounded-3xl h-20 mx-auto 
      border-4 bg-clip-padding transition-all duration-300 transform hover:scale-105 
      hover:shadow-3xl mb-4 cursor-pointer"
      onClick={handleInnerComponent}
      >
        <div className="text-3xl font-bold text-gray-800">Payment</div>

      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
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
                  placeholder="0"/>
                </td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="px-4 py-2">Final Discounted Price</td>
                <td className="px-4 py-2 text-right">{(finalDiscountedPrice === 0) ? "NA" : `${finalDiscountedPrice}`}</td>
              </tr>
              <tr className="hover:bg-gray-100">
                <td className="px-4 py-2">Payment Method</td>
                <td className="px-4 py-2 text-right">
                <select value={paymentMethod} onChange={handlePayment} className="border px-3 py-2 rounded-md">
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                </select>
                </td> 
              </tr>
              <tr>
                <td></td>
                <td className="flex flex-row justify-end">
                <button
                  onClick={handleConfirmOrder}
                  className="text-lg relative group mr-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 font-semibold rounded-md transition flex items-center gap-1"
                  >
                  <div>{(status === "loading") ? "Confirming" : "Confirm Order"}</div>
                </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentCard