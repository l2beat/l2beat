import { assertUnreachable, formatSeconds } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { InteropProtocolDashboardData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import type {
  AverageDuration,
  ByBridgeTypeData,
  TokenData,
} from '~/server/features/layer2s/interop/types'
import type { InteropTopTokenData } from '~/server/features/layer2s/interop/utils/getTopToken'
import type { TransferSizeDataPoint } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'
import {
  formatTransferCount,
  interopChainName,
  listTopItems,
} from '~/server/markdown/interopMarkdown'
import { formatCount, formatUsd, link } from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'
import { TRANSFER_TYPE_DISPLAY } from '../utils/display'
import { getBridgeTypeVolumes } from '../utils/getBridgeTypeVolumes'
import { getInteropTokenUrl } from '../utils/getInteropTokenUrl'
import { getTransferSizeBreakdown } from '../utils/transferSizeBuckets'

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
      warnings: [
        ...getProjectStatusWarnings(entry),
        ...compact([
          entry.header.emergencyWarning,
          entry.header.redWarning?.text,
          entry.header.warning,
        ]),
      ],
      facts: getFacts(protocolData),
      risks: [],
      description: entry.header.description,
    },
    header: { links: entry.header.links, badges: entry.header.badges },
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
      value: `${interopChainName(topPath.chainA)} ↔ ${interopChainName(topPath.chainB)} (${formatUsd(topPath.volume)})`,
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
        label: 'Last 24h tokens by volume',
        value: listTopItems(entry.tokens, formatTokenVolume).join(', '),
      },
    topToken && {
      label: 'Last 24h top token',
      value: `${linkToken(topToken)} (${formatUsd(topToken.volume)} volume, ${formatTransferCount(topToken.transferCount)})`,
    },
    transferSize && {
      label: 'Last 24h transfer size',
      value: formatTransferSize(transferSize),
    },
    entry?.byBridgeType && {
      label: 'Last 24h transfer type distribution',
      value: formatTransferTypes(entry.byBridgeType),
    },
  ])
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

function formatTokenVolume(token: TokenData) {
  return token.volume !== null
    ? `${linkToken(token)} (${formatUsd(token.volume)})`
    : linkToken(token)
}

function linkToken(token: InteropTopTokenData | TokenData) {
  const path = getInteropTokenUrl(token)
  return path ? link(token.symbol, `${PRODUCTION_ORIGIN}${path}`) : token.symbol
}

function formatTransferSize(size: TransferSizeDataPoint) {
  const range = compact([
    size.minTransferValueUsd !== undefined &&
      `min ${formatMinTransferSize(size.minTransferValueUsd)}`,
    size.averageTransferSizeUsd !== undefined &&
      `average ${formatUsd(size.averageTransferSizeUsd)}`,
    size.maxTransferValueUsd !== undefined &&
      `max ${formatUsd(size.maxTransferValueUsd)}`,
  ])
  const counts = getTransferSizeBreakdown(size)
    .map(({ label, count }) => `${label}: ${formatTransferCount(count)}`)
    .join(', ')
  return range.length > 0 ? `${counts} (${range.join(', ')})` : counts
}

/** Dust transfers round to "$0.00", which reads as free transfers. */
function formatMinTransferSize(value: number) {
  return value < 0.005 ? 'under $0.01' : formatUsd(value)
}

/** Volume per bridge type, in the order and with the labels of the HTML breakdown. */
function formatTransferTypes(byBridgeType: ByBridgeTypeData) {
  const volumes = getBridgeTypeVolumes(byBridgeType)
  return (Object.keys(TRANSFER_TYPE_DISPLAY) as (keyof ByBridgeTypeData)[])
    .flatMap((type) => {
      const volume = volumes[type]
      return volume !== undefined
        ? [`${TRANSFER_TYPE_DISPLAY[type].label}: ${formatUsd(volume)}`]
        : []
    })
    .join(', ')
}
