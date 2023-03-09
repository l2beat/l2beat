import React from 'react'

import { ArchivedIcon } from '../icons/symbols/ArchivedIcon'
import { UnverifiedContractsWarning } from './UnverifiedContractsWarning'

export interface IndexCellProps {
  entry: {
    isVerified?: boolean
    isArchived?: boolean
    isUpcoming?: boolean
  }
  index: number
}

export function IndexCell({ entry, index }: IndexCellProps) {
  if (entry.isUpcoming === true) {
    return null
  }

  if (entry.isArchived === true) {
    return <ArchivedIcon />
  }

  if (entry.isVerified === false) {
    return (
      <UnverifiedContractsWarning
        className="translate-x-[2px]"
        tooltip="This project includes unverified contracts."
      />
    )
  }
  return <span className="text-gray-700 dark:text-gray-600">{index}.</span>
}
