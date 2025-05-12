import React from 'react'
import Layout from './layout'
import {
Tabs,
TabsContent,
TabsList,
TabsTrigger,
} from "@/components/ui/tabs"
import IssuesPage from '@/components/issues/issues'
import ReceiptPage from '@/components/receipts/receipt'

const TransactionPage = () => {
  return (
    <Layout>
        <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Transactions</h2>
    </div> 
    <Tabs defaultValue="Issues" className="w-full flex flex-row gap-5">
    <TabsList className="flex flex-col gap-4 h-full w-[150px]">
      <TabsTrigger value="Issues" className='w-full flex justify-start cursor-pointer'>Issues</TabsTrigger>
      <TabsTrigger value="Receipts" className='w-full flex justify-start cursor-pointer'>Receipts</TabsTrigger>
    </TabsList>
    <TabsContent value="Issues">
      <IssuesPage />
    </TabsContent>
    <TabsContent value="Receipts">
      <ReceiptPage />
    </TabsContent>
  </Tabs>
    </Layout>
  )
}

export default TransactionPage