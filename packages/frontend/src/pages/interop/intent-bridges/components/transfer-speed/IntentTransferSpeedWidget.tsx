import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { useTRPC } from '~/trpc/React'
import { ChainPairSelector } from '../../../components/chain-selector/ChainPairSelector'
import type { InteropChainWithIcon } from '../../../components/chain-selector/types'
import { InteropTransferSpeedRow } from '../../../components/InteropTransferSpeedRow'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import { getDurationSeconds } from '../../utils/getDurationSeconds'
import {
  INTENT_TRANSFER_SPEED_DEFAULT_FROM,
  INTENT_TRANSFER_SPEED_DEFAULT_TO,
} from './consts'

export function IntentTransferSpeedWidget({
  intentBridges,
  interopChains,
}: {
  intentBridges: InteropIntentBridge[]
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const [src, setSrc] = useState(INTENT_TRANSFER_SPEED_DEFAULT_FROM)
  const [dst, setDst] = useState(INTENT_TRANSFER_SPEED_DEFAULT_TO)

  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: [src],
      to: [dst],
    }),
  )

  const bridgesById = new Map(
    intentBridges.map((bridge) => [bridge.id, bridge]),
  )
  const sorted = (data?.activity.entries ?? [])
    .map((entry) => ({
      entry,
      durationSeconds: getDurationSeconds(entry.averageDuration),
    }))
    .toSorted(
      (a, b) =>
        (a.durationSeconds ?? Number.POSITIVE_INFINITY) -
        (b.durationSeconds ?? Number.POSITIVE_INFINITY),
    )

  return (
    <PrimaryCard className="flex flex-col lg:min-h-0 lg:flex-1">
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        Transfer speed
      </h2>
      <p className="mt-1 font-medium text-paragraph-14 text-secondary">
        Select two chains to compare intent bridge transfer speed.
      </p>

      <ChainPairSelector
        chains={interopChains}
        src={src}
        dst={dst}
        onSrcChange={setSrc}
        onDstChange={setDst}
      />

      <h3 className="mt-5 font-medium text-label-value-13 text-secondary">
        All intent bridges
      </h3>
      <ScrollWithGradient className="mt-2 flex max-h-56 flex-1 flex-col gap-2.5 pr-3 lg:max-h-none lg:min-h-0">
        {isLoading
          ? intentBridges.map((bridge) => (
              <Skeleton key={bridge.id} className="h-9.5" />
            ))
          : sorted.map(({ entry, durationSeconds }) => {
              const bridge = bridgesById.get(entry.id)
              if (!bridge) return null
              return (
                <InteropTransferSpeedRow
                  key={`${src}-${dst}-${entry.id}`}
                  slug={bridge.slug}
                  iconUrl={bridge.iconUrl}
                  label={bridge.name}
                  color={bridge.color}
                  durationSeconds={durationSeconds}
                  transferCount={entry.transferCount}
                />
              )
            })}
      </ScrollWithGradient>
    </PrimaryCard>
  )
}
