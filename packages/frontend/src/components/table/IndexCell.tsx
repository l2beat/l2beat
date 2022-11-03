import React from 'react'

import { UnverifiedWarning } from './UnverifiedWarning'

export interface IndexCellProps {
  entry: {
    isVerified?: boolean
  }
  index: number
}

export function IndexCell({ entry, index }: IndexCellProps) {
  if (entry.isVerified === false) {
    return <UnverifiedWarning />
  }
  return <>{index}</>
}
