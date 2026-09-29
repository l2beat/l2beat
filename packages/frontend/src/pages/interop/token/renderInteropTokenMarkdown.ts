import compact from 'lodash/compact'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import type { InteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import type { InteropTokenEntry } from '~/server/features/layer2s/interop/token/getInteropTokenEntry'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import {
  formatAverageDuration,
  formatCount,
  formatUsd,
  interopProtocolUrl,
  renderProtocolsTable,
} from '~/server/markdown/interopTokenMarkdown'
import { link } from '~/server/markdown/markdown'
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
  return renderProjectMarkdown({
    name: token.symbol,
    // Production URLs, like the canonical link: the document is meant to be
    // cited, whichever deployment rendered it.
    pageUrl: `${PRODUCTION_ORIGIN}${getInteropTokenPagePath(token)}`,
    summary: {
      warnings: tokenData ? [] : [NO_DATA_WARNING],
      facts: getFacts(token, tokenEntry, tokenData),
      risks: [],
      description: undefined,
    },
    // Without data the HTML page shows an empty state instead of sections.
    sections: tokenData
      ? withProtocolsTable(tokenEntry.sections, tokenData.entries)
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
  const protocols = sortByVolume(data?.entries ?? [])
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
      value: `${capitalizeWords(data.topPath.chainA)} <-> ${capitalizeWords(data.topPath.chainB)} (${formatUsd(data.topPath.volume)})`,
    },
    data?.topProtocol && {
      label: 'Top protocol (based on 24h volume)',
      value: `${link(data.topProtocol.name, interopProtocolUrl(data.topProtocol.slug))} (volume ${formatUsd(data.topProtocol.volume.value)}, ${formatCount(data.topProtocol.transfers.value)} transactions)`,
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
 * The HTML protocols section reads its table from the dashboard data rather
 * than from its props, so the markdown one is built here from the same data.
 */
function withProtocolsTable(
  sections: ProjectDetailsSection[],
  protocols: ProtocolEntry[],
): ProjectDetailsSection[] {
  return sections.map((section) =>
    section.type === 'InteropTokenProtocolsSection'
      ? {
          type: 'MarkdownSection',
          props: { ...section.props, content: renderProtocolsTable(protocols) },
        }
      : section,
  )
}

function sortByVolume(protocols: ProtocolEntry[]) {
  return protocols.toSorted((a, b) => b.volume - a.volume)
}

/** Issuers and chains are lowercase ids, which the HTML page capitalizes with CSS. */
function capitalizeWords(text: string) {
  return text.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}
