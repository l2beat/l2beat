import React from 'react'

export function CostsHeader() {
  return (
    <div className="mb-4">
      <h1 className="mb-1 font-bold text-3xl">Onchain costs</h1>
      <p className="hidden text-base text-gray-500 md:block dark:text-gray-600">
        The page shows the costs that L2s pay to Ethereum for security. By
        default, the projects are sorted by TVL.
      </p>
    </div>
  )
}
