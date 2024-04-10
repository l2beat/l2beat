import React from 'react'

export function CostsHeader() {
  return (
    <div className="mb-4">
      <h1 className="mb-1 text-3xl font-bold">Costs</h1>
      <p className="hidden text-gray-500 dark:text-gray-600 md:block">
        The page shows the costs that L2s pay to Ethereum for security. By
        default, the projects are sorted by TVL.
      </p>
    </div>
  )
}
