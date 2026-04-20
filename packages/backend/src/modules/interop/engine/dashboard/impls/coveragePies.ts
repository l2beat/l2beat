import type {
  Database,
  InteropEventSupportBreakdownRecord,
} from '@l2beat/database'

export const COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT = 2

const CHAIN_ALIASES: Record<string, string> = {
  Unknown_792703809: 'solana',
  Unknown_30367: 'hyperevm',
  Unknown_30383: 'plasma',
  Unknown_30385: 'dinari',
  Unknown_30390: 'monad',
  Unknown_30396: 'stable',
  Unknown_30292: 'etherlink',
  Unknown_30403: 'citrea',
  Unknown_30420: 'tron',
  Unknown_30362: 'berachain',
  Unknown_30212: 'conflux',
  Unknown_30150: 'klaytn',
}

const CHART_CONFIGS = [
  {
    id: 'layerzero-packet-oft-sent',
    title: 'layerzero-v2.PacketOFTSent destination chains',
    centerLabel: 'PacketOFTSent events',
    type: 'layerzero-v2.PacketOFTSent',
    chainArg: '$dstChain' as const,
  },
  {
    id: 'layerzero-packet-oft-delivered',
    title: 'layerzero-v2.PacketOFTDelivered source chains',
    centerLabel: 'PacketOFTDelivered events',
    type: 'layerzero-v2.PacketOFTDelivered',
    chainArg: '$srcChain' as const,
  },
  {
    id: 'relay-token-sent',
    title: 'relay.TokenSent destination chains',
    centerLabel: 'relay.TokenSent events',
    type: 'relay.TokenSent',
    chainArg: '$dstChain' as const,
  },
  {
    id: 'relay-token-received',
    title: 'relay.TokenReceived source chains',
    centerLabel: 'relay.TokenReceived events',
    type: 'relay.TokenReceived',
    chainArg: '$srcChain' as const,
  },
  {
    id: 'ccip-send-requested',
    title: 'ccip.CCIPSendRequested destination chains',
    centerLabel: 'CCIPSendRequested events',
    type: 'ccip.CCIPSendRequested',
    chainArg: '$dstChain' as const,
  },
  {
    id: 'ccip-execution-state-changed',
    title: 'ccip.ExecutionStateChanged source chains',
    centerLabel: 'ExecutionStateChanged events',
    type: 'ccip.ExecutionStateChanged',
    chainArg: '$srcChain' as const,
  },
]

export interface InteropCoveragePieSlice {
  label: string
  rawChains: string[]
  isSupported: boolean
  count: number
  pctOfTotal: number
  color: string
}

export interface InteropCoveragePieChart {
  id: string
  title: string
  centerLabel: string
  totalCount: number
  supportedCount: number
  unsupportedCount: number
  supportedPct: number
  unsupportedPct: number
  slices: InteropCoveragePieSlice[]
}

export interface InteropCoveragePiesData {
  generatedAt: string
  collapseThresholdPct: number
  charts: InteropCoveragePieChart[]
}

interface InteropCoveragePieChartInput {
  id: string
  title: string
  centerLabel: string
  rows: InteropEventSupportBreakdownRecord[]
}

function resolveChainAlias(chain: string): string {
  return CHAIN_ALIASES[chain] ?? chain
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`
}

function addColors(
  rows: Omit<InteropCoveragePieSlice, 'color'>[],
): InteropCoveragePieSlice[] {
  const supported = rows.filter((row) => row.isSupported)
  const unsupported = rows.filter((row) => !row.isSupported)

  let supportedIndex = 0
  let unsupportedIndex = 0

  return rows.map((row) => {
    if (row.isSupported) {
      const t =
        supported.length <= 1 ? 0.5 : supportedIndex / (supported.length - 1)
      supportedIndex++
      return { ...row, color: hsl(136, 65, 30 + t * 40) }
    }

    const t =
      unsupported.length <= 1
        ? 0.5
        : unsupportedIndex / (unsupported.length - 1)
    unsupportedIndex++
    return { ...row, color: hsl(0, 75, 30 + t * 40) }
  })
}

function buildChartData(
  input: InteropCoveragePieChartInput,
): InteropCoveragePieChart {
  const grouped = new Map<
    string,
    {
      count: number
      unsupportedCount: number
      rawChains: Set<string>
    }
  >()

  for (const row of input.rows) {
    const label = resolveChainAlias(row.chain)
    const current = grouped.get(label) ?? {
      count: 0,
      unsupportedCount: 0,
      rawChains: new Set<string>(),
    }

    current.count += row.count
    if (!row.isSupported) {
      current.unsupportedCount += row.count
    }
    current.rawChains.add(row.chain)
    grouped.set(label, current)
  }

  const merged = Array.from(grouped.entries())
    .map(([label, value]) => ({
      label,
      rawChains: Array.from(value.rawChains).sort(),
      count: value.count,
      isSupported: value.unsupportedCount === 0,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  const totalCount = merged.reduce((acc, row) => acc + row.count, 0)

  const withPct = merged.map((row) => ({
    ...row,
    pctOfTotal: totalCount === 0 ? 0 : (100 * row.count) / totalCount,
  }))

  const large = withPct.filter(
    (row) => row.pctOfTotal >= COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT,
  )
  const small = withPct.filter(
    (row) => row.pctOfTotal < COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT,
  )

  const smallSupported = small.filter((row) => row.isSupported)
  const smallUnsupported = small.filter((row) => !row.isSupported)

  const collapsed: Omit<InteropCoveragePieSlice, 'color'>[] = [...large]

  if (smallSupported.length > 0) {
    const count = smallSupported.reduce((acc, row) => acc + row.count, 0)
    collapsed.push({
      label: `Other supported (<${COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT}%, ${smallSupported.length} chains)`,
      rawChains: smallSupported.flatMap((row) => row.rawChains),
      isSupported: true,
      count,
      pctOfTotal: totalCount === 0 ? 0 : (100 * count) / totalCount,
    })
  }

  if (smallUnsupported.length > 0) {
    const count = smallUnsupported.reduce((acc, row) => acc + row.count, 0)
    collapsed.push({
      label: `Other unsupported (<${COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT}%, ${smallUnsupported.length} chains)`,
      rawChains: smallUnsupported.flatMap((row) => row.rawChains),
      isSupported: false,
      count,
      pctOfTotal: totalCount === 0 ? 0 : (100 * count) / totalCount,
    })
  }

  const slices = addColors(
    collapsed.sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    ),
  )

  const supportedCount = slices
    .filter((row) => row.isSupported)
    .reduce((acc, row) => acc + row.count, 0)
  const unsupportedCount = totalCount - supportedCount

  return {
    id: input.id,
    title: input.title,
    centerLabel: input.centerLabel,
    totalCount,
    supportedCount,
    unsupportedCount,
    supportedPct: totalCount === 0 ? 0 : (100 * supportedCount) / totalCount,
    unsupportedPct:
      totalCount === 0 ? 0 : (100 * unsupportedCount) / totalCount,
    slices,
  }
}

export function buildInteropCoveragePieCharts(
  inputs: InteropCoveragePieChartInput[],
): InteropCoveragePieChart[] {
  return inputs.map(buildChartData)
}

export async function getInteropCoveragePiesData(
  db: Database,
): Promise<InteropCoveragePiesData> {
  const rows = await Promise.all(
    CHART_CONFIGS.map((chart) =>
      db.interopEvent.getSupportBreakdownByChainArg(chart.type, chart.chainArg),
    ),
  )

  return {
    generatedAt: new Date().toISOString(),
    collapseThresholdPct: COVERAGE_PIE_COLLAPSE_THRESHOLD_PCT,
    charts: buildInteropCoveragePieCharts(
      CHART_CONFIGS.map((chart, i) => ({
        id: chart.id,
        title: chart.title,
        centerLabel: chart.centerLabel,
        rows: rows[i] ?? [],
      })),
    ),
  }
}
