import Heading from '@/components/heading'
import React from 'react'
import Layout from './layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppearancePage from '@/components/appearance/appearancePage'
import ProfilePage from '@/components/profile/profilePage'
import Updatepassword from '@/components/password/update-password'

const SettingPage = () => {
  return (
    <Layout>
    <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />
            <Tabs defaultValue="profile" className="w-full flex flex-row gap-5 ">
      <TabsList className="flex flex-col gap-4 h-full w-[150px]">
        {/* <TabsTrigger value="appearance" className='w-full flex justify-start cursor-pointer'>Appearance</TabsTrigger> */}
        <TabsTrigger value="profile" className='w-full flex justify-start cursor-pointer'>Profile</TabsTrigger>
        <TabsTrigger value="password"  className='w-full flex justify-start cursor-pointer'>Password</TabsTrigger>
      </TabsList>
      <TabsContent value="appearance">
         {/* <AppearancePage />  */}
      </TabsContent>
      <TabsContent value="profile">
        <ProfilePage />
      </TabsContent>
      <TabsContent value="password">
        <Updatepassword />
      </TabsContent>
    </Tabs>
    </div>
    </Layout>
  )
}

export default SettingPage