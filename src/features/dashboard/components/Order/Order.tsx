import React from 'react'
import { selectOrderActiveContent } from './orderSlice';
import { useSelector } from 'react-redux';
import DisplayOrders from './components/DisplayOrders'
import ViewOrderCard from './components/ViewOrderCard';
import EditOrderCard from './components/EditOrderCard';

function Order(): React.JSX.Element {
  const activeContent = useSelector(selectOrderActiveContent);
  return (
    <div className='py-10 lg:py-4 xl:py-10 px-4 h-full w-full'>
    {activeContent === 'DisplayOrders' && <DisplayOrders/>}
    {activeContent === 'ViewOrder' && <ViewOrderCard/>}
    {activeContent === 'EditOrder' && <EditOrderCard/>}
    </div>
  )
}

export default Order