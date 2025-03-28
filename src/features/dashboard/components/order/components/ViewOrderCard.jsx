import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveOrder, selectStatus5, setOrderActiveContent, showPopup6 } from "../orderSlice";
import { jsPDF } from "jspdf";
import {  applyPlugin  } from "jspdf-autotable";

const ViewOrderCard = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectActiveOrder);
  const [order, setOrder] = useState(orders)
  const pageStatus = useSelector(selectStatus5);
  
  const updateProductDetails = (productDetails, products) => {
    return productDetails.map(product => {
      const matchingProduct = products.find(p => p.product === product._id);
      if (matchingProduct) {
        return {
          ...product,
          price: matchingProduct.price,
          quantity: matchingProduct.quantity
        };
      }
      return product;
    });
  };  

  const updatedProductDetails = updateProductDetails(order.productDetails, order.products);
  useEffect(() => {
    if (order) {
      // Updating the state correctly
      setOrder(prevOrder => ({
        ...prevOrder,
        productDetails: updatedProductDetails
      }));
    }
  }, [order.products]);

  const generateOrderPDF = () => {
  applyPlugin(jsPDF)
  const doc = new jsPDF();

  // **Title Styling**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ORDER INVOICE", 105, 20, { align: "center" });

  // **Order Details**
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order._id}`, 14, 35);
  doc.text(`Status: ${order.status}`, 14, 42);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 49);
  doc.text(`Payment Method: ${order.paymentMethod}`, 14, 56);

  // **Customer Details**
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details:", 14, 66);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${order.customerDetails.firstName} ${order.customerDetails.lastName}`, 14, 74);
  doc.text(`Email: ${order.customerDetails.email}`, 14, 81);
  doc.text(`Phone: ${order.customerDetails.phoneNumber}`, 14, 88);
  doc.text(
    `Address: ${order.customerDetails.address.street}, ${order.customerDetails.address.city}, ${order.customerDetails.address.state}, ${order.customerDetails.address.zipCode}, ${order.customerDetails.address.country}`,
    14,
    95,
    { maxWidth: 180 }
  );

  // **Table - Products Ordered**
  console.log(order.productDetails);

  doc.autoTable({
    startY: 110,
    head: [["Product", "Quantity", "Unit Price", "Total"]],
    body: order.productDetails.map((product) => [
        product.name, 
        product.quantity, 
        `$${product.price}`, 
        `$${product.quantity * product.price}`
    ]),
    styles: { fontSize: 11, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontSize: 12, fontStyle: "bold" },
    columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: "center" },
        2: { cellWidth: 40, halign: "center" },
        3: { cellWidth: 40, halign: "center" },
    },
  });

  // **Summary Section**
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, finalY);
  doc.setFont("helvetica", "normal");

  doc.text(`Total Price:`, 120, finalY);
  doc.text(`$${order.totalPrice.toFixed(2)}`, 180, finalY, { align: "right" });

  doc.text(`Discount (${order.additionalDiscountPercent}%):`, 120, finalY + 8);
  doc.text(`-$${((order.totalPrice * order.additionalDiscountPercent) / 100).toFixed(2)}`, 180, finalY + 8, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text(`Final Price:`, 120, finalY + 16);
  doc.text(`$${order.finalDiscountedPrice.toFixed(2)}`, 180, finalY + 16, { align: "right" });

  // **Footer**
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for shopping with us!", 105, finalY + 30, { align: "center" });

  // **Save and Download PDF**
  doc.save(`Order_${order._id}.pdf`);
  dispatch(showPopup6({
    message: "Transcript Downloaded",
    duration: 3000,
    type: "success",
  }));
  };
  
  
  const handleCancel = () => {
    dispatch(setOrderActiveContent("DisplayOrders"));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Order Details</h2>
      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> :(
        <>
      {/* Order Info */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
        <p className="text-gray-700"><strong>Order ID:</strong> {order._id}</p>
        <p className="text-gray-700"><strong>Status:</strong> <span className="text-blue-600">{order.status}</span></p>
        <p className="text-gray-700"><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p className="text-gray-700"><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
      </div>

      {/* Customer Details */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-3 text-gray-700 border-b pb-2">Customer Information</h3>
        <p><strong>Name:</strong> {order.customerDetails.firstName} {order.customerDetails.lastName}</p>
        <p><strong>Email:</strong> <span className="text-blue-500">{order.customerDetails.email}</span></p>
        <p><strong>Phone:</strong> {order.customerDetails.phoneNumber}</p>
        <p><strong>Company:</strong> {order.customerDetails.companyName}</p>
      </div>

      {/* Address Details */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Shipping Address</h3>
        <p>{order.customerDetails.address.street}, {order.customerDetails.address.city}, {order.customerDetails.address.state}, {order.customerDetails.address.zipCode}, {order.customerDetails.address.country}</p>
      </div>

      {/* Order Summary */}
      <div className="mb-6 bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Order Summary</h3>
        <p><strong>Total Price:</strong> <span className="text-green-600 font-bold">${order.totalPrice.toFixed(2)}</span></p>
        <p><strong>Initial Discounted Price:</strong> ${order.initialDiscountedPrice.toFixed(2)}</p>
        <p><strong>Final Discounted Price:</strong> ${order.finalDiscountedPrice.toFixed(2)}</p>
        <p><strong>Additional Discount:</strong> {order.additionalDiscountPercent}%</p>
        <p><strong>Payment Method:</strong> <span className="font-medium text-indigo-600">{order.paymentMethod}</span></p>
      </div>

      {/* Products Ordered */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">Ordered Products</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {updatedProductDetails.map((product) => (
            <li key={product._id} className="p-4 border rounded-lg shadow-md flex items-center gap-4 bg-gray-50">
              <img src={product.coverImg} alt={product.name} className="w-20 h-20 object-cover rounded-md shadow" />
              <div>
                <p className="text-lg font-medium">{product.name}</p>
                <p>Price per unit: <span className="">${product.price.toFixed(2)}</span></p>
                <p>Discount: <span className="text-red-500">{product.discountPercent}%</span></p>
                <p>Final Price: <span className="">${product.price - ((product.discountPercent/100) * product.price)}</span></p>
                <p>Quantity: <span className="font-semibold">{product.quantity}</span></p>
                <p>Total: <span className="font-semibold text-green-600">{(product.quantity) * (product.price - ((product.discountPercent/100) * product.price))}</span></p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={generateOrderPDF}
          className="text-lg relative group mr-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 font-semibold rounded-md transition flex items-center gap-1"
          >
          <div>Download Transcript</div>
        </button>

        <button onClick={handleCancel} className="px-5 py-3 mr-8 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-400">
          Back
        </button>
      </div>
      </>
      )}
    </div>
  );
};

export default ViewOrderCard;
