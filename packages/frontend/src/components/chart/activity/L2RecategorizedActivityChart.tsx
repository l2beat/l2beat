import type { Milestone } from '@l2beat/config'
import {
  assert,
  formatActivityCount,
  formatInteger,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { AreaChart, DefaultZIndexes, ZIndexLayer } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  type CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/CyanGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { ChartStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { useDevice } from '~/hooks/useDevice'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type {
  ActivityChangeEvent,
  ActivityChangeEventsData,
} from '~/server/features/layer2s/activity/getActivityChangeEvents'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { formatRange } from '~/utils/dates'
import type { ChartScale } from '../types'
import {
  ActivityChangePins,
  ActivityChangeTooltipLine,
  getEventKey,
  getVisibleChangeEvents,
} from './ActivityChangePins'

export const RECATEGORISED_ACTIVITY_CHART_META = {
  rollups: {
    label: 'Rollups',
    color: 'var(--chart-pink)',
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'var(--chart-cyan)',
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: 'var(--chart-yellow)',
    indicatorType: {
      shape: 'line',
    },
  },
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

interface Props {
  data: RecategorisedActivityChartData | undefined
  isLoading: boolean
  milestones: Milestone[]
  chartMeta: ChartMeta
  interactiveLegend: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
  }
  scale?: ChartScale
  changeEvents?: ActivityChangeEventsData
}

export function L2RecategorizedActivityChart({
  data,
  isLoading,
  milestones,
  scale,
  chartMeta,
  interactiveLegend: { dataKeys, onItemClick },
  changeEvents,
}: Props) {
  const { metric } = useActivityMetricContext()
  const { isDesktop } = useDevice()
  const [openChangeKey, setOpenChangeKey] = useState<string>()
  const events = useMemo(
    () => getVisibleChangeEvents(changeEvents, metric, dataKeys),
    [changeEvents, metric, dataKeys],
  )
  const eventsByTimestamp = useMemo(() => {
    const result = new Map<number, ActivityChangeEvent[]>()
    for (const event of events) {
      result.set(event.timestamp, [
        ...(result.get(event.timestamp) ?? []),
        event,
      ])
    }
    return result
  }, [events])

  const resolutionSeconds = UnixTime.periodToSeconds(data?.resolution ?? 'day')
  const chartData = useMemo(() => {
    const getDataPoint = (uops: number | null, tx: number | null) => {
      const count = metric === 'uops' ? uops : tx
      return count !== null ? count / resolutionSeconds : null
    }

    return data?.data.map(
      ([
        timestamp,
        rollupsUops,
        validiumsAndOptimiumsUops,
        othersUops,
        ethereumUops,
        rollupsTx,
        validiumsAndOptimiumsTx,
        othersTx,
        ethereumTx,
      ]) => {
        return {
          timestamp,
          rollups: getDataPoint(rollupsUops, rollupsTx),
          validiumsAndOptimiums: getDataPoint(
            validiumsAndOptimiumsUops,
            validiumsAndOptimiumsTx,
          ),
          others: getDataPoint(othersUops, othersTx),
          ethereum: getDataPoint(ethereumUops, ethereumTx),
        }
      },
    )
  }, [data, metric, resolutionSeconds])

  return (
    <ChartContainer
      meta={chartMeta}
      data={chartData}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick,
        disableOnboarding: true,
      }}
      milestones={milestones}
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      <AreaChart
        responsive
        data={chartData}
        margin={{ top: 20, right: 1 }}
        onClick={(state) => {
          // On touch the pins open the drawer; a tap on the chart only
          // shows the tooltip.
          if (!isDesktop || state.activeLabel == null) return
          const [event] = (
            eventsByTimestamp.get(Number(state.activeLabel)) ?? []
          ).sort((a, b) => b.score - a.score)
          if (event) setOpenChangeKey(getEventKey(event))
        }}
      >
        <defs>
          <PinkFillGradientDef id="rollups-fill" />
          <PinkStrokeGradientDef id="rollups-stroke" />
          <CyanFillGradientDef id="validiums-and-optimiums-fill" />
          <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
          <YellowFillGradientDef id="others-fill" />
          <YellowStrokeGradientDef id="others-stroke" />
          <EthereumFillGradientDef id="ethereum-fill" />
          <EthereumStrokeGradientDef id="ethereum-stroke" />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        <ChartStrokeOverFillAreaComponents
          data={[
            {
              dataKey: 'rollups',
              stroke: 'url(#rollups-stroke)',
              fill: 'url(#rollups-fill)',
              hide: !dataKeys.includes('rollups'),
            },
            {
              dataKey: 'validiumsAndOptimiums',
              stroke: 'url(#validiums-and-optimiums-stroke)',
              fill: 'url(#validiums-and-optimiums-fill)',
              hide: !dataKeys.includes('validiumsAndOptimiums'),
            },
            {
              dataKey: 'others',
              stroke: 'url(#others-stroke)',
              fill: 'url(#others-fill)',
              hide: !dataKeys.includes('others'),
            },
            {
              dataKey: 'ethereum',
              stroke: 'url(#ethereum-stroke)',
              fill: 'url(#ethereum-fill)',
              hide: !dataKeys.includes('ethereum'),
            },
          ]}
        />
        <ChartTooltip
          // The details popover or drawer replaces the tooltip while open.
          active={openChangeKey ? false : undefined}
          content={
            <CustomTooltip
              syncedUntil={data?.syncedUntil}
              resolutionSeconds={resolutionSeconds}
              metric={metric}
              chartMeta={chartMeta}
              changes={
                changeEvents && {
                  eventsByTimestamp,
                  projects: changeEvents.projects,
                  showHint: isDesktop,
                }
              }
            />
          }
        />
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            scale: scale === 'linear' ? 'auto' : scale,
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            unit: metric === 'uops' ? ' UOPS' : ' TPS',
          }}
          syncedUntil={data?.syncedUntil}
        />
        {changeEvents && (
          // Above the fills, the cursor and the active dots, so pins stay
          // visible and take the taps (fills cover them on LOG).
          <ZIndexLayer zIndex={DefaultZIndexes.activeDot + 1}>
            <ActivityChangePins
              events={events}
              data={changeEvents}
              chartData={chartData}
              chartMeta={chartMeta}
              isDesktop={isDesktop}
              openKey={openChangeKey}
              setOpenKey={setOpenChangeKey}
            />
          </ZIndexLayer>
        )}
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  payload,
  label,
  syncedUntil,
  resolutionSeconds,
  metric,
  chartMeta,
  changes,
}: CustomChartTooltipProps & {
  syncedUntil: number | undefined
  resolutionSeconds: number
  metric: ActivityMetric
  chartMeta: ChartMeta
  changes?: {
    eventsByTimestamp: Map<number, ActivityChangeEvent[]>
    projects: ActivityChangeEventsData['projects']
    showHint: boolean
  }
}) {
  if (!payload || typeof label !== 'number') return null
  const eventsThatDay = changes?.eventsByTimestamp.get(label) ?? []

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + resolutionSeconds)}
        </div>
        <span className="text-heading-16">Average {metric.toUpperCase()}</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.type === 'none') return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            assert(config, 'No config')

            const event = eventsThatDay.find((e) => e.category === entry.name)

            return (
              <div key={entry.name} className="flex flex-col gap-2">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <ChartDataIndicator
                      backgroundColor={config.color}
                      type={config.indicatorType}
                    />
                    <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                      {config.label}
                    </span>
                  </div>
                  <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                    {entry.value !== null && entry.value !== undefined
                      ? formatActivityCount(entry.value)
                      : 'No data'}
                  </span>
                </div>
                {event && changes && (
                  <ActivityChangeTooltipLine
                    event={event}
                    projects={changes.projects}
                    showHint={changes.showHint}
                  />
                )}
              </div>
            )
          })}
        </div>

        <span className="mt-3 text-heading-16">
          {metric === 'uops' ? 'Operations' : 'Transactions'} count
        </span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (
              entry.value === undefined ||
              entry.value === null ||
              entry.type === 'none'
            )
              return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            assert(config, 'No config')
            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {syncedUntil && syncedUntil < label
                    ? 'No data'
                    : formatInteger(entry.value * resolutionSeconds)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
