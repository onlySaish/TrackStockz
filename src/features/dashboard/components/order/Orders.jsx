import React from 'react'
import DisplayOrders from './components/DisplayOrders'
import { selectOrderActiveContent } from './orderSlice';
import EditOrderCard from './components/EditOrderCard';
import { useSelector } from 'react-redux';
import ViewOrderCard from './components/ViewOrderCard';

function Orders() {
  const activeContent = useSelector(selectOrderActiveContent);
  return (
    <>
    {activeContent === 'DisplayOrders' && <DisplayOrders/>}
    {activeContent === 'EditOrder' && <EditOrderCard/>}
    {activeContent === 'ViewOrder' && <ViewOrderCard/>}
    </>
  )
}

export default Orders