import type {
  FrameworkDominanceEntry,
  TokenFrameworksData,
} from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import {
  type DominanceRow,
  InteropDominanceContent,
} from '../../components/InteropDominanceContent'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'

type DisplayFramework = {
  iconUrl?: string
  label: string
  name: string
  color: string
  slug?: string
}

type DisplayItem = {
  entry: FrameworkDominanceEntry
  framework: DisplayFramework
}

export function FrameworkDominanceContent({
  tokenFrameworks,
  frameworkDominance,
  changePeriod,
  isLoading,
}: {
  tokenFrameworks: InteropTokenFramework[]
  frameworkDominance: TokenFrameworksData['frameworkDominance'] | undefined
  changePeriod: TokenFrameworksData['changePeriod'] | undefined
  isLoading: boolean
}) {
  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))

  return (
    <InteropDominanceContent
      title="Framework Dominance by"
      tabsName="frameworkDominanceMetric"
      transfersStatLabel="Number of transfers"
      emptyState="No data for the selected chains."
      isLoading={isLoading}
      changePeriod={changePeriod}
      getMetricData={(metric) => {
        const metricData = frameworkDominance
          ? metric === 'volume'
            ? frameworkDominance.volume
            : frameworkDominance.transfers
          : undefined
        if (!metricData) return { total: 0, rows: [] }
        return {
          total: metricData.total,
          rows: buildDisplayItems(metricData.entries, frameworksById).map(
            toDominanceRow,
          ),
        }
      }}
    />
  )
}

function toDominanceRow(item: DisplayItem): DominanceRow {
  const { entry, framework } = item
  return {
    id: entry.id,
    color: framework.color,
    volume: entry.volume,
    transferCount: entry.transferCount,
    previousVolume: entry.previousVolume,
    previousTransferCount: entry.previousTransferCount,
    averageDurationSeconds: entry.averageDurationSeconds,
    header: <FrameworkHeader framework={framework} />,
    thirdStat: {
      label: 'Avg. transfer size',
      value:
        entry.averageValue !== null
          ? formatCurrency(entry.averageValue, 'usd', { decimals: 2 })
          : '—',
    },
  }
}

function FrameworkHeader({ framework }: { framework: DisplayFramework }) {
  const content = (
    <>
      {framework.iconUrl && (
        <img
          src={framework.iconUrl}
          alt={framework.name}
          className="size-6 rounded-full"
        />
      )}
      <div className="flex items-center gap-1">
        <span className="font-bold text-heading-16">{framework.label}</span>
        {framework.label !== framework.name && (
          <span className="font-medium text-label-value-16 text-secondary">
            {framework.name}
          </span>
        )}
      </div>
    </>
  )

  if (framework.slug) {
    return (
      <a
        href={`/interop/protocols/${framework.slug}`}
        className="-mx-2 inline-flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
      >
        {content}
      </a>
    )
  }
  return <div className="flex items-center gap-2">{content}</div>
}

function buildDisplayItems(
  entries: FrameworkDominanceEntry[],
  frameworksById: Map<string, InteropTokenFramework>,
): DisplayItem[] {
  if (entries.length <= 5) {
    return entries.flatMap((entry) => {
      const framework = frameworksById.get(entry.id)
      return framework ? [{ entry, framework }] : []
    })
  }

  const top4: DisplayItem[] = entries.slice(0, 4).flatMap((entry) => {
    const framework = frameworksById.get(entry.id)
    return framework ? [{ entry, framework }] : []
  })
  return [...top4, buildOthersItem(entries.slice(4))]
}

function buildOthersItem(entries: FrameworkDominanceEntry[]): DisplayItem {
  const volume = entries.reduce((sum, e) => sum + e.volume, 0)
  const transferCount = entries.reduce((sum, e) => sum + e.transferCount, 0)

  const previousVolume = entries.reduce(
    (sum, e) => sum + (e.previousVolume ?? 0),
    0,
  )
  const previousTransferCount = entries.reduce(
    (sum, e) => sum + (e.previousTransferCount ?? 0),
    0,
  )
  const durationWeightedSum = entries.reduce(
    (s, e) => s + (e.averageDurationSeconds ?? 0) * e.transferCount,
    0,
  )
  const averageDurationSeconds =
    transferCount > 0 ? Math.floor(durationWeightedSum / transferCount) : null

  const averageValue = transferCount > 0 ? volume / transferCount : null

  return {
    entry: {
      id: '__others__',
      volume,
      transferCount,
      previousVolume,
      previousTransferCount,
      averageDurationSeconds,
      averageValue,
    },
    framework: {
      label: 'Others',
      name: 'Others',
      color: '#E9BB00',
    },
  }
}
