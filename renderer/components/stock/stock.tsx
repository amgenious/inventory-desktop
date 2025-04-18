import React from 'react'
import Addstock from './addstock'
import Getallstock from './getallstock'

const StockPage = () => {
  return (
     <div>
            <div className='flex justify-between items-center w-full pb-2'>
           <h2 className='text-xl font-bold text-secondary'>Stock</h2>
           <Addstock />
          </div>
          <Getallstock />
        </div>
  )
}

export default StockPage