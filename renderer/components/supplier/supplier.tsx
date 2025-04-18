import React from 'react'
import Addsupplier from './add-supplier'
import Getsupplier from './get-supplier'

const SupplierPage = () => {
  return (
    <div>
    <div className='flex justify-between items-center w-full pb-2'>
       <h2 className='text-xl font-bold text-secondary'>Supplier</h2>
       <Addsupplier/>
      </div>
      <Getsupplier/>
    </div>
  )
}

export default SupplierPage