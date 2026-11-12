import { useState } from 'react'
import { useEthereumHead } from '../../../live/EthereumHeadContext'
import type { DailyPoint } from '../../../live/simulatedHistory'
import { averageOf } from '../derive'
import { fmtCompact, fmtEth, fmtNumber, fmtPercent } from '../format'
import { HistoryChart } from '../ui/HistoryChart'
import {
  Instrument,
  Panel,
  Readout,
  SectionHead,
  Segmented,
  Unit,
} from '../ui/Panel'
import { Ticker } from '../ui/Ticker'
import { RANGES, type Range, sliceRange, withToday } from './history'

type Level = 'supply' | 'staked'

/** The asset: how much ETH exists, how much is minted and burned today, and how much is staked to secure the chain */
export function Economics({ history }: { history: DailyPoint[] }) {
  const head = useEthereumHead()
  const today = head.today
  const net = today ? today.issuedEth - today.burnedEth : undefined
  const stakedShare =
    head.stakedEth !== undefined && head.supplyEth
      ? head.stakedEth / head.supplyEth
      : undefined
  const fmtWholeEth = (v: number) => fmtNumber(v)
  return (
    <section id="economics" className="scroll-mt-20">
      <SectionHead
        title="ETH economics"
        lede="Every block mints a little ETH for validators and burns the base fee and blob fee its users paid. Whether supply grows or shrinks depends on how much Ethereum is used."
      />
      <Instrument className="md:grid-cols-12">
        <div className="grid grid-cols-2 gap-px bg-divider sm:grid-cols-3 md:col-span-12 lg:grid-cols-6">
          <Readout label="Supply" cadence="blk">
            <Big>
              <Ticker value={head.supplyEth} format={fmtWholeEth} />
              <Unit>ETH</Unit>
            </Big>
          </Readout>
          <Readout label="Issued today" cadence="blk">
            <Big>
              <Ticker value={today?.issuedEth} format={fmtEth} />
              <Unit>ETH</Unit>
            </Big>
          </Readout>
          <Readout label="Burned today" cadence="blk">
            <Big>
              <Ticker value={today?.burnedEth} format={fmtEth} />
              <Unit>ETH</Unit>
            </Big>
          </Readout>
          <Readout
            label="Net today"
            cadence="blk"
            footer={
              net === undefined
                ? 'since 00:00 UTC'
                : net > 0
                  ? 'supply growing today'
                  : 'supply shrinking today'
            }
          >
            <Big>
              <Ticker
                value={net}
                format={(v) => `${v > 0 ? '+' : ''}${fmtEth(v)}`}
              />
              <Unit>ETH</Unit>
            </Big>
          </Readout>
          <Readout
            label="Staked"
            cadence="epoch"
            footer={
              stakedShare === undefined
                ? ''
                : `${fmtPercent(stakedShare, 1)} of supply`
            }
          >
            <Big>
              <Ticker value={head.stakedEth} format={(v) => fmtCompact(v)} />
              <Unit>ETH</Unit>
            </Big>
          </Readout>
          <Readout label="Active validators" cadence="epoch">
            <Big>
              <Ticker
                value={head.activeValidators}
                format={(v) => fmtNumber(Math.round(v))}
              />
            </Big>
          </Readout>
        </div>
        <IssuedVsBurned history={history} className="md:col-span-7" />
        <Levels history={history} className="md:col-span-5" />
      </Instrument>
    </section>
  )
}

function Big({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium text-[18px] text-primary">{children}</span>
  )
}

function IssuedVsBurned({
  history,
  className,
}: {
  history: DailyPoint[]
  className?: string
}) {
  const head = useEthereumHead()
  const [range, setRange] = useState<Range>('90d')
  const points = sliceRange(history, range)
  const today = head.today
  const timestamps = withToday(points, today?.startedAt)
  const partial = today !== undefined
  const avgNet = averageOf(history, 30, (p) => p.issuedEth - p.burnedEth)
  return (
    <Panel
      title="Issued and burned, per day"
      cadence="day"
      className={className}
      accessory={
        <Segmented
          label="Range"
          options={RANGES}
          value={range}
          onChange={setRange}
        />
      }
    >
      <div className="px-3 pt-2 pb-2">
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-secondary">
          <Swatch color="var(--chart-cyan)">Issued</Swatch>
          <Swatch color="var(--chart-orange)">Burned, drawn below zero</Swatch>
          <Swatch color="var(--primary)" line>
            Net
          </Swatch>
          <span className="ml-auto font-mono">
            30-day avg net {avgNet > 0 ? '+' : ''}
            {fmtEth(avgNet)} ETH/day
          </span>
        </div>
        <HistoryChart
          label="ETH issued and burned per day, with the net change in supply"
          timestamps={timestamps}
          partial={partial}
          format={(v) => fmtCompact(v)}
          height={220}
          series={[
            {
              key: 'issued',
              label: 'Issued',
              color: 'var(--chart-cyan)',
              mark: 'bar',
              values: [
                ...points.map((p) => p.issuedEth),
                ...(today ? [today.issuedEth] : []),
              ],
            },
            {
              key: 'burned',
              label: 'Burned',
              color: 'var(--chart-orange)',
              mark: 'bar',
              values: [
                ...points.map((p) => -p.burnedEth),
                ...(today ? [-today.burnedEth] : []),
              ],
            },
            {
              key: 'net',
              label: 'Net',
              color: 'var(--primary)',
              mark: 'line',
              values: [
                ...points.map((p) => p.issuedEth - p.burnedEth),
                ...(today ? [today.issuedEth - today.burnedEth] : []),
              ],
            },
          ]}
        />
      </div>
    </Panel>
  )
}

function Levels({
  history,
  className,
}: {
  history: DailyPoint[]
  className?: string
}) {
  const head = useEthereumHead()
  const [level, setLevel] = useState<Level>('supply')
  const [range, setRange] = useState<Range>('1y')
  const points = sliceRange(history, range)
  const live = level === 'supply' ? head.supplyEth : head.stakedEth
  const timestamps = withToday(
    points,
    live === undefined ? undefined : head.today?.startedAt,
  )
  const partial = live !== undefined && head.today !== undefined
  return (
    <Panel
      title={level === 'supply' ? 'ETH supply' : 'Staked ETH'}
      cadence="day"
      className={className}
      accessory={
        <>
          <Segmented
            label="Series"
            options={[
              { value: 'supply', label: 'Supply' },
              { value: 'staked', label: 'Staked' },
            ]}
            value={level}
            onChange={setLevel}
          />
          <Segmented
            label="Range"
            options={RANGES.filter((r) => r.value !== '30d')}
            value={range}
            onChange={setRange}
          />
        </>
      }
    >
      <div className="px-3 pt-2 pb-2">
        <div className="mb-2 text-[11px] text-secondary">
          End of each day, in ETH; the last point is now
        </div>
        <HistoryChart
          label={
            level === 'supply' ? 'ETH supply per day' : 'Staked ETH per day'
          }
          timestamps={timestamps}
          partial={partial}
          includeZero={false}
          format={(v) => fmtCompact(v)}
          height={220}
          series={[
            {
              key: level,
              label: level === 'supply' ? 'Supply' : 'Staked',
              color: 'var(--chart-ethereum)',
              mark: 'area',
              values: [
                ...points.map((p) =>
                  level === 'supply' ? p.supplyEth : p.stakedEth,
                ),
                ...(partial && live !== undefined ? [live] : []),
              ],
            },
          ]}
        />
      </div>
    </Panel>
  )
}

function Swatch({
  color,
  line,
  children,
}: {
  color: string
  line?: boolean
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={line ? 'h-0.5 w-3 rounded-full' : 'size-2 rounded-[2px]'}
        style={{ background: color }}
      />
      {children}
    </span>
  )
}
