import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { NO_BRIDGE_RISK } from '~/components/rosette/grissini/noBridgeRisk'
import type { RosetteValue } from '~/components/rosette/types'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import {
  formatUsd,
  link,
  withRegularSpaces,
  withSentiment,
} from '~/server/markdown/markdown'
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
  return `/data-availability/projects/${layerSlug}/${bridgeSlug}` as const
}

type PageDetails = Omit<ProjectMarkdown, 'name' | 'sections'>

/** Mirrors EthereumDaProjectSummary: the enshrined bridge is explained instead of rated. */
function getEthereumPage(entry: EthereumDaProjectPageEntry): PageDetails {
  const { header } = entry
  return {
    // Ethereum's DA bridge is enshrined: the bridge is the layer project itself.
    pagePath: getDaProjectPagePath(entry.slug, entry.slug),
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
    header: { links: header.links },
    apiLinks: {
      activity: [
        {
          title: 'Activity chart (JSON)',
          url: `/api/scaling/activity/${entry.slug}`,
        },
      ],
    },
  }
}

/** Mirrors RegularDaProjectSummary: the stats, then the selected bridge and its risks. */
function getRegularPage(entry: DaProjectPageEntry): PageDetails {
  return {
    pagePath: getDaProjectPagePath(entry.slug, entry.selectedBridge.slug),
    summary: {
      // Same order as the banners above the summary on the HTML page.
      warnings: [
        ...getOngoingAnomalyWarning(entry),
        ...getStatusWarnings(entry),
      ],
      facts: [
        ...getCommonFacts(entry),
        { label: 'DA Bridge', value: formatSelectedBridge(entry) },
        ...getUsedBy(entry),
        ...getSelectedBridgeUsedBy(entry),
        ...getOtherBridges(entry),
      ],
      risks: getSelectedBridgeRisks(entry),
      description: undefined,
    },
    header: { links: entry.header.links, discoUiHref: entry.discoUiHref },
    apiLinks: {},
  }
}

function getStatusWarnings(entry: DaProjectEntry) {
  return getProjectStatusWarnings({
    archivedAt: entry.archivedAt,
    underReviewStatus: entry.isUnderReview ? 'config' : undefined,
  })
}

function getOngoingAnomalyWarning(entry: DaProjectPageEntry) {
  const { ongoingAnomaly } = entry.header
  if (!ongoingAnomaly) return []
  return [
    `${ongoingAnomaly === 'single' ? 'Ongoing anomaly' : 'Ongoing anomalies'} in the DA bridge liveness, described in the Liveness section below.`,
  ]
}

/** The stats block at the top of the HTML page; tooltips become parentheticals. */
function getCommonFacts(entry: DaProjectEntry): ProjectFact[] {
  return getCommonDaProjectStats(entry).map(({ title, value, tooltip }) => ({
    label: title,
    value: withRegularSpaces(tooltip ? `${value} (${tooltip})` : value),
  }))
}

/** The HTML "Used by" stat covers the whole layer, whichever bridge is selected. */
function getUsedBy(entry: DaProjectEntry): ProjectFact[] {
  const { usedIn } = entry.header
  if (usedIn.length === 0) return []
  const hasSeveralBridges =
    entry.entryType === 'common' && entry.bridges.length > 1
  return [
    {
      label: hasSeveralBridges
        ? `Used by (${entry.name} with any DA bridge)`
        : 'Used by',
      value: formatUsedIn(usedIn),
    },
  ]
}

/** On a layer with several bridges, the layer-wide list does not say who uses the selected one. */
function getSelectedBridgeUsedBy(entry: DaProjectPageEntry): ProjectFact[] {
  const bridge = getSelectedBridge(entry)
  if (!bridge || entry.bridges.length <= 1) return []
  return [
    {
      label: `Used by (${entry.name} with ${bridge.name})`,
      value: formatUsedIn(bridge.usedIn),
    },
  ]
}

function formatUsedIn(usedIn: UsedInProjectWithIcon[]) {
  return usedIn.length > 0
    ? usedIn.map((project) => project.name).join(', ')
    : NO_SCALING_PROJECTS
}

/** The tooltip of the HTML "No L2" cell. */
const NO_SCALING_PROJECTS =
  'none (there are no scaling projects listed on L2BEAT that use this solution)'

function getSelectedBridge(entry: DaProjectPageEntry) {
  return entry.bridges.find(
    (bridge) => bridge.slug === entry.selectedBridge.slug,
  )
}

/** With its TVS, as listed for the other bridges. */
function formatSelectedBridge(entry: DaProjectPageEntry) {
  const bridge = getSelectedBridge(entry)
  const { name } = entry.selectedBridge
  return bridge ? `${name} (TVS ${formatUsd(bridge.tvs)})` : name
}

/**
 * The HTML bridge selector shows each bridge with its TVS, users and risks;
 * here each one also links to its own markdown page.
 */
function getOtherBridges(entry: DaProjectPageEntry): ProjectFact[] {
  return entry.bridges
    .filter((bridge) => bridge.slug !== entry.selectedBridge.slug)
    .map((bridge) => {
      const risks = (
        bridge.isNoBridge ? [NO_BRIDGE_RISK] : bridge.grissiniValues
      )
        .map(
          (risk) =>
            `${risk.name}: ${withSentiment(risk.value, risk.sentiment)}`,
        )
        .join(', ')
      return {
        label: 'Other DA bridge',
        value: [
          link(
            bridge.name,
            `${getDaProjectPagePath(entry.slug, bridge.slug)}.md`,
          ),
          `(TVS ${formatUsd(bridge.tvs)}; used by ${formatUsedIn(bridge.usedIn)}${risks ? `; risks: ${risks}` : ''})`,
        ].join(' '),
      }
    })
}

/** Labelled per layer and bridge, as the HTML groups them under their own headings. */
function getSelectedBridgeRisks(entry: DaProjectPageEntry) {
  const bridgeRisks = entry.selectedBridge.isNoBridge
    ? [NO_BRIDGE_RISK]
    : entry.header.daBridgeGrissiniValues.map((risk) =>
        labelRisk(risk, `DA bridge ${entry.selectedBridge.name}`),
      )
  return [
    ...entry.header.daLayerGrissiniValues.map((risk) =>
      labelRisk(risk, `DA layer ${entry.name}`),
    ),
    ...bridgeRisks,
  ]
}

function labelRisk(risk: RosetteValue, owner: string): RosetteValue {
  return { ...risk, name: `${risk.name} (${owner})` }
}
