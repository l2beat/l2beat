import React from 'react'

export function FeesHeader() {
  return (
    <div className="mb-4">
      <h1 className="mb-1 text-3xl font-bold">L2 Fees</h1>
      <p className="hidden text-gray-500 dark:text-gray-600 md:block">
        The page shows the average fees users would pay on the listed chains for
        different operations. By default, the projects are sorted by TVL.
      </p>
    </div>
  )
}
