import React from 'react'
import Layout from './layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Issuescorrection from '@/components/error-corrections/issues-correction'
import Receiptcorrection from '@/components/error-corrections/receipt-correction'
import OpenBalanceCorrectionPage from '@/components/error-corrections/open-balance-correction'

const ErrorCorrectionPage = () => {
  return (
    <Layout>
        <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Error Corrections</h2>
    </div>
     <Tabs defaultValue="Issues" className="w-full flex flex-row gap-5">
    <TabsList className="flex flex-col gap-4 h-full w-[150px]">
      <TabsTrigger value="Issues" className='w-full flex justify-start cursor-pointer'>Issues</TabsTrigger>
      <TabsTrigger value="Receipts" className='w-full flex justify-start cursor-pointer'>Receipts</TabsTrigger>
      <TabsTrigger value="Openbalance" className='w-full flex justify-start cursor-pointer'>Open Balance</TabsTrigger>
    </TabsList>
    <TabsContent value="Issues">
      <Issuescorrection />
    </TabsContent>
    <TabsContent value="Receipts">
      <Receiptcorrection />
    </TabsContent>
    <TabsContent value="Openbalance">
      <OpenBalanceCorrectionPage />
    </TabsContent>
  </Tabs>

    </Layout>
  )
}

export default ErrorCorrectionPage