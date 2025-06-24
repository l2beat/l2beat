import type { ProjectScalingStack } from '@l2beat/config'
import type { JSX } from 'react'
import { EM_DASH } from '~/consts/characters'
import { ArbitrumIcon } from '~/icons/providers/ArbitrumIcon'
import { CartesiIcon } from '~/icons/providers/CartesiIcon'
import { LoopringIcon } from '~/icons/providers/LoopringIcon'
import { OptimismIcon } from '~/icons/providers/OptimismIcon'
import { OVMIcon } from '~/icons/providers/OvmIcon'
import { PolygonIcon } from '~/icons/providers/PolygonIcon'
import { StarknetIcon } from '~/icons/providers/StarknetIcon'
import { StarkWareIcon } from '~/icons/providers/StarkwareIcon'
import { TaikoIcon } from '~/icons/providers/TaikoIcon'
import { ZKStackIcon } from '~/icons/providers/ZkstackIcon'
import { ZkSyncLiteIcon } from '~/icons/providers/ZksyncLiteIcon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'

export interface TypeInfoProps {
  children: string | undefined
  stack?: ProjectScalingStack
}

export function TypeInfo({ stack, children }: TypeInfoProps) {
  const providerProps = stack ? providerMap[stack] : undefined

  return (
    <span>
      {children ?? EM_DASH}
      {providerProps ? (
        <TypeTooltip
          Icon={providerProps.Icon}
          text={
            providerProps.text ??
            `This project is based on ${stack}'s code base.`
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
  ProjectScalingStack,
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
  'Agglayer CDK': {
    Icon: PolygonIcon,
    text: 'This project is based on the Agglayer CDK code base.',
  },
  'SN Stack': {
    Icon: StarknetIcon,
    text: "This project is based on Starknet's code base.",
  },
  Taiko: {
    Icon: TaikoIcon,
    text: "This project is based on Taiko's code base.",
  },
  'Cartesi Rollups': {
    Icon: CartesiIcon,
    text: "This project is based on Cartesi's code base.",
  },
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
          <Icon className="-top-0.5 absolute left-0 size-4" />
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
