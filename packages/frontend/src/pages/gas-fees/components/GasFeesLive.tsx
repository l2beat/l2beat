import type { GasFeesTier, GasFeesWallet } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { Logo } from '~/components/Logo'
import { RollingNumber } from '~/components/RollingNumber'
import { EM_DASH } from '~/consts/characters'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { NextBlock } from '~/pages/blobs/components/live-blobs/NextBlock'
import type { GasFeesLiveTips } from '~/server/features/gas-fees/getGasFeesLiveTips'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatFee } from './metrics'
import type { GasFeesWalletIcons } from './types'

/** The backend reads a block every 12 seconds, and the server shares a read for 3 */
const POLL_MS = 4_000
/** A block is 12 seconds, so an estimate this old means the backend has stopped reading */
const STALE_AFTER_SECONDS = 120

const TIERS: { key: GasFeesTier; name: string; promise: string }[] = [
  { key: 'slow', name: 'Slow', promise: '95% within 1 minute' },
  { key: 'medium', name: 'Medium', promise: '95% within 2 blocks' },
  { key: 'fast', name: 'Fast', promise: '95% next block' },
]

const WALLETS: GasFeesWallet[] = ['Ambire', 'MetaMask', 'Rabby']

/** Two significant digits, never in e-notation: slow tips can be 1e-8 gwei */
const gwei = (value: number) =>
  value.toLocaleString('en-US', { maximumSignificantDigits: 2 })
const multiple = (value: number) =>
  `${Number(value.toPrecision(2)).toLocaleString('en-US')}×`

/** Our three tips next to what wallets suggest, as blocks come in */
export function GasFeesLive({
  walletIcons,
  estimateAction,
}: {
  walletIcons: GasFeesWalletIcons
  /** Shown beside our estimate's column heading, e.g. how we make it */
  estimateAction?: React.ReactNode
}) {
  const trpc = useTRPC()
  const rootRef = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(rootRef)
  const { data: tips, isPending } = useQuery({
    ...trpc.gasFees.liveTips.queryOptions(),
    enabled: onScreen,
    refetchInterval: POLL_MS,
  })
  const isLive = !!tips && UnixTime.now() - tips.updatedAt < STALE_AFTER_SECONDS
  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <h3 className="font-bold text-lg">Tips now</h3>
        <span className="flex items-center gap-2 font-medium text-sm">
          <span
            className={
              isLive
                ? 'size-2 animate-pulse rounded-full bg-negative motion-reduce:animate-none'
                : 'size-2 rounded-full bg-divider'
            }
          />
          {getStatus(tips, isPending, isLive)}
        </span>
        {isLive && <NextBlock hidden={false} />}
        {isPending && (
          <span className="invisible text-sm">Next block in 12s</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <TipsNow
          tips={tips ?? undefined}
          pending={isPending}
          walletIcons={walletIcons}
          estimateAction={estimateAction}
        />
      </div>
    </div>
  )
}

function getStatus(
  tips: GasFeesLiveTips | null | undefined,
  isPending: boolean,
  isLive: boolean,
) {
  if (isPending || isLive) return 'Live from Ethereum'
  if (!tips) return 'No estimate right now'
  return `Not live: last read ${formatTimestamp(tips.updatedAt, { mode: 'datetime' })}`
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
  tips,
  pending,
  walletIcons,
  estimateAction,
}: {
  tips: GasFeesLiveTips | undefined
  pending: boolean
  walletIcons: GasFeesWalletIcons
  estimateAction?: React.ReactNode
}) {
  // Only the wallets the backend has a read of: a deployment may not poll the
  // wallets' fee services, and it drops one that hasn't answered for 30 minutes
  const shown = WALLETS.filter(
    (wallet) => pending || tips?.wallets.some((row) => row.wallet === wallet),
  )
  return (
    <table className="w-full min-w-[600px] tabular-nums">
      <thead>
        <tr className="text-left text-secondary text-xs">
          <th className="w-[16%] pb-1.5 font-medium">Speed, gwei</th>
          <th className="w-[24%] pb-1.5 font-medium">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="flex items-center gap-1.5 text-primary">
                <Logo className="block h-5 w-auto" animated={false} />
                estimate
              </span>
              {estimateAction}
            </span>
          </th>
          {shown.map((wallet, i) => (
            <th
              key={wallet}
              className={cn(
                'w-[20%] border-divider pb-1.5 pl-4 font-medium',
                i === 0 && 'border-l',
              )}
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap text-primary">
                <img
                  src={walletIcons[wallet]}
                  alt=""
                  className="size-4 rounded-xs"
                  width={16}
                  height={16}
                />
                {wallet}
              </span>
            </th>
          ))}
          {/* Keeps our columns their width when no wallet is shown */}
          {shown.length < WALLETS.length && <th />}
        </tr>
      </thead>
      <tbody>
        {TIERS.map((tier) => {
          const ours = tips?.tips.find((tip) => tip.key === tier.key)
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
                  {pending && <TextSkeleton sizedAs="0.0000" />}
                  {!pending && !ours && EM_DASH}
                  {ours && <RollingNumber value={ours.gwei} format={gwei} />}
                </span>
                <span className="block text-secondary text-xs">
                  {pending && <TextSkeleton sizedAs="$0.000" />}
                  {ours && `${formatFee(ours.usd)} per ERC-20 transfer`}
                </span>
              </td>
              {shown.map((wallet, i) => {
                const theirs = tips?.wallets.find(
                  (row) => row.wallet === wallet && row.beside === tier.key,
                )
                return (
                  <td
                    key={wallet}
                    className={cn(
                      'border-divider py-1.5 pl-4 text-sm',
                      i === 0 && 'border-l',
                    )}
                    title={theirs && `${wallet} ${theirs.option}`}
                  >
                    {pending && <TextSkeleton sizedAs="0.000" />}
                    {!pending && !theirs && (
                      <span className="text-secondary">{EM_DASH}</span>
                    )}
                    {theirs && (
                      <>
                        <span className="block font-medium">
                          {gwei(theirs.gwei)}
                        </span>
                        {ours && ours.gwei > 0 && (
                          <span className="block whitespace-nowrap text-secondary text-xs">
                            {multiple(theirs.gwei / ours.gwei)} ours
                          </span>
                        )}
                      </>
                    )}
                  </td>
                )
              })}
              {shown.length < WALLETS.length && <td />}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
