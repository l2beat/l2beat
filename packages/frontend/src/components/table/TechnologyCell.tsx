import { Layer2 } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { LoopringIcon, OptimismIcon, StarkWareIcon, ZkSyncIcon } from '../icons'

export interface TechnologyCellProps {
  children: string
  provider?: Layer2['display']['provider']
}

export function TechnologyCell({ provider, children }: TechnologyCellProps) {
  const isRollup = children.includes('Rollup')
  const providerClassName = 'Tooltip relative inline-block h-4 w-4 ml-1'
  const providerIconClassName = 'absolute -top-0.5 left-0 w-4 h-4 fill-current'
  return (
    <span className={cx(isRollup && 'text-green-300 dark:text-green-450')}>
      {children}
      {provider === 'StarkEx' && (
        <span
          className={providerClassName}
          title="This project is built using StarkEx."
        >
          <StarkWareIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'Optimism' && (
        <span
          className={providerClassName}
          title="This project is based on Optimism's code base."
        >
          <OptimismIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'zkSync' && (
        <span
          className={providerClassName}
          title="This project is based on zkSync's code base."
        >
          <ZkSyncIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'loopring' && (
        <span
          className={providerClassName}
          title="This project is based on loopring's code base."
        >
          <LoopringIcon className={providerIconClassName} />
        </span>
      )}
    </span>
  )
}
