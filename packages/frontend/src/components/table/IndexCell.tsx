import React from 'react'

import { UnverifiedContractsWarning } from './UnverifiedContractsWarning'

export interface IndexCellProps {
  entry: {
    isVerified?: boolean
  }
  index: number
}

export function IndexCell({ entry, index }: IndexCellProps) {
  if (entry.isVerified === false) {
    return (
      <UnverifiedContractsWarning
        className="absolute top-0 left-[1px] -translate-y-1/2 "
        tooltip="This project includes unverified contracts."
      />
    )
  }
  return <span className="text-gray-700 dark:text-gray-600">{index}.</span>
}
