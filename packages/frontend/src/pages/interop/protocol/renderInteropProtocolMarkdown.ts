import { INTEROP_CHAINS } from '@l2beat/config'
import { assertUnreachable, formatSeconds } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { InteropProtocolDashboardData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import type {
  AverageDuration,
  ByBridgeTypeData,
} from '~/server/features/layer2s/interop/types'
import type { InteropTopTokenData } from '~/server/features/layer2s/interop/utils/getTopToken'
import type { TransferSizeDataPoint } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'
import {
  formatCount,
  formatUsd,
  listTopItems,
} from '~/server/markdown/interopMarkdown'
import { link } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { TRANSFER_TYPE_DISPLAY } from '../utils/display'
import { getInteropTokenUrl } from '../utils/getInteropTokenUrl'
import { transferSizeBuckets } from '../utils/transferSizeBuckets'

/** The page props the markdown needs: the headline numbers live next to the entry, not in it. */
export interface InteropProtocolPageContent {
  projectEntry: InteropProtocolEntry
  protocolData: InteropProtocolDashboardData
}

/** The markdown alternate of the interop protocol page, from the data the HTML page renders. */
export function renderInteropProtocolMarkdown({
  projectEntry: entry,
  protocolData,
}: InteropProtocolPageContent): string {
  return renderProjectMarkdown({
    name: entry.name,
    // Production URLs, like the canonical link: the document is meant to be
    // cited, whichever deployment rendered it.
    pageUrl: `${PRODUCTION_ORIGIN}/interop/protocols/${entry.slug}`,
    summary: {
      warnings: compact([
        entry.header.emergencyWarning,
        entry.header.redWarning?.text,
        entry.header.warning,
      ]),
      facts: getFacts(protocolData),
      risks: [],
      description: entry.header.description,
    },
    sections: entry.sections,
    apiLinks: {},
  })
}

/** Labels follow the stats block and the top token card of the HTML page. */
function getFacts({
  entry,
  topPath,
  topToken,
  transferSize,
}: InteropProtocolDashboardData) {
  return compact([
    entry?.volume && {
      label: 'Last 24h volume',
      value: formatUsd(entry.volume),
    },
    {
      label: 'Last 24h transfer count',
      value: formatCount(entry?.transferCount ?? 0),
    },
    topPath && {
      label: 'Last 24h top path',
      value: `${chainName(topPath.chainA)} ↔ ${chainName(topPath.chainB)} (${formatUsd(topPath.volume)})`,
    },
    entry?.averageDuration && {
      label: 'Last 24h avg. transfer time',
      value: formatAverageDuration(entry.averageDuration),
    },
    entry?.averageValue && {
      label: 'Last 24h avg. transfer value',
      value: formatUsd(entry.averageValue),
    },
    entry &&
      entry.tokens.items.length > 0 && {
        label: 'Tokens by volume',
        value: listTopItems(entry.tokens, (token) =>
          token.volume !== null
            ? `${token.symbol} (${formatUsd(token.volume)})`
            : token.symbol,
        ).join(', '),
      },
    topToken && {
      label: 'Top token',
      value: `${linkToken(topToken)} (${formatUsd(topToken.volume)} volume, ${formatCount(topToken.transferCount)} transfers)`,
    },
    transferSize && {
      label: 'Transfer size',
      value: formatTransferSize(transferSize),
    },
    entry?.byBridgeType && {
      label: 'Transfer type distribution',
      value: formatTransferTypes(entry.byBridgeType),
    },
  ])
}

/** The HTML page shows chain ids capitalized; the configured name reads better. */
function chainName(id: string) {
  return INTEROP_CHAINS.find((chain) => chain.id === id)?.name ?? id
}

function formatAverageDuration(duration: AverageDuration) {
  switch (duration.type) {
    case 'unknown':
      return 'Unknown (the transfer times for this protocol could not be derived based on onchain data only)'
    case 'single':
      return formatSeconds(duration.duration)
    case 'split':
      return duration.splits
        .map(
          (split) =>
            `${split.label}: ${split.duration !== null ? formatSeconds(split.duration) : 'N/A'}`,
        )
        .join(', ')
    default:
      assertUnreachable(duration)
  }
}

function linkToken(token: InteropTopTokenData) {
  const path = getInteropTokenUrl(token)
  return path ? link(token.symbol, `${PRODUCTION_ORIGIN}${path}`) : token.symbol
}

function formatTransferSize(size: TransferSizeDataPoint) {
  const buckets = [
    [transferSizeBuckets.under100.label, size.countUnder100],
    [transferSizeBuckets.from100To1K.label, size.count100To1K],
    [transferSizeBuckets.from1KTo10K.label, size.count1KTo10K],
    [transferSizeBuckets.from10KTo100K.label, size.count10KTo100K],
    [transferSizeBuckets.over100K.label, size.countOver100K],
  ] as const
  const range = compact([
    size.minTransferValueUsd !== undefined &&
      `min ${formatUsd(size.minTransferValueUsd)}`,
    size.averageTransferSizeUsd !== undefined &&
      `average ${formatUsd(size.averageTransferSizeUsd)}`,
    size.maxTransferValueUsd !== undefined &&
      `max ${formatUsd(size.maxTransferValueUsd)}`,
  ])
  const counts = buckets
    .map(([label, count]) => `${label}: ${formatCount(count)} transfers`)
    .join(', ')
  return range.length > 0 ? `${counts} (${range.join(', ')})` : counts
}

/** Volume per bridge type, in the order and with the labels of the HTML breakdown. */
function formatTransferTypes(byBridgeType: ByBridgeTypeData) {
  return (Object.keys(TRANSFER_TYPE_DISPLAY) as (keyof ByBridgeTypeData)[])
    .flatMap((type) => {
      const stats = byBridgeType[type]
      return stats
        ? [`${TRANSFER_TYPE_DISPLAY[type].label}: ${formatUsd(stats.volume)}`]
        : []
    })
    .join(', ')
}
