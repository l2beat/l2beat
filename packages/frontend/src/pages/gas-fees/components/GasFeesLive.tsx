import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect, useRef, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { Logo } from '~/components/Logo'
import { EM_DASH } from '~/consts/characters'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { NextBlock } from '~/pages/blobs/components/live-blobs/NextBlock'
import type {
  GasFeesBlock,
  GasFeesLiveTips,
} from '~/server/features/gas-fees/getGasFeesTips'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { formatFee } from './metrics'
import mock from './pageMock.json'

const POLL_MS = 2_000

const SHARES = [
  {
    key: 'upToFast',
    label: 'Up to fast',
    color: 'var(--chart-stacked-blue)',
  },
  {
    key: 'belowWallet',
    label: 'Fast to 2 gwei',
    color: 'color-mix(in oklab, var(--chart-stacked-pink) 70%, black)',
  },
  {
    key: 'atWallet',
    label: '2+ gwei',
    color: 'var(--chart-stacked-pink)',
  },
] as const

const WALLETS = [
  { name: 'Ambire', icon: '/icons/ambire.png' },
  { name: 'MetaMask', icon: '/icons/metamask.png' },
  { name: 'Rabby', icon: '/icons/rabby.png' },
] as const

/** Two significant digits, never in e-notation: slow tips can be 1e-8 gwei */
const gwei = (value: number) =>
  value.toLocaleString('en-US', { maximumSignificantDigits: 2 })
const multiple = (value: number) =>
  `${Number(value.toPrecision(2)).toLocaleString('en-US')}×`

/** Our three tips next to what wallets suggest, as blocks come in */
export function GasFeesLive({
  action,
  showBlocks,
}: {
  action?: React.ReactNode
  /** Adds each new block's gas split by tip under the table */
  showBlocks?: boolean
}) {
  const trpc = useTRPC()
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(rootRef)
  const { data: live, isPending } = useQuery({
    ...trpc.gasFees.tips.queryOptions(),
    enabled: onScreen,
    refetchInterval: POLL_MS,
  })
  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <h3 className="font-bold text-lg">Tips now</h3>
          <span className="flex items-center gap-2 font-medium text-sm">
            <span
              className={
                live
                  ? 'size-2 animate-pulse rounded-full bg-negative motion-reduce:animate-none'
                  : 'size-2 rounded-full bg-divider'
              }
            />
            {live || isPending
              ? 'Live from Ethereum'
              : `Average on ${mock.asOf}, replayed`}
          </span>
          {live && <NextBlock hidden={false} />}
          {isPending && (
            <span className="invisible text-sm">Next block in 12s</span>
          )}
        </div>
        {action}
      </div>
      <div className="overflow-x-auto">
        <TipsNow live={live} pending={isPending} />
      </div>
      {showBlocks && (live || isPending) && (
        <div className="mt-4">
          <Belt live={live ?? undefined} />
        </div>
      )}
    </div>
  )
}

/** Holds the space of what is coming, so nothing moves when it does */
function TextSkeleton({ sizedAs }: { sizedAs: string }) {
  return (
    <span className="relative inline-block">
      <span className="invisible">{sizedAs}</span>
      <Skeleton className="absolute inset-0" />
    </span>
  )
}

/** One row per speed: our estimate first, then what each wallet suggests for it */
function TipsNow({
  live,
  pending,
}: {
  live: GasFeesLiveTips | null | undefined
  pending: boolean
}) {
  // Every wallet keeps its column, so a fee service that is down or rate
  // limits us shows a dash instead of reshaping the table
  const shown = WALLETS
  return (
    <table className="w-full min-w-[600px] tabular-nums">
      <thead>
        <tr className="text-left text-secondary text-xs">
          <th className="w-[16%] pb-1.5 font-medium">Speed, gwei</th>
          <th className="w-[24%] pb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-primary">
              <Logo className="block h-5 w-auto" animated={false} />
              estimate
            </span>
          </th>
          {shown.map((wallet, i) => (
            <th
              key={wallet.name}
              className={cn(
                'w-[20%] border-divider pb-1.5 pl-4 font-medium',
                i === 0 && 'border-l',
              )}
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap text-primary">
                <img
                  src={wallet.icon}
                  alt=""
                  className="size-4 rounded-xs"
                  width={16}
                  height={16}
                />
                {wallet.name}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mock.tiers.map((tier) => {
          const now = live?.tips.find((tip) => tip.key === tier.key)
          const tip = now?.gwei ?? (pending ? undefined : tier.tip)
          const usd = now?.usd ?? (pending ? undefined : tier.usd)
          return (
            <tr key={tier.key} className="border-divider border-t align-top">
              <th className="py-1.5 pr-4 text-left font-normal">
                <span className="block font-bold text-sm">{tier.name}</span>
                <span className="block text-secondary text-xs">
                  {tier.promise}
                </span>
              </th>
              <td className="py-1.5 pr-4">
                <span className="block font-bold text-lg leading-tight tracking-tight">
                  {tip === undefined ? (
                    <TextSkeleton sizedAs="0.0000" />
                  ) : (
                    <RollingNumber value={tip} format={gwei} />
                  )}
                </span>
                <span className="block text-secondary text-xs">
                  {usd === undefined ? (
                    <TextSkeleton sizedAs="$0.000" />
                  ) : (
                    `${formatFee(usd)} per ERC-20 transfer`
                  )}
                </span>
              </td>
              {shown.map((wallet, i) => {
                const theirs = live?.wallets.find(
                  (row) =>
                    row.wallet === wallet.name && row.beside === tier.key,
                )
                return (
                  <td
                    key={wallet.name}
                    className={cn(
                      'border-divider py-1.5 pl-4 text-sm',
                      i === 0 && 'border-l',
                    )}
                    title={theirs && `${wallet.name} ${theirs.option}`}
                  >
                    {pending && <TextSkeleton sizedAs="0.000" />}
                    {!pending && !theirs && (
                      <span
                        className="text-secondary"
                        title={`${wallet.name}'s fee service didn't answer`}
                      >
                        {EM_DASH}
                      </span>
                    )}
                    {theirs && (
                      <>
                        <span className="block font-medium">
                          {gwei(theirs.gwei)}
                        </span>
                        {now && (
                          <span className="block whitespace-nowrap text-secondary text-xs">
                            {multiple(theirs.gwei / now.gwei)} ours
                          </span>
                        )}
                      </>
                    )}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/** Blocks arrive on the right and the rest slide along, as on /blobs */
function Belt({ live }: { live: GasFeesLiveTips | undefined }) {
  const slideRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState<number>()
  const blocks = live?.blocks ?? []
  const block = live?.block
  const focused = blocks.find((row) => row.number === hovered)
  const shown = focused ?? blocks.at(-1)

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new block is what slides them
  useLayoutEffect(() => {
    const element = slideRef.current
    if (!element || reducedMotion || blocks.length === 0) return
    const step = element.clientWidth / blocks.length
    element.animate(
      [{ transform: `translateX(${step}px)` }, { transform: 'none' }],
      { duration: 700, easing: EASE_OUT_QUINT },
    )
  }, [block, reducedMotion])

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-sm">
        Share of each block's gas by tip
      </h3>
      <div className="relative h-48 overflow-hidden md:h-56 min-[1280px]:h-40">
        {!live && <Skeleton className="absolute inset-0" />}
        <div
          ref={slideRef}
          className="absolute inset-0 flex gap-px"
          onMouseLeave={() => setHovered(undefined)}
        >
          {blocks.map((row) => (
            <Column
              key={row.number}
              row={row}
              dimmed={focused !== undefined && focused !== row}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-2xs text-secondary tabular-nums">
        <ul className="flex gap-x-3 whitespace-nowrap">
          {SHARES.map((share) => (
            <li key={share.key} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-xs"
                style={{ backgroundColor: share.color }}
              />
              {share.label}
              <b className={cn('text-primary', !shown && 'invisible')}>
                {shown ? Math.round(shown[share.key] * 100) : '00'}%
              </b>
            </li>
          ))}
        </ul>
        <span className={cn(!shown && 'invisible')}>
          Block {(shown?.number ?? 26_000_000).toLocaleString('en-US')}
        </span>
      </div>
    </div>
  )
}

function Column({
  row,
  dimmed,
  onHover,
}: {
  row: GasFeesBlock
  dimmed: boolean
  onHover: (block: number) => void
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-1 flex-col-reverse gap-px overflow-hidden rounded-xs transition-opacity duration-100 motion-reduce:transition-none',
        dimmed && 'opacity-35',
      )}
      onMouseEnter={() => onHover(row.number)}
    >
      {SHARES.map(
        (share) =>
          row[share.key] > 0 && (
            <span
              key={share.key}
              style={{
                height: `${row[share.key] * 100}%`,
                backgroundColor: share.color,
              }}
            />
          ),
      )}
    </div>
  )
}
