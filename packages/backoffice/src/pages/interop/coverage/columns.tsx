import { formatNumberWithCommas } from '@l2beat/shared-pure'
import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import { formatTimestamp } from '~/utils/formatTimestamp'
import { formatCompactUsd, formatPct } from './format'
import type { CoverageChain, CoveragePlugin } from './types'

const STATUS_LABELS: Record<CoverageChain['status'], string> = {
  'one-sided': 'One-sided',
  'unmapped-id': 'Unmapped id',
  'unknown-id': 'Unknown id',
  'not-tracked': 'Not tracked',
  'one-sided-disabled': 'One-sided, flag off',
}

const STATUS_CLASSES: Record<CoverageChain['status'], string> = {
  'one-sided': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'unmapped-id': 'border-violet-200 bg-violet-50 text-violet-800',
  'unknown-id': 'border-amber-200 bg-amber-50 text-amber-800',
  'not-tracked': 'border-red-200 bg-red-50 text-red-700',
  'one-sided-disabled': 'border-sky-200 bg-sky-50 text-sky-800',
}

const MAX_PLUGIN_BADGES = 4

function formatPluginValue(plugin: CoverageChain['plugins'][number]): string {
  return plugin.uncountedValueUsd > 0
    ? formatCompactUsd(plugin.uncountedValueUsd)
    : `${formatNumberWithCommas(plugin.uncountedEvents)} ev`
}

function describePlugin(plugin: CoverageChain['plugins'][number]): string {
  const path = plugin.supportsOneSided ? '' : ', no one-sided path'
  return `${plugin.plugin}: ${formatPluginValue(plugin)} uncounted, ${formatNumberWithCommas(plugin.uncountedEvents)} events${path}`
}

const STATUS_DESCRIPTIONS: Record<CoverageChain['status'], string> = {
  'one-sided':
    'An enabled one-sided chain. Plugins with a one-sided path count its transfers from our side.',
  'unmapped-id':
    'We track this chain, but the plugin reports an id it cannot map, so these events are dropped.',
  'unknown-id': 'No config or verified list names this id.',
  'not-tracked': 'We neither capture this chain nor treat it as one-sided.',
  'one-sided-disabled':
    'A configured one-sided chain whose feature flag is off here.',
}

const chainHelper = createColumnHelper<CoverageChain>()

export const coverageChainColumns: TableOptions<CoverageChain>['columns'] = [
  chainHelper.accessor('label', {
    header: 'Chain',
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="font-medium">{row.original.label}</div>
        <div
          className="max-w-72 truncate font-mono text-muted-foreground text-xs"
          title={row.original.rawChains.join(', ')}
        >
          {row.original.rawChains.join(', ')}
        </div>
      </div>
    ),
    meta: { csvHeader: 'Chain' },
  }),
  chainHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={STATUS_CLASSES[row.original.status]}
        title={STATUS_DESCRIPTIONS[row.original.status]}
      >
        {STATUS_LABELS[row.original.status]}
      </Badge>
    ),
    meta: { csvHeader: 'Status', filter: { kind: 'select' } },
  }),
  chainHelper.accessor('uncountedValueUsd', {
    header: () => (
      <span title="Events with this chain on the other side that no plugin turned into a transfer">
        Uncounted
      </span>
    ),
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">
        {formatCompactUsd(getValue())}
      </span>
    ),
    meta: { csvHeader: 'Uncounted volume USD' },
  }),
  chainHelper.accessor('uncountedEvents', {
    header: 'Events',
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatNumberWithCommas(getValue())}</span>
    ),
    meta: { csvHeader: 'Events' },
  }),
  chainHelper.accessor(
    (row) => (row.events === 0 ? 0 : (100 * row.pricedEvents) / row.events),
    {
      id: 'pricedPct',
      header: 'Priced',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground tabular-nums">
          {formatPct(getValue())}
        </span>
      ),
      meta: { csvHeader: 'Priced events %' },
    },
  ),
  chainHelper.accessor(
    (row) => row.plugins.map((plugin) => plugin.plugin).join(' '),
    {
      id: 'plugins',
      header: 'Plugins',
      enableSorting: false,
      cell: ({ row }) => {
        const shown = row.original.plugins.slice(0, MAX_PLUGIN_BADGES)
        const hidden = row.original.plugins.slice(MAX_PLUGIN_BADGES)
        return (
          <div className="flex min-w-80 max-w-xl flex-wrap gap-1">
            {shown.map((plugin) => (
              <Badge
                key={plugin.plugin}
                variant="secondary"
                className={
                  plugin.supportsOneSided
                    ? 'font-normal'
                    : 'border-amber-200 bg-amber-50 font-normal text-amber-800'
                }
                title={describePlugin(plugin)}
              >
                {plugin.plugin}
                <span className="text-muted-foreground tabular-nums">
                  {formatPluginValue(plugin)}
                </span>
              </Badge>
            ))}
            {hidden.length > 0 ? (
              <Badge
                variant="outline"
                className="font-normal"
                title={hidden.map(describePlugin).join('\n')}
              >
                +{hidden.length} more
              </Badge>
            ) : null}
          </div>
        )
      },
      meta: { csvHeader: 'Plugins' },
    },
  ),
  chainHelper.accessor('lastSeen', {
    header: 'Last seen (UTC)',
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap text-muted-foreground text-xs">
        {formatTimestamp(getValue())}
      </span>
    ),
    meta: { csvHeader: 'Last seen' },
  }),
]

const pluginHelper = createColumnHelper<CoveragePlugin>()

export const coveragePluginColumns: TableOptions<CoveragePlugin>['columns'] = [
  pluginHelper.accessor('plugin', {
    header: 'Plugin',
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    meta: { csvHeader: 'Plugin' },
  }),
  pluginHelper.accessor('supportsOneSided', {
    header: () => (
      <span title="Whether the plugin emits partial transfers for one-sided chains">
        One-sided path
      </span>
    ),
    cell: ({ getValue }) =>
      getValue() ? (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
          Yes
        </Badge>
      ) : (
        <Badge className="border-amber-200 bg-amber-50 text-amber-800">
          No
        </Badge>
      ),
    meta: { csvHeader: 'One-sided path' },
  }),
  pluginHelper.accessor((row) => row.coveragePct ?? -1, {
    id: 'coveragePct',
    header: 'Coverage',
    cell: ({ row }) => <CoverageBar pct={row.original.coveragePct} />,
    meta: { csvHeader: 'Coverage %' },
  }),
  pluginHelper.accessor('coveredValueUsd', {
    header: 'Covered volume',
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatCompactUsd(getValue())}</span>
    ),
    meta: { csvHeader: 'Covered volume USD' },
  }),
  pluginHelper.accessor('uncoveredValueUsd', {
    header: 'Uncovered volume',
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">
        {formatCompactUsd(getValue())}
      </span>
    ),
    meta: { csvHeader: 'Uncovered volume USD' },
  }),
  pluginHelper.accessor((row) => row.uncoveredByStatus['one-sided'], {
    id: 'uncoveredOneSided',
    header: () => (
      <span title="Uncounted volume to enabled one-sided chains. A one-sided path, or a fix to it, counts this right away.">
        On one-sided chains
      </span>
    ),
    cell: ({ getValue }) => <UsdOrDash value={getValue()} />,
    meta: { csvHeader: 'Uncovered on one-sided chains USD' },
  }),
  pluginHelper.accessor(
    (row) =>
      row.uncoveredByStatus['not-tracked'] +
      row.uncoveredByStatus['one-sided-disabled'],
    {
      id: 'uncoveredUntracked',
      header: () => (
        <span title="Uncounted volume to chains we don't track. Counted once the chain is enabled as one-sided and the plugin has a path.">
          On untracked chains
        </span>
      ),
      cell: ({ getValue }) => <UsdOrDash value={getValue()} />,
      meta: { csvHeader: 'Uncovered on untracked chains USD' },
    },
  ),
  pluginHelper.accessor(
    (row) =>
      row.uncoveredByStatus['unmapped-id'] +
      row.uncoveredByStatus['unknown-id'],
    {
      id: 'uncoveredIds',
      header: () => (
        <span title="Uncounted volume behind ids the plugin can't map (a tracked chain) or nobody can name">
          Id gaps
        </span>
      ),
      cell: ({ getValue }) => <UsdOrDash value={getValue()} />,
      meta: { csvHeader: 'Uncovered behind id gaps USD' },
    },
  ),
  pluginHelper.accessor('transfers', {
    header: 'Transfers',
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatNumberWithCommas(getValue())}</span>
    ),
    meta: { csvHeader: 'Transfers' },
  }),
  pluginHelper.accessor('uncoveredEvents', {
    header: 'Uncovered events',
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatNumberWithCommas(getValue())}</span>
    ),
    meta: { csvHeader: 'Uncovered events' },
  }),
  pluginHelper.accessor(
    (row) => row.topMissing.map((chain) => chain.label).join(', '),
    {
      id: 'topMissing',
      header: 'Top missing chains',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex max-w-md flex-wrap gap-1">
          {row.original.topMissing.map((chain) => (
            <Badge
              key={chain.label}
              variant="secondary"
              className="font-normal"
            >
              {chain.label}
              <span className="text-muted-foreground tabular-nums">
                {formatCompactUsd(chain.valueUsd)}
              </span>
            </Badge>
          ))}
        </div>
      ),
      meta: { csvHeader: 'Top missing chains' },
    },
  ),
]

function UsdOrDash({ value }: { value: number }) {
  return value > 0 ? (
    <span className="tabular-nums">{formatCompactUsd(value)}</span>
  ) : (
    <span className="text-muted-foreground">-</span>
  )
}

function CoverageBar({ pct }: { pct: number | undefined }) {
  if (pct === undefined) {
    return <span className="text-muted-foreground">-</span>
  }
  return (
    <div className="flex min-w-36 items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-red-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums">{formatPct(pct)}</span>
    </div>
  )
}
