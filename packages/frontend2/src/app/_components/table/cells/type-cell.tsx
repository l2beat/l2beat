import { type Layer2Provider, type Layer3Provider } from '@l2beat/config'
import React from 'react'

import { ArbitrumIcon } from '~/icons/providers/ArbitrumIcon'
import { LoopringIcon } from '~/icons/providers/LoopringIcon'
import { OVMIcon } from '~/icons/providers/OVMIcon'
import { OptimismIcon } from '~/icons/providers/OptimismIcon'
import { PolygonIcon } from '~/icons/providers/PolygonIcon'
import { StarkWareIcon } from '~/icons/providers/StarkWareIcon'
import { StarknetIcon } from '~/icons/providers/StarknetIcon'
import { ZKStackIcon } from '~/icons/providers/ZKStackIcon'
import { ZkSyncLiteIcon } from '~/icons/providers/ZkSyncLiteIcon'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip'

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
      {provider === 'ZKsync Lite' && (
        <TypeTooltip
          text="This project is based on ZKsync Lite's code base."
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
    <Tooltip>
      <TooltipTrigger className="relative ml-1 inline-block size-4">
        <Icon className="-top-0.5 absolute left-0 size-4" />
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
