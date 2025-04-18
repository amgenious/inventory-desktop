import React from 'react'
import Addcustomer from './add-customer'
import Getcustomer from './get-customer'

const CustomerPage = () => {
  return (
    <div>
    <div className='flex justify-between items-center w-full pb-2'>
       <h2 className='text-xl font-bold text-secondary'>Customer</h2>
       <Addcustomer/>
      </div>
      <Getcustomer/>
    </div>
  )
}

export default CustomerPage