import { type Layer2Provider, type Layer3Provider } from '@l2beat/config'

import { ArbitrumIcon } from '~/icons/providers/arbitrum-icon'
import { LoopringIcon } from '~/icons/providers/loopring-icon'
import { OptimismIcon } from '~/icons/providers/optimism-icon'
import { OVMIcon } from '~/icons/providers/ovm-icon'
import { PolygonIcon } from '~/icons/providers/polygon-icon'
import { StarknetIcon } from '~/icons/providers/starknet-icon'
import { StarkWareIcon } from '~/icons/providers/starkware-icon'
import { TaikoIcon } from '~/icons/providers/taiko-icon'
import { ZKStackIcon } from '~/icons/providers/zkstack-icon'
import { ZkSyncLiteIcon } from '~/icons/providers/zksync-lite-icon'
import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'

export interface TypeCellProps {
  children: string
  disableColors?: boolean
  provider?: Layer2Provider | Layer3Provider
}

export function TypeCell({ provider, children, disableColors }: TypeCellProps) {
  const isRollup = children.includes('Rollup')
  const providerProps = provider ? providerMap[provider] : undefined

  return (
    <span
      className={cn(
        isRollup && !disableColors && 'text-green-300 dark:text-green-450',
      )}
    >
      {children}
      {providerProps ? (
        <TypeTooltip
          Icon={providerProps.Icon}
          text={
            providerProps.text ??
            `This project is based on ${provider}'s code base.`
          }
        />
      ) : null}
    </span>
  )
}

interface ProviderProps {
  Icon: (props: { className: string }) => JSX.Element
  text: string
}

export const providerMap: Record<
  Layer2Provider | Layer3Provider,
  ProviderProps | undefined
> = {
  StarkEx: {
    Icon: StarkWareIcon,
    text: 'This project is built using StarkEx.',
  },
  'OP Stack': {
    Icon: OptimismIcon,
    text: "This project is based on OP Stack's code base.",
  },
  OVM: {
    Icon: OVMIcon,
    text: "This project is based on old OVM's code base.",
  },
  'ZKsync Lite': {
    Icon: ZkSyncLiteIcon,
    text: "This project is based on ZKsync Lite's code base.",
  },
  'ZK Stack': {
    Icon: ZKStackIcon,
    text: "This project is based on ZK Stack's code base.",
  },
  Loopring: {
    Icon: LoopringIcon,
    text: "This project is based on Loopring's code base.",
  },
  Arbitrum: {
    Icon: ArbitrumIcon,
    text: "This project is based on Arbitrum's code base.",
  },
  Polygon: {
    Icon: PolygonIcon,
    text: "This project is based on Polygon's code base.",
  },
  Starknet: {
    Icon: StarknetIcon,
    text: "This project is based on Starknet's code base.",
  },
  Taiko: {
    Icon: TaikoIcon,
    text: "This project is based on Taiko's code base.",
  },
  'Cartesi Rollups': undefined,
  'zkLink Nexus': undefined,
}

interface TypeTooltipProps {
  Icon: (props: { className: string }) => JSX.Element
  text: string
}

function TypeTooltip({ Icon, text }: TypeTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative ml-1 inline-block size-4">
          <Icon className="absolute -top-0.5 left-0 size-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

export function TypeExplanationTooltip({
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
