import { useEffect, useState } from "react";
import { selectActiveOrder, selectStatus5, setOrderActiveContent, showPopup6 } from "../orderSlice";
import { jsPDF } from "jspdf";
import {  applyPlugin  } from "jspdf-autotable";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
import type { Order, OrderProductDetails, ProductDetails } from "../../../dashboardTypes";

const ViewOrderCard = () => {
  const dispatch = useAppDispatch();
  const getOrder = useAppSelector(selectActiveOrder);
  const [order, setOrder] = useState<Order | null>(getOrder);
  const pageStatus = useAppSelector(selectStatus5);
  if(!order) return;
  
  const updateProductDetails = (productDetails: ProductDetails[], products: OrderProductDetails[]) => {
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
      setOrder((prevOrder) =>
      prevOrder
        ? {
            ...prevOrder,
            productDetails: updatedProductDetails,
          }
        : null
      );
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

  doc.autoTable({       //Error
    startY: 110,
    head: [["Product", "Quantity", "Unit Price", "Total"]],
    body: order.productDetails.map((product) => [
        product.name, 
        product.quantity, 
        `$${product.price}`, 
        `$${product.quantity * Number(product.price)}`
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
    visible: true
  }));
  };
  
  
  const handleCancel = () => {
    dispatch(setOrderActiveContent("DisplayOrders"));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-800 shadow-lg rounded-2xl border border-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">Order Details</h2>
      {pageStatus === "loading" ? <p className="text-gray-600">Loading...</p> :(
        <>
      {/* Order Info */}
      <div className="bg-gray-800 p-4 rounded-md shadow-sm mb-6 hover:bg-gray-900 hover:border-l-4 border-blue-500">
        <p className="text-white"><strong>Order ID:</strong> {order._id}</p>
        <p className="text-white"><strong>Status:</strong> <span className="text-indigo-400">{order.status}</span></p>
        <p className="text-white"><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p className="text-white"><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
      </div>

      {/* Customer Details */}
      <div className="bg-gray-800 p-4 rounded-md shadow-sm mb-6 hover:bg-gray-900 hover:border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold mb-3 text-white border-b pb-2">Customer Information</h3>
        <p className="text-white"><strong>Name:</strong> {order.customerDetails.firstName} {order.customerDetails.lastName}</p>
        <p className="text-white"><strong>Email:</strong> <span className="text-indigo-500">{order.customerDetails.email}</span></p>
        <p className="text-white"><strong>Phone:</strong> {order.customerDetails.phoneNumber}</p>
        <p className="text-white"><strong>Company:</strong> {order.customerDetails.companyName}</p>
      </div>

      {/* Address Details */}
      <div className="bg-gray-800 p-4 rounded-md shadow-sm mb-6 hover:bg-gray-900 hover:border-l-4 border-blue-500">
        <h3 className="text-xl font-semibold mb-2 text-white">Shipping Address</h3>
        <p className="text-white">{order.customerDetails.address.street}, {order.customerDetails.address.city}, {order.customerDetails.address.state}, {order.customerDetails.address.zipCode}, {order.customerDetails.address.country}</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-800 p-4 rounded-md shadow-sm mb-6 hover:bg-gray-900 hover:border-l-4 border-blue-500">
        <h3 className="text-xl font-semibold mb-2 text-white">Order Summary</h3>
        <p className="text-white"><strong>Total Price:</strong> <span className="text-green-600 font-bold">${order.totalPrice.toFixed(2)}</span></p>
        <p className="text-white"><strong>Initial Discounted Price:</strong> ${order.initialDiscountedPrice.toFixed(2)}</p>
        <p className="text-white"><strong>Final Discounted Price:</strong> ${order.finalDiscountedPrice.toFixed(2)}</p>
        <p className="text-white"><strong>Additional Discount:</strong> {order.additionalDiscountPercent}%</p>
        <p className="text-white"><strong>Payment Method:</strong> <span className="font-medium text-indigo-600">{order.paymentMethod}</span></p>
      </div>

      {/* Products Ordered */}
      <div className="bg-gray-800 p-4 rounded-md shadow-sm mb-6 hover:bg-gray-900 hover:border-l-4 border-blue-500">
        <h3 className="text-xl font-semibold mb-3 text-white border-b pb-2">Ordered Products</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {updatedProductDetails.map((product) => (
            <li key={product._id} className="p-4 rounded-md shadow-md flex items-center gap-4 bg-gray-800">
              <img src={product.coverImg} alt={product.name} className="w-20 h-20 object-contain rounded-md shadow" />
              <div>
                <p className="text-lg font-medium text-white">{product.name}</p>
                <p className="text-white">Price per unit: <span className="">
                  {typeof product.price === "number" ? `$${product.price.toFixed(2)}` : "N/A"}
                </span></p>
                <p className="text-white">Discount: <span className="text-red-500">{product.discountPercent}%</span></p>
                <p className="text-white">Final Price: <span className="">${Number(product.price) - ((Number(product.discountPercent)/100) * Number(product.price))}</span></p>
                <p className="text-white">Quantity: <span className="font-semibold">{product.quantity}</span></p>
                <p className="text-white">Total: <span className="font-semibold text-green-600">{(product.quantity) * (Number(product.price) - ((product.discountPercent/100) * Number(product.price)))}</span></p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={generateOrderPDF}
          className="text-lg relative group mr-8 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 md:px-5 md:py-3 font-semibold rounded-md transition flex items-center gap-1"
          >
          <div>Download Transcript</div>
        </button>

        <button onClick={handleCancel} className="px-3 py-2 md:px-5 md:py-3 mr-8 bg-gray-700 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-500">
          Back
        </button>
      </div>
      </>
      )}
    </div>
  );
};

export default ViewOrderCard;
