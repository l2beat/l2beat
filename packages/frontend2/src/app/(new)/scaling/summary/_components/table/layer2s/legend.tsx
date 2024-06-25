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

export function ScalingLegend() {
  return (
    <div className="mt-6 grid gap-2 text-sm md:grid-cols-2">
      <p className="flex gap-1">
        <StarkWareIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is built using StarkEx.</span>
      </p>
      <p className="flex gap-1">
        <OptimismIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on OP Stack&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <OVMIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on old OVM&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <ZkSyncLiteIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on ZKsync Lite&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <ZKStackIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on ZK Stack&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <LoopringIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on Loopring&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <ArbitrumIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on Arbitrum&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <PolygonIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on Polygon&apos;s code base.</span>
      </p>
      <p className="flex gap-1">
        <StarknetIcon className="-top-0.5 relative min-w-[24px]" />
        <span>&ndash;</span>
        <span>This project is based on Starknet&apos;s code base.</span>
      </p>
    </div>
  )
}
