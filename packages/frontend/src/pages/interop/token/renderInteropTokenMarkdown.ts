import compact from 'lodash/compact'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import type { InteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import type { InteropTokenEntry } from '~/server/features/layer2s/interop/token/getInteropTokenEntry'
import {
  formatTransferCount,
  interopChainName,
  renderTopRoutes,
} from '~/server/markdown/interopMarkdown'
import {
  formatAverageDuration,
  formatCount,
  formatUsd,
  interopProtocolUrl,
  renderProtocolsTable,
} from '~/server/markdown/interopTokenMarkdown'
import { joinBlocks, link } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { getInteropTokenPagePath } from '../utils/getInteropTokenUrl'

export interface InteropTokenPage {
  token: InteropAbstractToken
  tokenEntry: InteropTokenEntry
  /** Null when no transfers of the token were found in the past 24 hours. */
  tokenData: InteropTokenDashboardData | null
}

/** The markdown alternate of the interop token page, from the data the HTML page renders. */
export function renderInteropTokenMarkdown({
  token,
  tokenEntry,
  tokenData,
}: InteropTokenPage): string {
  // Production URLs, like the canonical link: the document is meant to be
  // cited, whichever deployment rendered it.
  const pageUrl = `${PRODUCTION_ORIGIN}${getInteropTokenPagePath(token)}`
  return renderProjectMarkdown({
    name: token.symbol,
    pageUrl,
    summary: {
      warnings: tokenData ? [] : [NO_DATA_WARNING],
      facts: getFacts(token, tokenEntry, tokenData),
      risks: [],
      description: undefined,
    },
    // Without data the HTML page shows an empty state instead of sections.
    sections: tokenData
      ? withDashboardContent(tokenEntry.sections, tokenData, pageUrl)
      : [],
    apiLinks: {},
  })
}

const NO_DATA_WARNING =
  'No transfers of this token were found in the past 24 hours, so there are no interop statistics for it.'

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
      value: `${interopChainName(data.topPath.chainA)} ↔ ${interopChainName(data.topPath.chainB)} (${formatUsd(data.topPath.volume)})`,
    },
    data?.topProtocol && {
      label: 'Top protocol (based on 24h volume)',
      value: `${link(data.topProtocol.name, interopProtocolUrl(data.topProtocol.slug))} (volume ${formatUsd(data.topProtocol.volume.value)}, ${formatTransferCount(data.topProtocol.transfers.value)})`,
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

/**
 * The HTML volume and protocols sections read the dashboard data rather than
 * their props, so their markdown is built here from the same data.
 */
function withDashboardContent(
  sections: ProjectDetailsSection[],
  data: InteropTokenDashboardData,
  pageUrl: string,
): ProjectDetailsSection[] {
  return sections.map((section) => {
    switch (section.type) {
      case 'InteropTokenProtocolsSection':
        return {
          type: 'MarkdownSection',
          props: {
            ...section.props,
            content: renderProtocolsTable(data.entries),
          },
        }
      case 'InteropTokenVolumeSection':
        return {
          type: 'MarkdownSection',
          props: {
            ...section.props,
            content: renderTopFlows(data, `${pageUrl}#${section.props.id}`),
          },
        }
      default:
        return section
    }
  })
}

/** Only the busiest routes are loaded with the page; the graph queries the rest. */
function renderTopFlows(
  { flows }: InteropTokenDashboardData,
  flowsGraphUrl: string,
) {
  return joinBlocks([
    renderTopRoutes(
      flows.filter((flow) => flow.volume > 0),
      interopChainName,
      1,
    ),
    `The flows between all chains are an interactive graph on ${link('the HTML page', flowsGraphUrl)}.`,
  ])
}

/** Issuers are lowercase ids, which the HTML page capitalizes with CSS. */
function capitalizeWords(text: string) {
  return text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}
