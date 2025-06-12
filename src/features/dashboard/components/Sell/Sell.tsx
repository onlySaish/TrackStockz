import React from 'react'
import SelectCustomerCard from './components/SelectCustomerCard'
import SelectProductCard from './components/SelectProductCard'
import OrderSummaryCard from './components/OrderSummaryCard'
import PaymentCard from './components/PaymentCard'

function Sell(): React.JSX.Element {
  return (
    <div className='py-2 px-2 md:px-4 lg:py-4 xl:py-10 h-full max-w-screen'>
      <SelectCustomerCard/>
      <SelectProductCard/>
      <OrderSummaryCard/>
      <PaymentCard/>
    </div>
  )
}

export default Sell