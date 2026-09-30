import { NO_BRIDGE_RISK } from '~/components/rosette/grissini/noBridgeRisk'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import { formatUsd, link, withRegularSpaces } from '~/server/markdown/markdown'
import {
  getProjectStatusWarnings,
  type ProjectFact,
  type ProjectMarkdown,
  renderProjectMarkdown,
} from '~/server/markdown/renderProjectMarkdown'

import { getCommonDaProjectStats } from './utils/getCommonDaProjectStats'

type DaProjectEntry = DaProjectPageEntry | EthereumDaProjectPageEntry

/** The markdown alternate of the DA project page, from the entry the HTML page renders. */
export function renderDaProjectMarkdown(entry: DaProjectEntry): string {
  return renderProjectMarkdown({
    name: entry.name,
    sections: entry.sections,
    ...(entry.entryType === 'ethereum'
      ? getEthereumPage(entry)
      : getRegularPage(entry)),
  })
}

export function getDaProjectPagePath(layerSlug: string, bridgeSlug: string) {
  return `/data-availability/projects/${layerSlug}/${bridgeSlug}`
}

type PageDetails = Omit<ProjectMarkdown, 'name' | 'sections'>

/** Mirrors EthereumDaProjectSummary: the enshrined bridge is explained instead of rated. */
function getEthereumPage(entry: EthereumDaProjectPageEntry): PageDetails {
  const { header } = entry
  return {
    // Ethereum's DA bridge is enshrined: the bridge is the layer project itself.
    pageUrl: getPageUrl(entry.slug, entry.slug),
    summary: {
      warnings: getStatusWarnings(entry),
      facts: [
        ...getCommonFacts(entry),
        { label: 'DA Bridge', value: header.bridgeName },
        ...getUsedBy(entry),
      ],
      risks: [],
      description: `**${header.callout.title}:** ${header.callout.description}`,
    },
    apiLinks: {
      activity: [
        {
          title: 'Activity chart (JSON)',
          url: `${PRODUCTION_ORIGIN}/api/scaling/activity/${entry.slug}`,
        },
      ],
    },
  }
}

/** Mirrors RegularDaProjectSummary: the stats, then the selected bridge and its risks. */
function getRegularPage(entry: DaProjectPageEntry): PageDetails {
  const pageUrl = getPageUrl(entry.slug, entry.selectedBridge.slug)
  return {
    pageUrl,
    summary: {
      // Same order as the banners above the summary on the HTML page.
      warnings: [
        ...getOngoingAnomalyWarning(entry, pageUrl),
        ...getStatusWarnings(entry),
      ],
      facts: [
        ...getCommonFacts(entry),
        { label: 'DA Bridge', value: formatSelectedBridge(entry) },
        ...getOtherBridges(entry),
        ...getUsedBy(entry),
      ],
      risks: getSelectedBridgeRisks(entry),
      description: undefined,
    },
    apiLinks: {},
  }
}

/**
 * Production URLs, like the canonical link: the document is meant to be
 * cited, whichever deployment rendered it.
 */
function getPageUrl(layerSlug: string, bridgeSlug: string) {
  return `${PRODUCTION_ORIGIN}${getDaProjectPagePath(layerSlug, bridgeSlug)}`
}

function getStatusWarnings(entry: DaProjectEntry) {
  return getProjectStatusWarnings({
    archivedAt: entry.archivedAt,
    underReviewStatus: entry.isUnderReview ? 'config' : undefined,
  })
}

function getOngoingAnomalyWarning(entry: DaProjectPageEntry, pageUrl: string) {
  const { ongoingAnomaly } = entry.header
  if (!ongoingAnomaly) return []
  return [
    `${ongoingAnomaly === 'single' ? 'Ongoing anomaly' : 'Ongoing anomalies'} in the DA bridge liveness, see ${link('the HTML page', `${pageUrl}#da-bridge-liveness`)}.`,
  ]
}

/** The stats block at the top of the HTML page; tooltips become parentheticals. */
function getCommonFacts(entry: DaProjectEntry): ProjectFact[] {
  return getCommonDaProjectStats(entry).map(({ title, value, tooltip }) => ({
    label: title,
    value: withRegularSpaces(tooltip ? `${value} (${tooltip})` : value),
  }))
}

function getUsedBy({ header }: DaProjectEntry): ProjectFact[] {
  if (header.usedIn.length === 0) return []
  return [
    {
      label: 'Used by',
      value: header.usedIn.map((project) => project.name).join(', '),
    },
  ]
}

/** With its TVS, as listed for the other bridges. */
function formatSelectedBridge(entry: DaProjectPageEntry) {
  const { name, slug } = entry.selectedBridge
  const bridge = entry.bridges.find((bridge) => bridge.slug === slug)
  return bridge ? `${name} (TVS ${formatUsd(bridge.tvs)})` : name
}

/** The HTML page lets the reader switch bridges; here each one links to its own markdown page. */
function getOtherBridges(entry: DaProjectPageEntry): ProjectFact[] {
  const others = entry.bridges.filter(
    (bridge) => bridge.slug !== entry.selectedBridge.slug,
  )
  if (others.length === 0) return []
  return [
    {
      label: 'Other DA bridges',
      value: others
        .map(
          (bridge) =>
            `${link(bridge.name, `${getPageUrl(entry.slug, bridge.slug)}.md`)} (TVS ${formatUsd(bridge.tvs)})`,
        )
        .join(', '),
    },
  ]
}

function getSelectedBridgeRisks(entry: DaProjectPageEntry) {
  return [
    ...entry.header.daLayerGrissiniValues,
    ...(entry.selectedBridge.isNoBridge
      ? [NO_BRIDGE_RISK]
      : entry.header.daBridgeGrissiniValues),
  ]
}
