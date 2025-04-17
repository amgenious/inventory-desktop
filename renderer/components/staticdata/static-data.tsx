import React from 'react'
import {
Tabs,
TabsContent,
TabsList,
TabsTrigger,
} from "@/components/ui/tabs"
import CategoryPage from '../category/category'
import LocationPage from '../location/location'
import UserPage from '../users/userpage'

const StaticDataContent = () => {
  return (
    <Tabs defaultValue="location" className="w-full flex flex-row gap-5 ">
      <TabsList className="flex flex-col gap-4 h-full w-[150px]">
        <TabsTrigger value="location" className='w-full flex justify-start cursor-pointer'>Location</TabsTrigger>
        <TabsTrigger value="category" className='w-full flex justify-start cursor-pointer'>Category</TabsTrigger>
        <TabsTrigger value="measurement"  className='w-full flex justify-start cursor-pointer'>Measurement</TabsTrigger>
        <TabsTrigger value="user"  className='w-full flex justify-start cursor-pointer'>Users</TabsTrigger>
        <TabsTrigger value="stock"  className='w-full flex justify-start cursor-pointer'>Stock</TabsTrigger>
        <TabsTrigger value="supplier"  className='w-full flex justify-start cursor-pointer'>Supplier</TabsTrigger>
        <TabsTrigger value="customer"  className='w-full flex justify-start cursor-pointer'>Customer</TabsTrigger>
      </TabsList>
      <TabsContent value="location">
        <LocationPage /> 
      </TabsContent>
      <TabsContent value="category">
        <CategoryPage />
      </TabsContent>
      <TabsContent value="measurement">
        {/* <MeasurementPage /> */} <p>Measurement</p>
      </TabsContent>
      <TabsContent value="user">
       <UserPage />
      </TabsContent>
      <TabsContent value="stock">
        {/* <InventoryPage /> */} <p>Stock</p>
      </TabsContent>
      <TabsContent value="supplier">
        {/* <SupplierPage /> */} <p>Supplier</p>
      </TabsContent>
      <TabsContent value="customer">
        {/* <CustomerPage /> */} <p>Customer</p>
      </TabsContent>
    </Tabs>
  )
}

export default StaticDataContent