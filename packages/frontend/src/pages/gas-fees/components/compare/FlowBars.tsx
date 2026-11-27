import type { GasFeesStats } from '~/server/features/gas-fees/daily/getGasFeesStats'
import { cn } from '~/utils/cn'
import { formatCount, formatShare, formatUsd } from '../../utils/format'
import { Eyebrow } from '../Eyebrow'
import { KeySwatch, ShareBar } from '../ShareBar'

const HEIGHT = 220
const GAP = 3
const L2_COLOR = 'var(--chart-stacked-blue)'
const ETHEREUM_COLOR = 'var(--chart-ethereum)'
const TOKEN_COLORS = {
  ETH: 'var(--chart-ethereum)',
  MNT: 'var(--chart-stacked-pink)',
}

interface Side {
  title: string
  total: string
  info?: string
  l2: { value: number; amount: string }
  ethereum: { value: number; amount: string }
}

/** L2s' share of the transactions, and of the fees, joined by a ribbon */
export function FlowBars({ stats }: { stats: GasFeesStats }) {
  const txs: Side = {
    title: 'Transactions',
    total: formatCount(stats.txCount.l2s + stats.txCount.ethereum),
    info: 'Transactions that paid a fee. A chain’s own system transactions, such as an OP Stack chain’s deposits and Taiko’s anchors, pay none and are left out.',
    l2: {
      value: stats.txCount.l2s,
      amount: `${formatCount(stats.txCount.l2s)} txs`,
    },
    ethereum: {
      value: stats.txCount.ethereum,
      amount: `${formatCount(stats.txCount.ethereum)} txs`,
    },
  }
  const fees: Side = {
    title: 'Fees',
    total: formatUsd(stats.feesUsd.l2s + stats.feesUsd.ethereum),
    l2: { value: stats.feesUsd.l2s, amount: formatUsd(stats.feesUsd.l2s) },
    ethereum: {
      value: stats.feesUsd.ethereum,
      amount: formatUsd(stats.feesUsd.ethereum),
    },
  }
  const l2TxShare = stats.l2Share.txCount
  const l2FeeShare = stats.l2Share.feesUsd
  const tokens = stats.l2FeesUsdByToken
  const tokenTotal = tokens.ETH + tokens.MNT

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] gap-x-1.5">
        <SideHeader side={txs} />
        <div />
        <SideHeader side={fees} />
        <Bar side={txs} share={l2TxShare} labelsBeside="right" />
        <Ribbon from={l2TxShare} to={l2FeeShare} />
        <Bar side={fees} share={l2FeeShare} labelsBeside="left" />
      </div>
      {tokenTotal > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Eyebrow>
            L2 fees paid in ETH{' '}
            <span className="ml-1 font-bold text-sm normal-case tracking-normal">
              {formatShare(tokens.ETH / tokenTotal)}
            </span>
          </Eyebrow>
          <ShareBar
            className="h-1.5 min-w-24 flex-1 rounded-full"
            parts={[
              { key: 'ETH', value: tokens.ETH, color: TOKEN_COLORS.ETH },
              { key: 'MNT', value: tokens.MNT, color: TOKEN_COLORS.MNT },
            ]}
            minLabelledShare={2}
          />
          <div className="flex gap-4 text-2xs">
            {(['ETH', 'MNT'] as const).map((token) =>
              tokens[token] > 0 ? (
                <span key={token} className="flex items-center gap-1.5">
                  <KeySwatch color={TOKEN_COLORS[token]} />
                  {token} {formatUsd(tokens[token])}{' '}
                  <strong>{formatShare(tokens[token] / tokenTotal)}</strong>
                </span>
              ) : null,
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SideHeader({ side }: { side: Side }) {
  return (
    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-2">
      <Eyebrow info={side.info} infoLabel={`About ${side.title.toLowerCase()}`}>
        {side.title}
      </Eyebrow>
      <span className="font-bold text-sm tabular-nums">{side.total}</span>
    </div>
  )
}

/** A thin segment's label goes beside it, into the ribbon */
function Bar({
  side,
  share,
  labelsBeside,
}: {
  side: Side
  share: number
  labelsBeside: 'left' | 'right'
}) {
  const l2Height = Math.round((HEIGHT - GAP) * share)
  return (
    <div className="flex flex-col gap-[3px]" style={{ height: HEIGHT }}>
      <Segment
        name="L2s"
        share={share}
        amount={side.l2.amount}
        height={l2Height}
        color={L2_COLOR}
        position="top"
        labelBeside={labelsBeside}
      />
      <Segment
        name="Ethereum"
        share={1 - share}
        amount={side.ethereum.amount}
        height={HEIGHT - GAP - l2Height}
        color={ETHEREUM_COLOR}
        position="bottom"
        labelBeside={labelsBeside}
      />
    </div>
  )
}

/** Labelled at the size its height fits, or beside it when too thin */
function Segment({
  name,
  share,
  amount,
  height,
  color,
  position,
  labelBeside,
}: {
  name: string
  share: number
  amount: string
  height: number
  color: string
  position: 'top' | 'bottom'
  labelBeside: 'left' | 'right'
}) {
  if (height <= 0) return null
  const size =
    height >= 96
      ? 'large'
      : height >= 40
        ? 'medium'
        : height >= 22
          ? 'small'
          : 'beside'
  return (
    <div
      className={cn(
        'relative px-3 text-white',
        position === 'top' ? 'rounded-t-lg' : 'rounded-b-lg',
      )}
      style={{ height, backgroundColor: color }}
    >
      {size === 'large' && (
        <div className="flex flex-col pt-2">
          <span className="font-bold text-4xl leading-tight">
            {formatShare(share)}
          </span>
          <span className="font-bold text-sm">{name}</span>
          <span className="text-2xs opacity-80">{amount}</span>
        </div>
      )}
      {size === 'medium' && (
        <div className="flex flex-col pt-1.5">
          <span className="font-bold text-sm">
            {name} {formatShare(share)}
          </span>
          <span className="text-2xs opacity-80">{amount}</span>
        </div>
      )}
      {size === 'small' && (
        <span className="flex h-full items-center font-bold text-xs">
          {name} {formatShare(share)}
        </span>
      )}
      {size === 'beside' && (
        <span
          className={cn(
            'absolute whitespace-nowrap font-bold text-primary text-xs',
            labelBeside === 'right' ? 'left-full ml-2' : 'right-full mr-2',
            position === 'top' ? 'top-0' : 'bottom-0',
          )}
        >
          {name} {formatShare(share)}
        </span>
      )}
    </div>
  )
}

/** Splits at one S-curve from the transactions' share to the fees' */
function Ribbon({ from, to }: { from: number; to: number }) {
  const a = from * HEIGHT
  const b = to * HEIGHT
  const curve = `M0,${a} C50,${a} 50,${b} 100,${b}`
  return (
    <svg
      viewBox={`0 0 100 ${HEIGHT}`}
      preserveAspectRatio="none"
      className="h-[220px] w-full"
      aria-hidden
    >
      <path
        d={`M0,0 L100,0 L100,${b} C50,${b} 50,${a} 0,${a} Z`}
        fill={L2_COLOR}
        fillOpacity={0.3}
      />
      <path
        d={`${curve} L100,${HEIGHT} L0,${HEIGHT} Z`}
        fill={ETHEREUM_COLOR}
        fillOpacity={0.3}
      />
      <path
        d={curve}
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeWidth={2}
        className="stroke-surface-primary"
      />
    </svg>
  )
}
