import { assert, formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SwapIcon } from '~/icons/Swap'
import type { FrameworkDominanceEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { api } from '~/trpc/React'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'

export function FrameworkTransferSpeedWidget({
  tokenFrameworks,
  interopChains,
}: {
  tokenFrameworks: InteropTokenFramework[]
  interopChains: InteropChainWithIcon[]
}) {
  assert(interopChains[0] && interopChains[1])
  const [src, setSrc] = useState<string>(interopChains[0].id)
  const [dst, setDst] = useState<string>(interopChains[1].id)

  const { data, isLoading } = api.interop.tokenFrameworks.useQuery(
    {
      from: src ? [src] : [],
      to: dst ? [dst] : [],
    },
    { enabled: !!src && !!dst },
  )

  const swap = () => {
    setSrc(dst)
    setDst(src)
  }

  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))
  const entries = data?.frameworkDominance.transfers.entries ?? []
  const sorted = [...entries].sort((a, b) => {
    const aD = a.averageDurationSeconds
    const bD = b.averageDurationSeconds
    if (aD === null && bD === null) return 0
    if (aD === null) return 1
    if (bD === null) return -1
    return aD - bD
  })

  const fastest = sorted.find(
    (e) => e.averageDurationSeconds !== null && e.transferCount > 0,
  )
  const fastestFramework = fastest && frameworksById.get(fastest.id)

  return (
    <PrimaryCard className="col-span-2 col-start-3 row-span-7 row-start-6 flex flex-col">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-heading-20">Transfer speed</h2>
      </div>
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
          onClick={swap}
          disabled={!src || !dst}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-divider bg-surface-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="mt-3 flex flex-col rounded-lg bg-surface-secondary px-4 py-3">
        <span className="font-medium text-paragraph-13 text-secondary leading-none">
          Fastest protocol
        </span>
        <div>
          {isLoading ? (
            <FastestSkeleton />
          ) : fastest && fastestFramework ? (
            <FastestProtocol framework={fastestFramework} entry={fastest} />
          ) : (
            <div className="flex h-[58px] items-center font-medium text-paragraph-14 text-secondary">
              No transfers in the selected direction.
            </div>
          )}
        </div>
      </div>

      <h3 className="mt-5 font-medium text-label-value-13 text-secondary">
        All Frameworks
      </h3>
      <div className="mt-2 flex max-h-42 flex-1 flex-col gap-2.5 overflow-auto">
        {isLoading
          ? Array.from({ length: tokenFrameworks.length }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
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
      </div>
    </PrimaryCard>
  )
}

function ChainSelect({
  chains,
  value,
  onChange,
  excludeId,
}: {
  chains: InteropChainWithIcon[]
  value: string | undefined
  onChange: (id: string) => void
  excludeId: string | undefined
}) {
  const selected = chains.find((c) => c.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 flex-1 border border-divider bg-surface-primary">
        <SelectValue placeholder="Select chain">
          {selected && <ChainLabel chain={selected} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem
            key={chain.id}
            value={chain.id}
            disabled={chain.id === excludeId}
          >
            <ChainLabel chain={chain} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ChainLabel({ chain }: { chain: InteropChainWithIcon }) {
  return (
    <span className="flex items-center gap-2">
      <img
        src={chain.iconUrl}
        alt={chain.name}
        className="size-5 rounded-full"
      />
      <span className="truncate font-bold">{chain.name}</span>
    </span>
  )
}

function FastestProtocol({
  framework,
  entry,
}: {
  framework: InteropTokenFramework
  entry: FrameworkDominanceEntry
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2">
        <img
          src={framework.iconUrl}
          alt={framework.name}
          className="size-10 rounded-lg"
        />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-bold text-heading-18 leading-none">
            {framework.label}
          </span>
          <span className="truncate font-medium text-label-value-14 text-secondary leading-none">
            {framework.name}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Stat
          label="Transfer time"
          value={
            entry.averageDurationSeconds !== null
              ? formatSeconds(entry.averageDurationSeconds)
              : '—'
          }
        />
        <Stat
          label="Transaction count"
          value={`${formatInteger(entry.transferCount)} txs`}
        />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md bg-surface-primary px-4 py-2">
      <span className="font-medium text-paragraph-13 text-secondary leading-none">
        {label}
      </span>
      <span className="font-bold text-heading-16 leading-none">{value}</span>
    </div>
  )
}

function FastestSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-32" />
    </div>
  )
}

function FrameworkRow({
  framework,
  entry,
}: {
  framework: InteropTokenFramework
  entry: FrameworkDominanceEntry
}) {
  const duration = entry.averageDurationSeconds
  const hasData = duration !== null && entry.transferCount > 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <img
          src={framework.iconUrl}
          alt={framework.name}
          className="size-6 rounded-sm"
        />
        <span className="flex-1 font-bold text-heading-16">
          {framework.label}
        </span>
        <span className="font-bold text-label-value-18">
          {hasData ? formatSeconds(duration) : '—'}
        </span>
        <span className="w-16 text-right font-medium text-label-value-15 text-secondary">
          {hasData ? `${formatInteger(entry.transferCount)} txs` : '—'}
        </span>
      </div>
      <SpeedBar duration={hasData ? duration : 0} color={framework.color} />
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
