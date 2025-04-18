import React from 'react'
import Addmeasurement from './add-measurement'
import Getmeasurement from './get-measurement'

const MeasurementPage = () => {
  return (
     <div>
        <div className='flex justify-between items-center w-full pb-2'>
           <h2 className='text-xl font-bold text-secondary'>Measurement</h2>
           <Addmeasurement/>
          </div>
          <Getmeasurement/>
        </div>
  )
}

export default MeasurementPage