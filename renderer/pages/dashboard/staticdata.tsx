import React from 'react'
import Layout from './layout'
import StaticDataContent from '@/components/staticdata/static-data'

const Staticdata = () => {
  return (
    <Layout>
    <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Static Data</h2>
    </div> 
    <StaticDataContent /> 
    </Layout>
  )
}

export default Staticdata