import React from 'react'
import Layout from './layout'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const TemplatesPage = () => {
  return (
    <Layout>
     <div className='flex justify-between w-full pb-5'>
        <h2 className='text-xl font-bold text-black'>Templates</h2>
    </div>
    <div>
        <p className='text-muted'>Here you can download Templates for uploads.</p>
        <div className='flex justify-between mt-5'>
            <div><p className='text-muted italic'>Stock Upload Template</p></div>
            <div>
                <a  href="/stock-temp.xlsx" download="stock-temp.xlsx">
                <Button>Download</Button>
                </a>
            </div>
        </div>
        <Separator className='mt-1'/>
    </div>
    </Layout>
  )
}

export default TemplatesPage