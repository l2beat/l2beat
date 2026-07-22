import type { IntentBridgesData } from '~/server/features/scaling/interop/getIntentBridgesData'
import { formatInteger } from '~/utils/number-format/formatInteger'
import {
  type DominanceMetric,
  type DominanceRow,
  InteropDominanceContent,
} from '../../../components/InteropDominanceContent'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import {
  buildIntentBridgeRows,
  type IntentBridgeRow,
} from '../../utils/buildIntentBridgeRows'

type ActiveIntentBridgeRow = IntentBridgeRow & {
  activity: NonNullable<IntentBridgeRow['activity']>
}

export function IntentBridgeDominanceContent({
  intentBridges,
  data,
  isLoading,
}: {
  intentBridges: InteropIntentBridge[]
  data: IntentBridgesData | undefined
  isLoading: boolean
}) {
  return (
    <InteropDominanceContent
      title="Intent Bridge Dominance by"
      tabsName="intentBridgeDominanceMetric"
      transfersStatLabel="Transfers"
      emptyState="No intent bridge activity found."
      isLoading={isLoading}
      changePeriod={data?.changePeriod}
      className="lg:flex lg:h-full lg:flex-col"
      tabsClassName="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
      tabsContentClassName="lg:min-h-0 lg:flex-1"
      scrollClassName="max-h-[42rem] pr-3 lg:h-full lg:max-h-none"
      getMetricData={(metric) => {
        const total = data
          ? metric === 'volume'
            ? data.activity.totalVolume
            : data.activity.totalTransferCount
          : 0
        const rows = data
          ? sortByMetric(
              buildIntentBridgeRows(intentBridges, data).filter(hasActivity),
              metric,
            ).map(toDominanceRow)
          : []
        return { total, rows }
      }}
    />
  )
}

function sortByMetric(
  rows: ActiveIntentBridgeRow[],
  metric: DominanceMetric,
): ActiveIntentBridgeRow[] {
  return rows.toSorted((a, b) =>
    metric === 'volume'
      ? b.activity.volume - a.activity.volume
      : b.activity.transferCount - a.activity.transferCount,
  )
}

function hasActivity(row: IntentBridgeRow): row is ActiveIntentBridgeRow {
  return row.activity !== undefined
}

function toDominanceRow(item: ActiveIntentBridgeRow): DominanceRow {
  const { activity, bridge } = item
  return {
    id: bridge.id,
    color: bridge.color,
    volume: activity.volume,
    transferCount: activity.transferCount,
    previousVolume: activity.previousVolume,
    previousTransferCount: activity.previousTransferCount,
    averageDurationSeconds: activity.averageDurationSeconds,
    header: <BridgeHeader bridge={bridge} />,
    thirdStat: {
      label: 'Active chains / tokens',
      value:
        item.activeChainCount !== undefined &&
        item.activeTokenCount !== undefined
          ? `${formatInteger(item.activeChainCount)} / ${formatInteger(
              item.activeTokenCount,
            )}`
          : '—',
    },
  }
}

function BridgeHeader({ bridge }: { bridge: InteropIntentBridge }) {
  return (
    <a
      href={`/interop/protocols/${bridge.slug}`}
      className="-mx-2 inline-flex min-w-0 items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
    >
      <img
        src={bridge.iconUrl}
        alt={bridge.name}
        className="size-6 shrink-0 rounded-full"
      />
      <span className="min-w-0 truncate font-bold text-heading-16">
        {bridge.name}
      </span>
    </a>
  )
}
