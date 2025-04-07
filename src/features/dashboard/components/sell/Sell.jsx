import React from 'react'
import SelectCustomerCard from './components/SelectCustomerCard'
import SelectProductCard from './components/SelectProductCard'
import PaymentCard from './components/PaymentCard'
import OrderSummaryCard from './components/OrderSummaryCard'

function Sell() {
  return (
    <div className='p-6'>
      <SelectCustomerCard/>
      <SelectProductCard/>
      <OrderSummaryCard/>
      <PaymentCard/>
    </div>
  )
}

export default Sell