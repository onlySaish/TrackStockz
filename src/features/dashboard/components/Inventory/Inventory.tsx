import React from 'react'
import { selectInventoryActiveContent } from './inventorySlice';
import DisplayProducts from './components/DisplayProducts'
import AddProductCard from './components/AddProductCard'
import EditProductCard from './components/EditProductCard';
import { useAppSelector } from '../../../../hooks';

function Inventory(): React.JSX.Element {
  const activeContent = useAppSelector(selectInventoryActiveContent);
  return (
    <div className='py-10 lg:py-4 xl:py-10 px-4 h-full w-full'>
      {activeContent === 'Display' && <DisplayProducts/>}
      {activeContent === 'AddProduct' && <AddProductCard/>}
      {activeContent === 'EditProduct' && <EditProductCard/>}
    </div>
  )
}

export default Inventory