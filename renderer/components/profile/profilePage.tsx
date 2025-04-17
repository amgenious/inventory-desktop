import React from 'react'
import ProfileDetails from './profileDetails'

const ProfilePage = () => {
  return (
   <div className="space-y-6">
           <header>
           <h3 className="mb-0.5 text-base font-medium dark:text-secondary">Profile information</h3>
           {/* <p className="dark:text-muted text-sm">Update your account's appearance settings</p> */}
           </header>
       <ProfileDetails />
   </div>
  )
}

export default ProfilePage