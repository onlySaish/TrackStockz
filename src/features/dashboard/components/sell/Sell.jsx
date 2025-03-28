import React from 'react'
import SelectCustomerCard from './components/SelectCustomerCard'
import SelectProductCard from './components/selectProductCard'
import PaymentCard from './components/PaymentCard'
import OrderSummaryCard from './components/OrderSummaryCard'

function Sell() {
  return (
    <>
      <SelectCustomerCard/>
      <SelectProductCard/>
      <OrderSummaryCard/>
      <PaymentCard/>
    </>
  )
}

export default Sell