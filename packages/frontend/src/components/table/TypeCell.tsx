import { Layer2Provider, Layer3Provider } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import {
  ArbitrumIcon,
  LoopringIcon,
  OptimismIcon,
  OVMIcon,
  PolygonIcon,
  StarknetIcon,
  StarkWareIcon,
  ZKStackIcon,
  ZkSyncLiteIcon,
} from '../icons'

export interface TypeCellProps {
  children: string
  disableColors?: boolean
  provider?: Layer2Provider | Layer3Provider
}

export function TypeCell({ provider, children, disableColors }: TypeCellProps) {
  const isRollup = children.includes('Rollup')
  const providerClassName = 'Tooltip relative inline-block h-4 w-4 ml-1'
  const providerIconClassName = 'absolute -top-0.5 left-0 w-4 h-4'

  return (
    <span
      className={cx(
        isRollup && !disableColors && 'text-green-300 dark:text-green-450',
      )}
    >
      {children}
      {provider === 'StarkEx' && (
        <span
          className={providerClassName}
          title="This project is built using StarkEx."
        >
          <StarkWareIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'OP Stack' && (
        <span
          className={providerClassName}
          title="This project is based on OP Stack's code base."
        >
          <OptimismIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'OVM' && (
        <span
          className={providerClassName}
          title="This project is based on old OVM's code base."
        >
          <OVMIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'zkSync Lite' && (
        <span
          className={providerClassName}
          title="This project is based on zkSync Lite's code base."
        >
          <ZkSyncLiteIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'ZK Stack' && (
        <span
          className={providerClassName}
          title="This project is based on ZK Stack's code base."
        >
          <ZKStackIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'Loopring' && (
        <span
          className={providerClassName}
          title="This project is based on Loopring's code base."
        >
          <LoopringIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'Arbitrum' && (
        <span
          className={providerClassName}
          title="This project is based on Arbitrum's code base."
        >
          <ArbitrumIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'Polygon' && (
        <span
          className={providerClassName}
          title="This project is based on Polygon's code base."
        >
          <PolygonIcon className={providerIconClassName} />
        </span>
      )}
      {provider === 'Starknet' && (
        <span
          className={providerClassName}
          title="This project is based on Starknet's code base."
        >
          <StarknetIcon className={providerIconClassName} />
        </span>
      )}
    </span>
  )
}
