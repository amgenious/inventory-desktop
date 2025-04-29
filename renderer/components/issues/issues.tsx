import React from 'react'
import Addissues from './addissues'
import Getallissues from './getallissues'

const IssuesPage = () => {
  return (
    <div>
        <div className='flex justify-between items-center w-full pb-2'>
       <h2 className='text-xl font-bold text-secondary'>Issues</h2>
       <Addissues/>
      </div>
      <Getallissues/>
    </div>
  )
}

export default IssuesPage