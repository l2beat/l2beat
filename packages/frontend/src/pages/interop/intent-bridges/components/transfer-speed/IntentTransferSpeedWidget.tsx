import { formatSeconds } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { IntentBridgeDominanceEntry } from '~/server/features/scaling/interop/getIntentBridgesData'
import { useTRPC } from '~/trpc/React'
import type { InteropChainWithIcon } from '../../../components/chain-selector/types'
import { ChainSelect } from '../../../token-frameworks/components/transfer-speed/ChainSelect'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
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
  const sorted = [...(data?.bridgeDominance.transfers.entries ?? [])].sort(
    (a, b) =>
      (a.averageDurationSeconds ?? Number.POSITIVE_INFINITY) -
      (b.averageDurationSeconds ?? Number.POSITIVE_INFINITY),
  )

  return (
    <PrimaryCard className="flex flex-col md:col-span-2 lg:col-start-3 lg:row-span-7 lg:row-start-6">
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        Transfer speed
      </h2>
      <p className="mt-1 font-medium text-paragraph-14 text-secondary">
        Select two chains to compare intent bridge transfer speed.
      </p>

      <div className="mt-4 flex items-center gap-2">
        <ChainSelect
          chains={interopChains}
          value={src}
          onChange={setSrc}
          excludeId={dst}
        />
        <button
          type="button"
          onClick={() => {
            setSrc(dst)
            setDst(src)
          }}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-divider bg-surface-primary transition-colors hover:bg-surface-secondary"
          aria-label="Swap chains"
        >
          <ArrowRightIcon className="size-4 fill-brand" />
        </button>
        <ChainSelect
          chains={interopChains}
          value={dst}
          onChange={setDst}
          excludeId={src}
        />
      </div>

      <h3 className="mt-5 font-medium text-label-value-13 text-secondary">
        All intent bridges
      </h3>
      <ScrollWithGradient className="mt-2 flex max-h-64.5 flex-1 flex-col gap-2.5">
        {isLoading
          ? intentBridges.map((bridge) => (
              <Skeleton key={bridge.id} className="h-9.5" />
            ))
          : sorted.map((entry) => {
              const bridge = bridgesById.get(entry.id)
              if (!bridge) return null
              return (
                <IntentSpeedRow
                  key={`${src}-${dst}-${entry.id}`}
                  bridge={bridge}
                  entry={entry}
                />
              )
            })}
      </ScrollWithGradient>
    </PrimaryCard>
  )
}

function IntentSpeedRow({
  bridge,
  entry,
}: {
  bridge: InteropIntentBridge
  entry: IntentBridgeDominanceEntry
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <a
        href={`/interop/protocols/${bridge.slug}`}
        className="-mx-1 flex min-w-0 items-center gap-2 rounded px-1 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
      >
        <img
          src={bridge.iconUrl}
          alt={bridge.name}
          className="size-6 shrink-0 rounded-full"
        />
        <span className="min-w-0 truncate font-bold text-heading-16">
          {bridge.name}
        </span>
      </a>
      <span className="shrink-0 font-bold text-label-value-15">
        {entry.averageDurationSeconds !== null
          ? formatSeconds(entry.averageDurationSeconds)
          : '—'}
      </span>
    </div>
  )
}
