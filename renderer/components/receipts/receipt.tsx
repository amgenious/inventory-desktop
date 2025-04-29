import React from 'react'
import Addreceipt from './addreceipt'
import Getallreceipt from './getallreceipt'

const ReceiptPage = () => {
  return (
    <div>
     <div className='flex justify-between items-center w-full pb-2'>
       <h2 className='text-xl font-bold text-secondary'>Receipts</h2>
       <Addreceipt />
      </div>
      <Getallreceipt/>
    </div>
  )
}

export default ReceiptPage