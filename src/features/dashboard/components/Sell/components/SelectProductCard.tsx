import { useEffect, useState, type ChangeEvent } from "react";
import { 
  fetchAllProducts,
  selectAllProducts, 
} from "../../Inventory/inventorySlice.js";
import { getAllCategories } from "../../Inventory/inventoryApi.js";
import { motion } from 'framer-motion';
import { selectOrder, setSelectedItem, showPopup5 } from "../sellSlice.js";
import { useAppDispatch, useAppSelector } from "../../../../../hooks.js";
import type { SelectProduct } from "../../../dashboardTypes.js";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'

const SelectProductCard = () => {
  const dispatch = useAppDispatch();
  const { products, totalPages, currentPage } = useAppSelector(selectAllProducts);
  let allProducts: SelectProduct[] = (products || []).map(product => ({
    ...product,
    selectedQuantity: 0,
  }));

  const {items} = useAppSelector(selectOrder);
  const selectedItems = items || [];

  const [timeActive, setTimeActive] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);

  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<'asc' | 'desc'>("desc");
  const [page, setPage] = useState<number>(1);

  const [showInnerComponent, setShowInnerComponent] = useState<boolean>(false);
  
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  }

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "createdAt"){
      setTimeActive(true);
    }else {
      setTimeActive(false); 
    }
    setSort(e.target.value);
    setPage(1);
  };

  const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as 'asc' | 'desc');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleProductSelect = async (product: SelectProduct) => {
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
      <div className="flex mx-auto w-full items-center justify-between px-5 py-4 text-white bg-gradient-to-br from-gray-800 to-gray-900 rounded-md h-20
      border border-gray-800 bg-clip-padding hover:shadow-3xl mb-4 cursor-pointer"
      onClick={handleInnerComponent}
      >
        <div className="text-2xl font-bold">Select Products</div>
        <div className="capitalize px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md cursor-default">Selected Products: {selectedItems.length}</div>

      </div>

    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: showInnerComponent ? 1 : 0, height: showInnerComponent ? "auto" : 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
    <div className="max-w-screen flex flex-col text-white bg-gradient-to-br from-gray-800 to-gray-900 items-center shadow-2xl rounded-md border border-gray-900 bg-clip-padding py-4">
      <div className="w-full mb-4 flex flex-col md:flex-row gap-3 px-12">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
          value={search}
          onChange={handleSearch}
          />

        <div className="flex gap-4 justify-center items-center">
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
      </div>
      
      <div className="w-full overflow-y-hidden overflow-x-auto rounded-sm shadow-lg lg:px-6">
      <Table className="bg-gray-800 text-white rounded-sm">
        <Thead className="bg-gray-700">
          <Tr>
            <Th className="px-4 py-2">Image</Th>
            <Th className="px-4 py-2">Name</Th>
            <Th className="px-4 py-2">Active Price</Th>
            <Th className="px-4 py-2">Category</Th>
            <Th className="px-4 py-2">Available Quantity</Th>
            <Th className="px-4 py-2">Discount Percent</Th>
            <Th className="px-4 py-2">Discounted Price</Th>
            <Th className="px-4 py-2">Quantity</Th>
            <Th className="px-4 py-2">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <Tr key={product._id} className="border-b border-gray-700 hover:bg-gray-900 transition cursor-pointer text-center">
                <Td className="px-4 py-2"><div className="bg-cover bg-center size-14 rounded-full" style={{backgroundImage: `url(${product.coverImg})`}}></div></Td>
                <Td className="px-4 py-2 capitalize">{product.name}</Td>
                <Td className="px-4 py-2">{product.price[0]?.price}</Td>
                <Td className="px-4 py-2 capitalize">{product.category}</Td>
                <Td className="px-4 py-2">{product.quantity}</Td>
                <Td className="px-4 py-2">{product.discountPercent}%</Td>
                <Td className="px-4 py-2">{(product.price[0].price)-((product.discountPercent/100)*(product.price[0].price))}</Td>
                <Td className="px-4 py-2">
                  <input 
                  onChange={(e) => product.selectedQuantity = Number(e.target.value)} 
                  className="border border-gray-600 bg-gray-800 w-4/5 rounded-md p-2" 
                  type="number"
                  min={0} max={product.quantity}
                  placeholder="0"/>
                </Td>
                <Td className="flex flex-row justify-center py-5">

                <button
                onClick={() => handleProductSelect(product)}
                className="relative group bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                >
                  <div>Select</div>
                </button>

                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={11} className="text-center py-4">
                No products found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      </div>

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