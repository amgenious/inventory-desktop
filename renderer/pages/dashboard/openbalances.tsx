import React from 'react'
import Layout from './layout'
import BalancesPage from '@/components/open-balances/balances'

const OpenbalancesPage = () => {
  return (
    <Layout>
    <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Open Balances</h2>
    </div> 
    <BalancesPage />
    </Layout>
  )
}

export default OpenbalancesPage