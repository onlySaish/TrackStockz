import React from 'react'
import { selectCustomerActiveContent } from './customerSlice';
import DisplayCustomers from './components/DisplayCustomers'
import { useAppSelector } from '../../../../hooks';
import AddCustomerCard from './components/AddCustomerCard';
import EditCustomerCard from './components/EditCustomerCard';
// import Loader from '../../../Loader';
// import Popup from '../../../Popup';

function Customers(): React.JSX.Element {
  const activeContent = useAppSelector(selectCustomerActiveContent);
  return (
    <div className='py-10 lg:py-4 xl:py-10 px-4 h-full w-full'>
    {/* <Popup/>
    <Loader/> */}
    {activeContent === 'Display' && <DisplayCustomers/>}
    {activeContent === 'AddCustomer' && <AddCustomerCard/>}
    {activeContent === 'EditCustomer' && <EditCustomerCard/>}

    {/* {activeContent === 'ViewCustomerOrders' && <DisplayCustomers/>} */}
    </div>
  )
}

export default Customers