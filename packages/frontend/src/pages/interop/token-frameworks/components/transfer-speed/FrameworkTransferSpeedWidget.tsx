import { assert } from '@l2beat/shared-pure'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SwapIcon } from '~/icons/Swap'
import { api } from '~/trpc/React'
import type { InteropChainWithIcon } from '../../../components/chain-selector/types'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'
import { ChainSelect } from './ChainSelect'
import { FastestProtocol } from './FastestProtocol'
import { FrameworkRow } from './FrameworkRow'

export function FrameworkTransferSpeedWidget({
  tokenFrameworks,
  interopChains,
}: {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
}) {
  assert(interopChains[0] && interopChains[1])
  const [src, setSrc] = useState(interopChains[0].id)
  const [dst, setDst] = useState(interopChains[1].id)

  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: [src],
    to: [dst],
  })

  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))
  const sorted = [...(data?.frameworkDominance.transfers.entries ?? [])].sort(
    (a, b) =>
      (a.averageDurationSeconds ?? Number.POSITIVE_INFINITY) -
      (b.averageDurationSeconds ?? Number.POSITIVE_INFINITY),
  )

  const fastest =
    sorted[0]?.averageDurationSeconds !== null ? sorted[0] : undefined
  const fastestFramework = fastest && frameworksById.get(fastest.id)

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
          <SwapIcon className="size-4 fill-brand" />
        </button>
        <ChainSelect
          chains={interopChains}
          value={dst}
          onChange={setDst}
          excludeId={src}
        />
      </div>

      <FastestProtocol
        framework={fastestFramework}
        entry={fastest}
        isLoading={isLoading}
      />

      <h3 className="mt-5 font-medium text-label-value-13 text-secondary">
        All Frameworks
      </h3>
      <div className="mt-2 flex max-h-42 flex-1 flex-col gap-2.5 overflow-auto">
        {isLoading
          ? tokenFrameworks.map((f) => <Skeleton key={f.id} className="h-7" />)
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
      </div>
    </PrimaryCard>
  )
}
