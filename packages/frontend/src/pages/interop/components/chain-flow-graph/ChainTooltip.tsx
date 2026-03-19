import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { InteropChainWithIcon } from '../chain-selector/types'

export interface ChainTooltipData {
  chain: InteropChainWithIcon
  volumeIn: number
  volumeOut: number
  netFlow: number
  connectedChains: number
  topRoutes: {
    direction: 'in' | 'out'
    chain: InteropChainWithIcon
    volume: number
  }[]
}

interface Props {
  data: ChainTooltipData
  mouseX: number
  mouseY: number
  containerWidth: number
}

export function ChainTooltip({
  data,
  mouseX,
  mouseY,
  containerWidth,
}: Props) {
  const tooltipWidth = 260
  // Center horizontally on cursor, but clamp to container edges
  const left = Math.max(
    8,
    Math.min(mouseX - tooltipWidth / 2, containerWidth - tooltipWidth - 8),
  )

  return (
    <div
      className="pointer-events-none absolute z-50 rounded-lg bg-surface-primary px-3 py-2 shadow-popover dark:bg-header-secondary"
      style={{
        left,
        top: mouseY,
        width: tooltipWidth,
        transform: 'translateY(calc(-100% - 16px))',
      }}
    >
      {/* Chain header */}
      <div className="mb-1 flex items-center gap-2">
        <img
          src={data.chain.iconUrl}
          alt={data.chain.name}
          className="size-5 rounded-xs"
        />
        <span className="font-bold text-primary text-sm">
          {data.chain.name}
        </span>
      </div>

      {/* Stats table */}
      <div className="flex flex-col text-[12px]">
        <Row label="Volume In" value={formatCurrency(data.volumeIn, 'usd')} />
        <Row label="Volume Out" value={formatCurrency(data.volumeOut, 'usd')} />
        <Row
          label="Net Flow"
          value={`${data.netFlow >= 0 ? '' : '-'}${formatCurrency(Math.abs(data.netFlow), 'usd')}`}
          valueClassName={
            data.netFlow > 0
              ? 'text-positive'
              : data.netFlow < 0
                ? 'text-negative'
                : undefined
          }
        />
        <Row
          label="Connected"
          value={`${data.connectedChains} chain${data.connectedChains !== 1 ? 's' : ''}`}
        />
      </div>

      {/* Top routes */}
      {data.topRoutes.length > 0 && (
        <div className="mt-1 border-divider border-t pt-1">
          <div className="mb-0.5 font-bold text-[10px] text-secondary uppercase tracking-wider">
            Top Routes
          </div>
          <div className="flex flex-col">
            {data.topRoutes.map((route, i) => (
              <div
                key={`${route.direction}-${route.chain.id}-${i}`}
                className="flex items-center justify-between text-[12px]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 text-secondary">
                    {route.direction === 'out' ? '\u2192' : '\u2190'}
                  </span>
                  <img
                    src={route.chain.iconUrl}
                    alt={route.chain.name}
                    className="size-3.5 rounded-xs"
                  />
                  <span className="text-primary">{route.chain.name}</span>
                </div>
                <span className="font-medium text-primary">
                  {formatCurrency(route.volume, 'usd')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-1 border-divider border-t pt-1 text-center text-[10px] text-secondary">
        Click to focus
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-secondary">{label}</span>
      <span className={valueClassName ?? 'font-medium text-primary'}>
        {value}
      </span>
    </div>
  )
}
