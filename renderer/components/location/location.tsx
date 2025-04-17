import React from 'react'
import { Addlocation } from './add-location'
import Getlocation from './get-location'

const LocationPage = () => {
  return (
    <div>
       <div className='flex justify-between items-center w-full pb-2'>
        <h2 className='text-xl font-bold text-secondary'>Locations</h2>
        <Addlocation />
       </div>
       <Getlocation />
    </div>
  )
}

export default LocationPage