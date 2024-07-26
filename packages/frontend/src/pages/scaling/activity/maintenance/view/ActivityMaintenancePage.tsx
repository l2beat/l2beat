import React from 'react'
import { SimplePageHeader } from '../../../../../components/header/SimplePageHeader'
import { TriangleWarningIcon } from '../../../../../components/icons/symbols/TriangleWarningIcon'
import { DashboardLayout } from '../../../../../layouts/DashboardLayout'

export function ActivityMaintenancePage() {
  return (
    <DashboardLayout>
      <SimplePageHeader>Activity</SimplePageHeader>
      <div className="mt-8 flex h-[530px] w-full flex-col items-center justify-center rounded-lg bg-[#E6E7EC] px-2 py-2.5 dark:bg-[#1E1C21] md:px-0">
        <p className="mb-4">
          <TriangleWarningIcon className="size-10 fill-yellow-200" />
        </p>
        <p className="text-balance text-center font-bold text-2xl text-black leading-[1.1] dark:text-yellow-200">
          The page is currently under maintenance.
        </p>
        <p className="mt-3 text-balance text-center font-medium text-sm">
          We will be back soon.
        </p>
      </div>
    </DashboardLayout>
  )
}
