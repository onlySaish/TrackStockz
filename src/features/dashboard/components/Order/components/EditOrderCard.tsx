import React, { useEffect, useRef, useState } from 'react'
import { editOrder, selectActiveOrder, selectStatus5, setOrderActiveContent, showPopup6 } from '../orderSlice';
import {
  fetchAllProducts,
  selectAllProducts,
} from "../../Inventory/inventorySlice.js";
import { getAllCategories } from "../../Inventory/inventoryApi.js";
import { useAppDispatch, useAppSelector } from '../../../../../hooks.js';
import { selectActiveOrganizationId, selectOrganizationStatus } from "../../../../organization/organizationSlice";
import type { OrderProductDetails, Product, ProductDetails, SelectProduct } from '../../../dashboardTypes.js';


export interface UpdatedProductDetailsInterface extends Omit<ProductDetails, "quantity"> {
  availableQuantity: number;
}

interface finalOrderInterface extends ProductDetails {
  availableQuantity: number;
}

const EditOrderCard = () => {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectActiveOrder);
  const status = useAppSelector(selectStatus5);
  if (!order) return;

  const productDetails = order.productDetails;
  const updatedProductDetails: UpdatedProductDetailsInterface[] = productDetails.map(product => {
    const { quantity, ...rest } = product;
    return { ...rest, availableQuantity: quantity };
  });
  const productQuantityArray = order.products;

  const mergeAndKeepKeys = (
    array1: UpdatedProductDetailsInterface[],
    array2: OrderProductDetails[],
    keysToKeep: string[],
    keyToAdd: string
  ): finalOrderInterface[] => {
    const map = new Map(array2.map(item => [item.product, item[keyToAdd as keyof OrderProductDetails]]));

    return array1.map(product => {
      const newObj: any = keysToKeep.reduce<{ [key: string]: any }>((acc, key) => {
        if (key in product) {
          acc[key] = product[key as keyof UpdatedProductDetailsInterface];
        }
        return acc;
      }, {});

      if (map.has(product._id)) {
        newObj[keyToAdd] = map.get(product._id);
      } else {
        newObj[keyToAdd] = 0;
      }

      // Ensure all required properties exist
      return {
        _id: newObj._id,
        coverImg: newObj.coverImg,
        name: newObj.name,
        discountPercent: newObj.discountPercent,
        price: newObj.price,
        availableQuantity: newObj.availableQuantity,
        quantity: newObj.quantity,
      } as finalOrderInterface;
    });
  };

  const keysToKeep = ['_id', 'coverImg', 'name', 'discountPercent', 'price', 'availableQuantity'];
  const keyToAdd = 'quantity';

  let finalOrder: finalOrderInterface[] = mergeAndKeepKeys(updatedProductDetails, productQuantityArray, keysToKeep, keyToAdd) || [];
  const [OrderedProducts, setOrderedProducts] = useState<finalOrderInterface[]>(finalOrder);

  const quantityRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const handleUpdateProduct = async (productId: string) => {
    const quantity = quantityRefs.current[productId]?.value;

    if (quantity !== undefined) {
      setOrderedProducts(
        OrderedProducts.map((order: finalOrderInterface) =>
          order._id === productId
            ? { ...order, quantity: Number(quantity) }
            : order
        )
      );
      dispatch(showPopup6({
        message: "Product Updated",
        duration: 3000,
        type: "success",
        visible: true
      }));
    }

  }

  const handleProductDelete = async (productId: string) => {
    setOrderedProducts(
      OrderedProducts.filter((order) => order._id !== productId)
    )
    dispatch(showPopup6({
      message: "Product Deleted",
      duration: 3000,
      type: "success",
      visible: true
    }));
  };

  const { products, totalPages, currentPage } = useAppSelector(selectAllProducts);
  let allProducts: Product[] = products || [];
  const allProductsWithSelectedQuantity: SelectProduct[] = allProducts.map(product => ({
    ...product,
    selectedQuantity: 0,
  }));

  const updatedAllProducts: SelectProduct[] = allProductsWithSelectedQuantity.filter(item1 =>
    !OrderedProducts.some((item2: finalOrderInterface) => item1._id === item2._id)
  );

  const [timeActive, setTimeActive] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);

  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [page, setPage] = useState(1);

  const activeOrganizationId = useAppSelector(selectActiveOrganizationId);
  const organizationStatus = useAppSelector(selectOrganizationStatus);

  useEffect(() => {
    if (organizationStatus === 'loading' || organizationStatus === 'idle') return;

    if (!activeOrganizationId) {
      dispatch(showPopup6({
        message: "Please Join or Create an Organization first.",
        type: "error",
        visible: true,
        duration: 3000
      }));
      return;
    }
    dispatch(fetchAllProducts({ page, sort, order: sortOrder, search, isDeleted: false, category, status: "Active" }));
  }, [dispatch, page, sort, sortOrder, search, category, activeOrganizationId, organizationStatus]);

  useEffect(() => {
    if (organizationStatus === 'loading' || organizationStatus === 'idle') return;
    if (!activeOrganizationId) return;
    const getter = async () => {
      const result = await getAllCategories();
      setCategories(result);
    }
    getter();
  }, [dispatch, activeOrganizationId, organizationStatus]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "createdAt") {
      setTimeActive(true);
    } else {
      setTimeActive(false);
    }
    setSort(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleProductSelect = async (product: SelectProduct) => {
    if (product.selectedQuantity === 0) {
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
      visible: true
    }));
  };

  const [additionalDiscountPercent, setAdditionalDiscountPercent] = useState(order.additionalDiscountPercent);
  let totalPrice = 0;
  let initialDiscountedPrice = 0;

  for (const item of OrderedProducts) {
    let itemUnitPrice = 0;
    if (Array.isArray(item.price) && item.price.length > 0) {
      itemUnitPrice = item.price[0].price;
    } else if (typeof item.price === 'number') {
      itemUnitPrice = item.price;
    }
    const itemTotalPrice = item.quantity * itemUnitPrice;
    const itemDiscount = (item.discountPercent / 100) * itemTotalPrice;
    const itemDiscountedPrice = itemTotalPrice - itemDiscount;

    totalPrice += itemTotalPrice;
    initialDiscountedPrice += itemDiscountedPrice;
  }

  const finalDiscountedPrice = initialDiscountedPrice - ((additionalDiscountPercent / 100) * initialDiscountedPrice);

  const handleConfirmOrder = () => {
    const sendingOrder = OrderedProducts.map(({ _id, quantity }) => ({ _id, quantity }));
    dispatch(editOrder({ orderId: order._id, products: sendingOrder, additionalDiscountPercent }));
  }

  const handleCancel = () => {
    dispatch(setOrderActiveContent("DisplayOrders"));
  };
  return (
    <div className='flex flex-col gap-4 max-w-screen px-5'>   {/* Show Orders */}
      <div className="w-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 items-center shadow-2xl rounded-md border border-gray-800 bg-clip-padding p-4 lg:px-10">
        <div className='flex flex-row justify-between items-center w-full mb-2'>
          <div className='text-2xl lg:text-3xl font-bold ml-8 text-white'>Current Order</div>
          <div className="capitalize px-5 py-3 mr-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md cursor-default">Selected Products: {OrderedProducts.length}</div>
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden rounded-sm">
          <table className="w-full bg-gray-800 text-white rounded-sm min-w-[800px] md:min-w-full">
            <thead className="bg-gray-700">
              <tr>
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
                  <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                    <td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full md:mx-auto" style={{ backgroundImage: `url(${product.coverImg})` }}></div></td>
                    <td className="px-4 py-2 capitalize">{product.name}</td>
                    <td className="px-4 py-2">
                      {Array.isArray(product.price)
                        ? (product.price[0]?.price ?? 0) - ((product.discountPercent / 100) * (product.price[0]?.price ?? 0))
                        : (typeof product.price === 'number'
                          ? product.price - ((product.discountPercent / 100) * product.price)
                          : "NA")}
                    </td>
                    <td className="px-4 py-2">
                      <input
                        className="border border-gray-600 bg-gray-800 w-4/5 rounded-md p-2"
                        type="number"
                        min={1}
                        max={product.availableQuantity}
                        placeholder={product.quantity?.toString()}
                        ref={el => { quantityRefs.current[product._id] = el; }}
                      />
                    </td>
                    <td className="flex flex-row justify-center py-5 gap-3">
                      <button
                        onClick={() => handleUpdateProduct(product._id)}
                        className=" group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleProductDelete(product._id)}
                        className=" group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show other Products */}
      <div className="w-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 items-center shadow-2xl rounded-md border border-gray-800 bg-clip-padding px-3 py-4">
        <div className='text-2xl lg:text-3xl font-semibold self-start ml-12 mb-2 text-white'>
          Add Products
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-3 items-center mb-4 self-start px-12 text-white">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
            value={search}
            onChange={handleSearch}
          />
          <div className="flex flex-wrap lg:flex-nowrap gap-4 justify-center items-center">
            <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
              <option value="createdAt">Time</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
            <select value={sortOrder} onChange={handleOrderChange} className="border px-3 py-2 rounded-md bg-gray-800 border-gray-600">
              <option value="asc">{(timeActive) ? "Oldest" : "Ascending"}</option>
              <option value="desc">{(timeActive) ? "Newest" : "Descending"}</option>
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
        </div>

        {status === "loading" ? <p className="text-gray-600">Loading...</p> : (
          <div className="w-full overflow-x-auto overflow-y-hidden rounded-sm lg:px-10">
            <table className="w-full bg-gray-800 text-white rounded-sm min-w-[1000px] md:min-w-full">
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
                {updatedAllProducts.length > 0 ? (
                  updatedAllProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                      <td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{ backgroundImage: `url(${product.coverImg})` }}></div></td>
                      <td className="px-4 py-2 capitalize">{product.name}</td>
                      <td className="px-4 py-2">{product.price[0]?.price}</td>
                      <td className="px-4 py-2 capitalize">{product.category}</td>
                      <td className="px-4 py-2">{product.quantity}</td>
                      <td className="px-4 py-2">{product.discountPercent}%</td>
                      <td className="px-4 py-2">{(product.price[0].price) - ((product.discountPercent / 100) * (product.price[0].price))}</td>
                      <td className="px-4 py-2">
                        <input
                          onChange={(e) => product.selectedQuantity = Number(e.target.value)}
                          className="border border-gray-600 bg-gray-800 w-4/5 rounded-md p-2"
                          type="number"
                          min={0} max={product.quantity}
                          placeholder="0" />
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
                    <td colSpan={11} className="text-center py-4">
                      No products left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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

      {/* Payment Details */}
      <div className="w-full flex flex-col bg-gray-800 items-center shadow-2xl rounded-md border border-gray-900 bg-clip-padding py-4">
        <table className="min-w-full bg-white border-gray-300">
          <tbody className='bg-gray-800 text-white'>
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
                  className="border border-gray-600 bg-gray-800 w-1/5 rounded-md p-2"
                  type="number"
                  min={0} max={100}
                  placeholder={additionalDiscountPercent.toString()} />
              </td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="px-4 py-2">Final Discounted Price</td>
              <td className="px-4 py-2 text-right">{(finalDiscountedPrice === 0) ? "NA" : `${finalDiscountedPrice}`}</td>
            </tr>
            <tr>
              <td></td>
              <td className="flex flex-row justify-end">
                <button
                  onClick={handleConfirmOrder}
                  className="text-lg relative group mr-8 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 md:px-5 md:py-3 font-semibold rounded-md transition flex items-center gap-1"
                >
                  <div>{(status === "loading") ? "Updating" : "Update Order"}</div>
                </button>
                <button onClick={handleCancel} className="px-3 py-2 md:px-5 md:py-3 mr-8 bg-gray-700 text-white rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-500">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EditOrderCard