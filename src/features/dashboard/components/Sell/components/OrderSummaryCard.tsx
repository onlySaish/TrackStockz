import { useRef, useState } from "react";
import { motion } from 'framer-motion';
import { selectAllProducts } from "../../Inventory/inventorySlice";
import { removeSelectedItem, selectOrder, showPopup5, updateOrderItems } from "../sellSlice";
import { useAppDispatch, useAppSelector } from "../../../../../hooks";
// import type { SelectProduct } from "../../../dashboardTypes";`

type FinalProduct = {
  _id: string;
  coverImg: string;
  name: string;
  discountPercent: number;
  price: { price: number }[];
  availableQuantity: number;
  quantity: number;
};

const OrderSummaryCard = () => {
  const dispatch = useAppDispatch();
  const { products = [] } = useAppSelector(selectAllProducts);
  const { items = [] } = useAppSelector(selectOrder);

  const selectedProductIds = items.map((prod) => prod.product);

  const totalProducts = products.filter((product) =>
    selectedProductIds.includes(product._id)
  );

  const updatedTotalProducts = totalProducts.map((product) => {
    const { quantity, ...rest } = product;
    return { ...rest, availableQuantity: quantity };
  });

  const mergeAndKeepKeys = (
    array1: any[],
    array2: any[],
    keysToKeep: string[],
    keyToAdd: string
  ): FinalProduct[] => {
    const map = new Map<string, number>(
      array2.map((item: any) => [item.product, item[keyToAdd]])
    );

    return array1.map((product: any) => {
      const newObj: any = keysToKeep.reduce((acc: any, key: string) => {
        if (key in product) {
          acc[key] = product[key];
        }
        return acc;
      }, {});

      if (map.has(product._id)) {
        newObj[keyToAdd] = map.get(product._id);
      }

      return newObj as FinalProduct;
    });
  };

  const keysToKeep = ['_id', 'coverImg', 'name', 'discountPercent', 'price', 'availableQuantity'];
  const keyToAdd = 'quantity';

  const finalProducts = mergeAndKeepKeys(updatedTotalProducts, items, keysToKeep, keyToAdd);

  const [showInnerComponent, setShowInnerComponent] = useState(false);

  const handleInnerComponent = () => {
    setShowInnerComponent((prev) => !prev);
  };

  const handleProductDelete = async (productId: string) => {
    dispatch(removeSelectedItem(productId));
    dispatch(showPopup5({
      message: "Product Removed From Cart",
      duration: 3000,
      type: "success",
    }));
  };

  const quantityRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleUpdateProduct = async (productId: string) => {
    const quantity = quantityRefs.current[productId]?.value;
    if (quantity !== undefined) {
      dispatch(updateOrderItems({ productId, quantity: Number(quantity) }));
      dispatch(showPopup5({
        message: "Product Updated",
        duration: 3000,
        type: "success",
      }));
    }
  };

  return (
    <div>
      <div
        className="flex items-center justify-between px-10 py-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md h-20 mx-auto 
        border border-gray-800 bg-clip-padding hover:shadow-3xl mb-4 cursor-pointer"
        onClick={handleInnerComponent}
      >
        <div className="text-3xl font-bold text-white">Order Summary</div>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <div className="w-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 items-center shadow-2xl rounded-md border border-gray-900 bg-clip-padding py-4 mb-4">
          <div className="w-full overflow-y-hidden overflow-x-auto rounded-sm shadow-lg md:px-6">
            <table className="w-11/12 bg-gray-800 text-white rounded-sm min-w-[700px] md:min-w-full">
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
                {finalProducts.length > 0 ? (
                  finalProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                      <td className="px-4 py-2">
                        <div
                          className="bg-cover bg-center size-14 rounded-full"
                          style={{ backgroundImage: `url(${product.coverImg})` }}
                        ></div>
                      </td>
                      <td className="px-4 py-2 capitalize">{product.name}</td>
                      <td className="px-4 py-2">
                        {product.price[0].price - ((product.discountPercent / 100) * product.price[0].price)}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          className="border border-gray-600 bg-gray-800 w-2/5 rounded-lg p-2"
                          type="number"
                          min={1}
                          max={product.availableQuantity}
                          placeholder={product.quantity.toString()}
                          ref={(el) => { quantityRefs.current[product._id] = el; }}
                        />
                      </td>
                      <td>
                        <div className="flex flex-row justify-start py-5 gap-4">
                          <button
                            onClick={() => handleUpdateProduct(product._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleProductDelete(product._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                          >
                            Delete
                          </button>
                        </div>
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
      </motion.div>
    </div>
  );
};

export default OrderSummaryCard;
