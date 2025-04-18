import React from 'react'
import Addstock from './addstock'
import Getallstock from './getallstock'
import UploadstockcsvPage from './uploadstock-csv'

const StockPage = () => {
  return (
     <div>
            <div className='flex justify-between items-center w-full pb-2'>
           <h2 className='text-xl font-bold text-secondary'>Stock</h2>
           <div className='flex gap-4'>
           <UploadstockcsvPage />
           <Addstock />
           </div>
          </div>
          <Getallstock />
        </div>
  )
}

export default StockPage