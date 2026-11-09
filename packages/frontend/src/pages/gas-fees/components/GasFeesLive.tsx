import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect, useRef, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { Logo } from '~/components/Logo'
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

const gwei = (value: number) => `${Number(value.toPrecision(2))}`
const multiple = (value: number) =>
  `${Number(value.toPrecision(2)).toLocaleString('en-US')}×`

/** What each block paid, against the tips above, as blocks come in */
export function GasFeesLive() {
  const trpc = useTRPC()
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(rootRef)
  const { data: live, isPending } = useQuery({
    ...trpc.gasFees.tips.queryOptions(),
    enabled: onScreen,
    refetchInterval: POLL_MS,
  })
  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-x-8 gap-y-5 min-[1280px]:grid-cols-[auto_minmax(0,1fr)]"
    >
      <div className="flex flex-col justify-between gap-4">
        <TipsNow live={live} pending={isPending} />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-2 font-bold text-sm">
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
      </div>
      {(live || isPending) && <Belt live={live ?? undefined} />}
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

/** The promise sits on our row only: wallets make their own, so columns just run slow to fast */
function TipsNow({
  live,
  pending,
}: {
  live: GasFeesLiveTips | null | undefined
  pending: boolean
}) {
  const shown = WALLETS.filter(
    (wallet) =>
      pending || live?.wallets.some((tip) => tip.wallet === wallet.name),
  )
  return (
    <table className="w-full table-fixed tabular-nums min-[1280px]:w-[37rem]">
      <colgroup>
        <col className="w-[29%] min-[1280px]:w-[25%]" />
        <col className="w-[28%] min-[1280px]:w-[31%]" />
        <col className="w-[24%]" />
        <col className="w-[19%] min-[1280px]:w-[20%]" />
      </colgroup>
      <thead>
        <tr className="text-left font-medium text-label-value-13 text-secondary">
          <th className="pr-4 pb-1 font-medium md:pr-8">Tip, gwei (× ours)</th>
          {mock.tiers.map((tier) => (
            <th key={tier.key} className="pr-3 pb-1 font-medium md:pr-4">
              {tier.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="border-divider border-b align-top">
          <th className="pt-1 pr-4 pb-2 text-left font-bold text-sm md:pt-2 md:pr-8">
            <span className="flex flex-wrap items-center gap-x-1.5">
              <Logo className="block h-6 w-auto" animated={false} />
              estimator
            </span>
          </th>
          {mock.tiers.map((tier) => {
            const now = live?.tips.find((tip) => tip.key === tier.key)
            const tip = now?.gwei ?? (pending ? undefined : tier.tip)
            const usd = now?.usd ?? (pending ? undefined : tier.usd)
            return (
              <td key={tier.key} className="pr-3 pb-2 md:pr-4">
                <span className="block font-bold text-base tracking-tight md:text-3xl">
                  {tip === undefined ? (
                    <TextSkeleton sizedAs="0.0000" />
                  ) : (
                    <RollingNumber value={tip} format={gwei} />
                  )}
                </span>
                <span className="block text-secondary text-xs">
                  {tier.promise}
                </span>
                <span className="block text-secondary text-xs">
                  {usd === undefined ? (
                    <TextSkeleton sizedAs="$0.000" />
                  ) : (
                    formatFee(usd)
                  )}
                </span>
              </td>
            )
          })}
        </tr>
        {shown.map((wallet) => (
          <tr key={wallet.name} className="text-sm">
            <th className="whitespace-nowrap pt-1.5 pr-5 text-left font-normal md:pr-8">
              <span className="flex items-center gap-1.5">
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
            {mock.tiers.map((tier) => {
              const tip = live?.wallets.find(
                (row) => row.wallet === wallet.name && row.beside === tier.key,
              )
              const ours = live?.tips.find((row) => row.key === tier.key)
              return (
                <td
                  key={tier.key}
                  className="pt-1.5 pr-3 md:pr-4"
                  title={tip && `${wallet.name} ${tip.option}`}
                >
                  {pending && <TextSkeleton sizedAs="0.000" />}
                  {tip && (
                    <span className="flex items-baseline gap-1.5">
                      {gwei(tip.gwei)}
                      {ours && (
                        <span className="text-2xs text-secondary">
                          {multiple(tip.gwei / ours.gwei)}
                        </span>
                      )}
                    </span>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
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
