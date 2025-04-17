import Layout from '@/pages/dashboard/layout'
import React from 'react'
import { AddCategory } from './add-category'
import { Getallcategory } from './getallcategory'

const CategoryPage = () => {
  return (
    <div>
        <div className='flex justify-between items-center w-full pb-2'>
       <h2 className='text-xl font-bold text-secondary'>Categories</h2>
       <AddCategory />
      </div>
      <Getallcategory />
    </div>
  )
}

export default CategoryPage