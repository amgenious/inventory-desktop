import React from 'react'
import AppearanceToggleTab from './appearanceTab'

const AppearancePage = () => {
  return (
    <div className="space-y-6">
        <header>
        <h3 className="mb-0.5 text-base font-medium dark:text-secondary">Appearance settings</h3>
        <p className="dark:text-muted text-sm">Update your account's appearance settings</p>
        </header>
    <AppearanceToggleTab />
</div>
  )
}

export default AppearancePage