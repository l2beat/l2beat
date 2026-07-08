import { formatSeconds } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { useTRPC } from '~/trpc/React'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { ChainSelect } from '../../../components/chain-selector/ChainSelect'
import type { InteropChainWithIcon } from '../../../components/chain-selector/types'
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
      <ScrollWithGradient className="mt-2 flex max-h-56 flex-1 flex-col gap-2.5 pr-3 lg:max-h-none lg:min-h-0">
        {isLoading
          ? intentBridges.map((bridge) => (
              <Skeleton key={bridge.id} className="h-9.5" />
            ))
          : sorted.map(({ entry, durationSeconds }) => {
              const bridge = bridgesById.get(entry.id)
              if (!bridge) return null
              return (
                <IntentSpeedRow
                  key={`${src}-${dst}-${entry.id}`}
                  bridge={bridge}
                  durationSeconds={durationSeconds}
                  transferCount={entry.transferCount}
                />
              )
            })}
      </ScrollWithGradient>
    </PrimaryCard>
  )
}

function IntentSpeedRow({
  bridge,
  durationSeconds,
  transferCount,
}: {
  bridge: InteropIntentBridge
  durationSeconds: number | null
  transferCount: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <a
          href={`/interop/protocols/${bridge.slug}`}
          className="inline-flex w-fit items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
        >
          <img src={bridge.iconUrl} alt="" className="size-6 rounded-sm" />
          <span className="font-bold text-heading-16">{bridge.name}</span>
        </a>
        <span className="ml-auto font-bold text-label-value-18">
          {durationSeconds !== null ? formatSeconds(durationSeconds) : '—'}
        </span>
        <span className="w-16 text-right font-medium text-label-value-15 text-secondary">
          {durationSeconds !== null
            ? `${formatInteger(transferCount)} txs`
            : '—'}
        </span>
      </div>
      <SpeedBar duration={durationSeconds ?? 0} color={bridge.color} />
    </div>
  )
}

function SpeedBar({ duration, color }: { duration: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
      {duration > 0 && (
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            animation: `transfer-speed-fill ${duration}s linear infinite both`,
          }}
        />
      )}
    </div>
  )
}
