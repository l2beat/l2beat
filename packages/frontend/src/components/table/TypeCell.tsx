import { Layer2Provider, Layer3Provider } from '@l2beat/config'
import React from 'react'

import { cn } from '../../utils/cn'
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
  provider?: Layer2Provider | Layer3Provider
}

export function TypeCell({ provider, children, disableColors }: TypeCellProps) {
  const isRollup = children.includes('Rollup')

  return (
    <span
      className={cn(
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

function TypeTooltip({ Icon, text }: TypeTooltipProps) {
  return (
    <Tooltip className="inline">
      <TooltipTrigger className="relative ml-1 inline-block size-4">
        <Icon className="absolute -top-0.5 left-0 size-4" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

export function TypeColumnTooltip({
  showOnlyRollupsDefinitions,
}: {
  showOnlyRollupsDefinitions?: boolean
}) {
  return (
    <div>
      <div className="mb-1">
        Type of this project. Determines data availability and proof system
        used.
      </div>
      ZK Rollups = Validity Proofs + onchain data
      <br />
      Optimistic Rollups = Fraud Proofs + onchain data
      {!showOnlyRollupsDefinitions && (
        <>
          <br />
          Validiums = Validity Proofs + offchain data
          <br />
          Optimiums = Fraud Proofs + offchain data
        </>
      )}
    </div>
  )
}
