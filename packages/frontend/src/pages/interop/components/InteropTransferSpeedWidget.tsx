import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { cn } from '~/utils/cn'
import { ChainPairSelector } from './chain-selector/ChainPairSelector'
import type { InteropChainWithIcon } from './chain-selector/types'
import { InteropTransferSpeedRow } from './InteropTransferSpeedRow'
import {
  TRANSFER_SPEED_DEFAULT_FROM,
  TRANSFER_SPEED_DEFAULT_TO,
} from './transferSpeedDefaults'
import { useInteropOverview } from './useInteropOverview'

/** An entity (intent bridge or framework) rendered as a transfer-speed row. */
export interface TransferSpeedEntity {
  id: string
  slug: string
  iconUrl: string
  color: string
  label: string
}

export function InteropTransferSpeedWidget({
  entities,
  interopChains,
  description,
  listHeading,
  className,
  scrollClassName,
}: {
  entities: TransferSpeedEntity[]
  interopChains: InteropChainWithIcon[]
  description: string
  listHeading: string
  className?: string
  scrollClassName?: string
}) {
  const [src, setSrc] = useState(TRANSFER_SPEED_DEFAULT_FROM)
  const [dst, setDst] = useState(TRANSFER_SPEED_DEFAULT_TO)

  const { data, isLoading } = useInteropOverview({ from: [src], to: [dst] })

  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]))
  const entries = data
    ? 'activity' in data
      ? data.activity.entries
      : data.frameworkDominance.transfers.entries
    : []
  const sorted = [...entries].sort(
    (a, b) =>
      (a.averageDurationSeconds ?? Number.POSITIVE_INFINITY) -
      (b.averageDurationSeconds ?? Number.POSITIVE_INFINITY),
  )

  return (
    <PrimaryCard className={cn('flex flex-col', className)}>
      <h2 className="font-bold text-heading-18 md:text-heading-20">
        Transfer speed
      </h2>
      <p className="mt-1 font-medium text-paragraph-14 text-secondary">
        {description}
      </p>

      <ChainPairSelector
        chains={interopChains}
        src={src}
        dst={dst}
        onSrcChange={setSrc}
        onDstChange={setDst}
      />

      <h3 className="mt-5 font-medium text-label-value-13 text-secondary">
        {listHeading}
      </h3>
      <ScrollWithGradient
        className={cn('mt-2 flex flex-1 flex-col gap-2.5', scrollClassName)}
      >
        {isLoading
          ? entities.map((entity) => (
              <Skeleton key={entity.id} className="h-9.5" />
            ))
          : sorted.map((entry) => {
              const entity = entitiesById.get(entry.id)
              if (!entity) return null
              return (
                <InteropTransferSpeedRow
                  key={`${src}-${dst}-${entry.id}`}
                  slug={entity.slug}
                  iconUrl={entity.iconUrl}
                  label={entity.label}
                  color={entity.color}
                  durationSeconds={entry.averageDurationSeconds}
                  transferCount={entry.transferCount}
                />
              )
            })}
      </ScrollWithGradient>
    </PrimaryCard>
  )
}
