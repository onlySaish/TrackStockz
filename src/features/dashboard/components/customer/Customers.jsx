import React from 'react'
import { useSelector } from 'react-redux'
import { selectCustomerActiveContent } from './customerSlice';
import Loader from '../../../Loader';
import DisplayCustomers from './components/DisplayCustomers'
import EditCustomerCard from './components/EditCustomerCard';
import Popup from '../../../Popup';
import AddCustomerCard from './components/AddCustomerCard';

function Customers() {
  const activeContent = useSelector(selectCustomerActiveContent);
  return (
    <>
    <Popup/>
    <Loader/>
    {activeContent === 'Display' && <DisplayCustomers/>}
    {activeContent === 'EditCustomer' && <EditCustomerCard/>}
    {activeContent === 'AddCustomer' && <AddCustomerCard/>}

    {/* {activeContent === 'ViewCustomerOrders' && <DisplayCustomers/>} */}
    </>
  )
}

export default Customers