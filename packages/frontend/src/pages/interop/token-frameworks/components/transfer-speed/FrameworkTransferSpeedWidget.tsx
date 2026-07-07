import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollWithGradient } from '~/components/ScrollWithGradient'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { useTRPC } from '~/trpc/React'
import { ChainSelect } from '../../../components/chain-selector/ChainSelect'
import type { InteropChainWithIcon } from '../../../components/chain-selector/types'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import {
  TRANSFER_SPEED_DEFAULT_FROM,
  TRANSFER_SPEED_DEFAULT_TO,
} from './consts'
import { FrameworkRow } from './FrameworkRow'

export function FrameworkTransferSpeedWidget({
  tokenFrameworks,
  interopChains,
}: {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const [src, setSrc] = useState(TRANSFER_SPEED_DEFAULT_FROM)
  const [dst, setDst] = useState(TRANSFER_SPEED_DEFAULT_TO)

  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: [src],
      to: [dst],
    }),
  )

  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))
  const sorted = [...(data?.frameworkDominance.transfers.entries ?? [])].sort(
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
        Select two chains to compare cross-chain transfer speed.
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
        All Frameworks
      </h3>
      <ScrollWithGradient className="mt-2 flex max-h-64.5 flex-1 flex-col gap-2.5">
        {isLoading
          ? tokenFrameworks.map((f) => (
              <Skeleton key={f.id} className="h-9.5" />
            ))
          : sorted.map((entry) => {
              const framework = frameworksById.get(entry.id)
              if (!framework) return null
              return (
                <FrameworkRow
                  key={`${src}-${dst}-${entry.id}`}
                  framework={framework}
                  entry={entry}
                />
              )
            })}
      </ScrollWithGradient>
    </PrimaryCard>
  )
}
