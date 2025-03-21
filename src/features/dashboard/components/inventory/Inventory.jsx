import React from 'react'
import DisplayProducts from './components/DisplayProducts'
import AddProductCard from './components/AddProductCard'
import { useSelector } from 'react-redux';
import { selectInventoryActiveContent } from './inventorySlice';
import EditProductCard from './components/EditProductCard';

function Inventory() {
  const activeContent = useSelector(selectInventoryActiveContent);
  return (
    <>
    {activeContent === 'Display' && <DisplayProducts/>}
    {activeContent === 'AddProduct' && <AddProductCard/>}
    {activeContent === 'EditProduct' && <EditProductCard/>}
    </>
  )
}

export default Inventory