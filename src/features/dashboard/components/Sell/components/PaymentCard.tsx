import { useState, type ChangeEvent } from "react";
import { motion } from 'framer-motion';
import { addOrder, selectOrder, selectStatus4 } from "../sellSlice";
import { selectAllProducts } from "../../Inventory/inventorySlice";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";

const PaymentCard = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus4);
  const { products } = useAppSelector(selectAllProducts);
  const [additionalDiscountPercent, setAdditionalDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  let allProducts = products || [];

  const {customerId,items} = useAppSelector(selectOrder);
  const selectedItems = items || [];   
  const selectedProductIds = selectedItems.map((prod) => prod.product);

  const totalProducts = allProducts.filter(
    (product) => {
      return selectedProductIds.includes(product._id);
    }
  )

  const totalPrice = selectedItems.reduce((acc, item: any) => {
    const product = totalProducts.find((prod) => prod._id === item.product);
    if (product) {
      return acc + product.price[0].price * item.quantity;
    }
    return acc;
  }, 0);

  const initialDiscountedPrice = selectedItems.reduce((acc, item: any) => {
    const product = totalProducts.find((prod) => prod._id === item.product);
    if (product) {
      return acc + (product.price[0].price - ((product.discountPercent/100) * product.price[0].price)) * item.quantity;
    }
    return acc;
  }, 0);

  const finalDiscountedPrice = initialDiscountedPrice - ((additionalDiscountPercent/100) * initialDiscountedPrice);

  const handlePayment = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
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
      <div className="flex items-center justify-between px-10 py-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md h-20 mx-auto 
      border border-gray-800 bg-clip-padding hover:shadow-3xl mb-4 cursor-pointer"
      onClick={handleInnerComponent}
      >
        <div className="text-3xl font-bold text-white">Payment</div>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <div className="w-full flex flex-col bg-gray-800 items-center shadow-2xl rounded-md border border-gray-900 bg-clip-padding py-4">
          <table className="min-w-full bg-white border-gray-300">
            <tbody className="bg-gray-800 text-white">
              <tr className="hover:bg-gray-900">
                <td className="px-4 py-2">Total Price</td>
                <td className="px-4 py-2 text-right">{(totalPrice === 0) ? "NA" : `${totalPrice}`}</td>
              </tr>
              <tr className="hover:bg-gray-900">
                <td className="px-4 py-2">Discounted Price</td>
                <td className="px-4 py-2 text-right">{(initialDiscountedPrice === 0) ? "NA" : `${initialDiscountedPrice}`}</td>
              </tr>
              <tr className="hover:bg-gray-900">
                <td className="px-4 py-2">Enter Additional Discount %</td>
                <td className="px-4 py-2 text-right">
                <input 
                  onChange={(e) => setAdditionalDiscountPercent(Number(e.target.value))} 
                  className="border border-gray-600 bg-gray-800 w-2/5 rounded-lg p-2" 
                  type="number"
                  min={0} max={100}
                  placeholder="0"/>
                </td>
              </tr>
              <tr className="hover:bg-gray-900">
                <td className="px-4 py-2">Final Discounted Price</td>
                <td className="px-4 py-2 text-right">{(finalDiscountedPrice === 0) ? "NA" : `${finalDiscountedPrice}`}</td>
              </tr>
              <tr className="hover:bg-gray-900">
                <td className="px-4 py-2">Payment Method</td>
                <td className="px-4 py-2 text-right">
                <select value={paymentMethod} onChange={handlePayment} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
                  <option value="">Select</option>
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
                  className="text-lg relative group mr-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 font-semibold rounded-md transition flex items-center gap-1"
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