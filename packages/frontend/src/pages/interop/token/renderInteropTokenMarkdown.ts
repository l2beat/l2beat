import compact from 'lodash/compact'
import type {
  InteropTokenDashboardData,
  InteropTokenTopProtocol,
} from '~/server/features/layer2s/interop/getInteropTokenData'
import type { InteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import type { InteropTokenEntry } from '~/server/features/layer2s/interop/token/getInteropTokenEntry'
import {
  formatAverageDuration,
  formatTopPath,
  formatTransferCount,
  interopChainName,
  interopProtocolUrl,
  renderTopRoutes,
} from '~/server/markdown/interopMarkdown'
import { renderProtocolsTable } from '~/server/markdown/interopTokenMarkdown'
import {
  formatCount,
  formatUsd,
  joinBlocks,
  link,
} from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import type { SectionBodyOverrides } from '~/server/markdown/renderProjectSection'
import { htmlPagePointer } from '~/server/markdown/renderSectionParts'
import { getInteropTokenPagePath } from '../utils/getInteropTokenUrl'
import {
  getInteropTokenNotices,
  getTopProtocolBasis,
  UNRELIABLE_PRICE_NOTICE,
} from './getInteropTokenNotices'

export interface InteropTokenPage {
  token: InteropAbstractToken
  tokenEntry: InteropTokenEntry
  /** Null when no aggregated snapshot has transfers of the token. */
  tokenData: InteropTokenDashboardData | null
  /** Set when the latest snapshot lacks the token and an older one is shown. */
  lastSyncedAt: number | undefined
}

/** The markdown alternate of the interop token page, from the data the HTML page renders. */
export function renderInteropTokenMarkdown(page: InteropTokenPage): string {
  const { token, tokenEntry, tokenData } = page
  return renderProjectMarkdown({
    name: token.symbol,
    pagePath: getInteropTokenPagePath(token),
    summary: {
      warnings: getInteropTokenNotices(page),
      facts: getFacts(token, tokenEntry, tokenData),
      risks: [],
      description: undefined,
    },
    // Without data the HTML page shows only the summary, without sections.
    sections: tokenData ? tokenEntry.sections : [],
    sectionBodies: tokenData ? getDashboardSectionBodies(tokenData) : {},
    apiLinks: {},
  })
}

/** Labels follow the header, the stats block and the top protocol card of the HTML page. */
function getFacts(
  token: InteropAbstractToken,
  { deploymentsCount }: InteropTokenEntry,
  data: InteropTokenDashboardData | null,
) {
  const stats = data?.token
  const protocols = data?.entries ?? []
  return compact([
    token.issuer && {
      label: 'Issued by',
      value: capitalizeWords(token.issuer),
    },
    token.category && { label: 'Category', value: token.category },
    stats?.volume != null && {
      label: 'Last 24h volume',
      value: formatUsd(stats.volume),
    },
    stats && {
      label: 'Last 24h transfer count',
      value: formatCount(stats.transferCount),
    },
    stats?.avgDuration && {
      label: 'Last 24h avg. transfer time',
      value: formatAverageDuration(stats.avgDuration),
    },
    stats?.avgValue != null && {
      label: 'Last 24h avg. transfer value',
      value: formatUsd(stats.avgValue),
    },
    data?.topPath && {
      label: 'Last 24h top path',
      value: formatTopPath(data.topPath),
    },
    data?.topProtocol && {
      label: `Top protocol (based on ${getTopProtocolBasis(token.isPriceUnreliable)})`,
      value: formatTopProtocol(data.topProtocol),
    },
    protocols.length > 0 && {
      label: 'Protocols used',
      value: protocols.map((protocol) => protocol.name).join(', '),
    },
    deploymentsCount > 0 && {
      label: 'Deployments',
      value: formatCount(deploymentsCount),
    },
  ])
}

function formatTopProtocol({
  name,
  slug,
  volume,
  transfers,
}: InteropTokenTopProtocol) {
  const stats = compact([
    volume && `volume ${formatUsd(volume.value)}`,
    formatTransferCount(transfers.value),
  ])
  return `${link(name, interopProtocolUrl(slug))} (${stats.join(', ')})`
}

/**
 * The HTML volume and protocols sections read the dashboard data rather than
 * their props, so their markdown is built here from the same data.
 */
function getDashboardSectionBodies(
  data: InteropTokenDashboardData,
): SectionBodyOverrides {
  return {
    InteropTokenProtocolsSection: () => renderProtocolsTable(data.entries),
    InteropTokenVolumeSection: (props, level) =>
      props.isPriceUnreliable
        ? UNRELIABLE_PRICE_NOTICE
        : renderTopFlows(data, props.id, level),
  }
}

/** Only the busiest routes are loaded with the page; the graph queries the rest. */
function renderTopFlows(
  { flows }: InteropTokenDashboardData,
  sectionId: string,
  level: number,
) {
  return joinBlocks([
    renderTopRoutes(
      flows.filter((flow) => flow.volume > 0),
      interopChainName,
      level,
    ),
    htmlPagePointer(
      'The flows between all chains are an interactive graph',
      sectionId,
    ),
  ])
}

/** Issuers are lowercase ids, which the HTML page capitalizes with CSS. */
function capitalizeWords(text: string) {
  return text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}
