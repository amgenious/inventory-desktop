import React from 'react'
import Addissues from './addissues'
import Getallissues from './getallissues'
import UploadissuecsvPage from './uploadissue-csv'

const IssuesPage = () => {
  return (
    <div>
      <div className='flex justify-between items-center w-full pb-2'>
        <h2 className='text-xl font-bold text-secondary'>Issues</h2>
        <div className='flex gap-4'>  
          <UploadissuecsvPage />
        <Addissues/>
        </div>
      </div>
      <Getallissues/>
    </div>
  )
}

export default IssuesPage