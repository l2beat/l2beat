import cx from 'classnames'
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
        className={cx(
          'absolute top-0 -translate-y-1/2',
          index < 10 ? ' left-[4px]' : ' left-[1px]',
        )}
        tooltip="This project includes unverified contracts."
      />
    )
  }
  return <>{index}</>
}
