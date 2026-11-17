import { UnixTime } from '@l2beat/shared-pure'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  InteropHistoryProtocol,
  InteropHistoryResolution,
} from '~/server/features/layer2s/interop/history/types'
import { useTRPC } from '~/trpc/React'
import { ChainSelect } from '../../components/chain-selector/ChainSelect'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import {
  applyHistoryExclusions,
  type HistoryExclusions,
  NO_EXCLUSIONS,
} from '../utils/applyHistoryExclusions'
import {
  buildHistoryChart,
  type HistoryMetric,
} from '../utils/buildHistoryChart'
import { findZeroDays } from '../utils/findZeroDays'
import { HistoryDataQuality } from './HistoryDataQuality'
import { HistoryExclusionsPanel } from './HistoryExclusionsPanel'
import { HISTORY_KNOWN_EVENTS } from './HistoryExplainer'
import { HistoryProtocolFilter } from './HistoryProtocolFilter'
import { InteropHistoryChart } from './InteropHistoryChart'

const METRICS: { value: HistoryMetric; label: string }[] = [
  { value: 'volume', label: 'Volume' },
  { value: 'flows', label: 'Chain flows' },
  { value: 'netFlow', label: 'Net flow' },
  { value: 'transfers', label: 'Transfers' },
  { value: 'duration', label: 'Transfer time' },
]

const RANGES: Record<
  InteropHistoryResolution,
  { value: string; label: string; days: number | undefined }[]
> = {
  daily: [
    { value: 'all', label: 'All', days: undefined },
    { value: '180d', label: '180D', days: 180 },
    { value: '90d', label: '90D', days: 90 },
    { value: '30d', label: '30D', days: 30 },
  ],
  hourly: [
    { value: 'all', label: '14D', days: undefined },
    { value: '7d', label: '7D', days: 7 },
    { value: '3d', label: '3D', days: 3 },
  ],
}

/** A zero day is marked on the chart if it misses this share of the total. */
const ZERO_DAY_SHARE_OF_TOTAL = 0.05
const NET_FLOW_CHAIN_COUNTS = [3, 5, 8]

export function InteropHistoryView({
  interopChains,
}: {
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const [resolution, setResolution] =
    useState<InteropHistoryResolution>('daily')
  const [protocolIds, setProtocolIds] = useState<string[] | undefined>()
  const [metric, setMetric] = useState<HistoryMetric>('volume')
  const [range, setRange] = useState('all')
  const [splitByProtocol, setSplitByProtocol] = useState(false)
  const [showRaw, setShowRaw] = useState(false)
  // Shown in full, a bogus day is thousands of times the rest.
  const [scale, setScale] = useState<'linear' | 'log'>('log')
  const [exclusions, setExclusions] = useState<HistoryExclusions>(NO_EXCLUSIONS)
  const [focusChain, setFocusChain] = useState<string | undefined>()
  const [netFlowChainCount, setNetFlowChainCount] = useState(5)
  const [protocolOptions, setProtocolOptions] = useState<
    InteropHistoryProtocol[]
  >([])

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...trpc.interop.history.queryOptions({
      from: selectedChains.from,
      to: selectedChains.to,
      protocolIds,
      resolution,
    }),
    placeholderData: keepPreviousData,
  })

  // The protocol list comes from an unfiltered response, so filtering
  // never hides the protocols to pick from.
  useEffect(() => {
    if (data && !isPlaceholderData && protocolIds === undefined) {
      setProtocolOptions(data.protocols)
    }
  }, [data, isPlaceholderData, protocolIds])

  const chainsByVolume = useMemo(() => {
    if (!data) return []
    const total = (chain: string) => {
      const s = data.byChain[chain]
      return s
        ? s.inflow.reduce((a, b) => a + b, 0) +
            s.outflow.reduce((a, b) => a + b, 0)
        : 0
    }
    return Object.keys(data.byChain).sort((a, b) => total(b) - total(a))
  }, [data])
  const flowChain =
    focusChain && chainsByVolume.includes(focusChain)
      ? focusChain
      : chainsByVolume[0]

  const cleaned = useMemo(
    () => (data ? applyHistoryExclusions(data, exclusions) : undefined),
    [data, exclusions],
  )
  const zeroDays = useMemo(() => (data ? findZeroDays(data) : []), [data])
  const chainColors = useMemo(
    () => Object.fromEntries(interopChains.map((c) => [c.id, c.color])),
    [interopChains],
  )
  const chart = useMemo(() => {
    if (!data || !cleaned) return undefined
    return buildHistoryChart(
      data,
      cleaned,
      {
        metric,
        splitByProtocol,
        showRaw,
        focusChain: flowChain,
        netFlowChains: chainsByVolume.slice(0, netFlowChainCount),
        excludeBlocked: exclusions.blocked,
      },
      chainColors,
    )
  }, [
    data,
    cleaned,
    metric,
    splitByProtocol,
    showRaw,
    flowChain,
    chainsByVolume,
    netFlowChainCount,
    exclusions.blocked,
    chainColors,
  ])

  const pointRange = useMemo((): [number, number] => {
    const points = data?.points ?? []
    const last = points.length - 1
    const days = RANGES[resolution].find((r) => r.value === range)?.days
    if (days === undefined || last < 0) return [0, Math.max(0, last)]
    const from = (points[last]?.timestamp ?? 0) - days * UnixTime.DAY
    const first = points.findIndex((p) => p.timestamp > from)
    return [Math.max(0, first), last]
  }, [data, resolution, range])

  const totalTransfers = (point: number) =>
    Object.values(data?.byProtocol ?? {}).reduce(
      (sum, s) => sum + (s.transferCount[point] ?? 0),
      0,
    )
  const inRange = (point: number) =>
    point >= pointRange[0] && point <= pointRange[1]
  const shownChart = chart && {
    ...chart,
    rows: chart.rows.filter((row) => inRange(row.point)),
  }
  const cappedLanes = (cleaned?.cappedLanes ?? []).filter((l) =>
    inRange(l.point),
  )
  const tokenDays = (cleaned?.tokenDays ?? []).filter((t) => inRange(t.point))
  const zeroDaysInRange = zeroDays.filter((z) => inRange(z.point))
  // On the chart, only a zero day that the selection's total would show.
  const shownZeroDays = ['volume', 'transfers'].includes(metric)
    ? zeroDaysInRange.filter(
        (z) =>
          z.usual >=
          ZERO_DAY_SHARE_OF_TOTAL * (totalTransfers(z.point) + z.usual),
      )
    : []
  const pointsInRange = (data?.points ?? []).filter((_, i) => inRange(i))
  const missingCount = pointsInRange.filter((p) => p.snapshot === null).length
  const blockedCount = pointsInRange.filter((p) => p.isBlocked).length

  const supportsSplit = metric !== 'flows' && metric !== 'netFlow'
  const supportsRaw = metric === 'volume' || metric === 'flows'

  return (
    <div className="grid gap-5 min-[1280px]:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex min-w-0 flex-col gap-5">
        <PrimaryCard className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <RadioGroup
              name="historyMetric"
              value={metric}
              onValueChange={(v) => {
                setMetric(v as HistoryMetric)
                if (v === 'duration') setScale('log')
              }}
            >
              {METRICS.map((m) => (
                <RadioGroupItem key={m.value} value={m.value}>
                  {m.label}
                </RadioGroupItem>
              ))}
            </RadioGroup>
            <div className="flex flex-wrap items-center gap-2">
              <RadioGroup
                name="historyResolution"
                value={resolution}
                onValueChange={(v) => {
                  setResolution(v as InteropHistoryResolution)
                  setRange('all')
                }}
              >
                <RadioGroupItem value="daily">Daily</RadioGroupItem>
                <RadioGroupItem value="hourly">Hourly</RadioGroupItem>
              </RadioGroup>
              <RadioGroup
                name="historyRange"
                value={range}
                onValueChange={setRange}
              >
                {RANGES[resolution].map((r) => (
                  <RadioGroupItem key={r.value} value={r.value}>
                    {r.label}
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <HistoryProtocolFilter
              protocols={protocolOptions}
              selected={protocolIds}
              onChange={setProtocolIds}
            />
            {metric === 'flows' && chainsByVolume.length > 0 && flowChain && (
              <div className="w-56">
                <ChainSelect
                  chains={interopChains.filter((c) =>
                    chainsByVolume.includes(c.id),
                  )}
                  value={flowChain}
                  onChange={setFocusChain}
                  excludeId=""
                  label="Chain"
                />
              </div>
            )}
            {supportsSplit && (
              <Checkbox
                name="historySplitByProtocol"
                checked={splitByProtocol}
                onCheckedChange={(c) => setSplitByProtocol(c === true)}
              >
                Split by protocol
              </Checkbox>
            )}
            {supportsRaw && (
              <Checkbox
                name="historyShowRaw"
                checked={showRaw}
                onCheckedChange={(c) => setShowRaw(c === true)}
                disabled={!exclusions.laneCap && !exclusions.tokenDays}
              >
                Before exclusions
              </Checkbox>
            )}
            <RadioGroup
              name="historyScale"
              value={scale}
              onValueChange={(v) => setScale(v as 'linear' | 'log')}
            >
              <RadioGroupItem value="linear">Linear</RadioGroupItem>
              <RadioGroupItem value="log">Log</RadioGroupItem>
            </RadioGroup>
          </div>
          {metric === 'netFlow' && (
            <RadioGroup
              name="historyNetFlowChains"
              value={String(netFlowChainCount)}
              onValueChange={(v) => setNetFlowChainCount(Number(v))}
            >
              {NET_FLOW_CHAIN_COUNTS.map((count) => (
                <RadioGroupItem key={count} value={String(count)}>
                  Top {count} chains
                </RadioGroupItem>
              ))}
            </RadioGroup>
          )}
          <InteropHistoryChart
            data={data}
            chart={shownChart}
            cappedLanes={supportsRaw ? cappedLanes : []}
            tokenDays={supportsRaw ? tokenDays : []}
            zeroDays={shownZeroDays}
            scale={scale}
            excludeBlocked={exclusions.blocked}
            milestones={HISTORY_KNOWN_EVENTS}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
          />
        </PrimaryCard>
        {data && (
          <HistoryDataQuality
            data={data}
            range={pointRange}
            cappedLanes={cappedLanes}
            tokenDays={tokenDays}
            zeroDays={zeroDaysInRange}
          />
        )}
      </div>
      <div className="min-[1280px]:sticky min-[1280px]:top-24 min-[1280px]:self-start">
        <HistoryExclusionsPanel
          exclusions={exclusions}
          setExclusions={setExclusions}
          cappedLanes={cappedLanes}
          tokenDays={tokenDays}
          zeroDays={zeroDaysInRange}
          missingCount={missingCount}
          blockedCount={blockedCount}
        />
      </div>
    </div>
  )
}
