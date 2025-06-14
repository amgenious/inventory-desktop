import React from 'react'
import Addreceipt from './addreceipt'
import Getallreceipt from './getallreceipt'
import UploadreceiptcsvPage from './uploadreceipt-csv'

const ReceiptPage = () => {
  return (
    <div>
     <div className='flex justify-between items-center w-full pb-2'>
       <h2 className='text-xl font-bold text-secondary'>Receipts</h2>
       <div className='flex gap-4'>
       <UploadreceiptcsvPage />
       <Addreceipt />
       </div>
      </div>
      <Getallreceipt/>
    </div>
  )
}

export default ReceiptPage