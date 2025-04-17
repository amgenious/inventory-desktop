import React from 'react'
import Adduser from './add-user'
import Getuser from './get-user'

const UserPage = () => {
  return (
    <div>
        <div className='flex justify-between items-center w-full pb-2'>
            <div className='text-xl font-bold text-secondary'>Users</div>
            <Adduser />
        </div>
        <Getuser />
    </div>
  )
}

export default UserPage