import { Layer2 } from '@l2beat/config'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface TypeCellProps {
  children: string
  disableColors?: boolean
  provider?: Layer2['display']['provider']
}

export function TypeCell({ provider, children, disableColors }: TypeCellProps) {
  const isRollup = children.includes('Rollup')

  return (
    <span
      className={cx(
        isRollup && !disableColors && 'text-green-300 dark:text-green-450',
      )}
    >
      {children}
      {provider === 'StarkEx' && (
        <TypeTooltip
          text="This project is built using StarkEx."
          Icon={StarkWareIcon}
        />
      )}
      {provider === 'OP Stack' && (
        <TypeTooltip
          text="This project is based on OP Stack's code base."
          Icon={OptimismIcon}
        />
      )}
      {provider === 'OVM' && (
        <TypeTooltip
          text="This project is based on old OVM's code base."
          Icon={OVMIcon}
        />
      )}
      {provider === 'zkSync Lite' && (
        <TypeTooltip
          text="This project is based on zkSync Lite's code base."
          Icon={ZkSyncLiteIcon}
        />
      )}
      {provider === 'ZK Stack' && (
        <TypeTooltip
          text="This project is based on ZK Stack's code base."
          Icon={ZKStackIcon}
        />
      )}
      {provider === 'Loopring' && (
        <TypeTooltip
          text="This project is based on Loopring's code base."
          Icon={LoopringIcon}
        />
      )}
      {provider === 'Arbitrum' && (
        <TypeTooltip
          text="This project is based on Arbitrum's code base."
          Icon={ArbitrumIcon}
        />
      )}
      {provider === 'Polygon' && (
        <TypeTooltip
          text="This project is based on Polygon's code base."
          Icon={PolygonIcon}
        />
      )}
      {provider === 'Starknet' && (
        <TypeTooltip
          text="This project is based on Starknet's code base."
          Icon={StarknetIcon}
        />
      )}
    </span>
  )
}

interface TypeTooltipProps {
  Icon: (props: { className: string }) => JSX.Element
  text: string
}

export function TypeTooltip({ Icon, text }: TypeTooltipProps) {
  return (
    <Tooltip className="relative ml-1 inline-block h-4 w-4">
      <TooltipTrigger>
        <Icon className="absolute -top-0.5 left-0 h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
