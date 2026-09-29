import {
  formatBpsToMbps,
  formatCurrency,
  formatNumber,
  UnixTime,
} from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import round from 'lodash/round'
import { NO_BRIDGE_RISK } from '~/components/rosette/grissini/noBridgeRisk'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import { link } from '~/server/markdown/markdown'
import { renderProjectMarkdown } from '~/server/markdown/renderProjectMarkdown'
import { getUnderReviewText } from '~/utils/project/underReview'

type DaProjectEntry = DaProjectPageEntry | EthereumDaProjectPageEntry

/** The markdown alternate of the DA project page, from the entry the HTML page renders. */
export function renderDaProjectMarkdown(entry: DaProjectEntry): string {
  // Production URLs, like the canonical link: the document is meant to be
  // cited, whichever deployment rendered it.
  const pageUrl = `${PRODUCTION_ORIGIN}${getDaProjectPagePath(entry.slug, getBridgeSlug(entry))}`
  return renderProjectMarkdown({
    name: entry.name,
    pageUrl,
    summary: {
      warnings: getWarnings(entry, pageUrl),
      facts: getFacts(entry),
      risks:
        entry.entryType === 'ethereum' ? [] : getSelectedBridgeRisks(entry),
      description:
        entry.entryType === 'ethereum' ? renderCallout(entry) : undefined,
    },
    sections: entry.sections,
    apiLinks:
      entry.entryType === 'ethereum'
        ? {
            activity: [
              {
                title: 'Activity chart (JSON)',
                url: `${PRODUCTION_ORIGIN}/api/scaling/activity/${entry.slug}`,
              },
            ],
          }
        : {},
  })
}

export function getDaProjectPagePath(layerSlug: string, bridgeSlug: string) {
  return `/data-availability/projects/${layerSlug}/${bridgeSlug}`
}

/** Ethereum's DA bridge is enshrined: the bridge is the layer project itself. */
function getBridgeSlug(entry: DaProjectEntry) {
  return entry.entryType === 'ethereum' ? entry.slug : entry.selectedBridge.slug
}

/** The banners above the summary on the HTML page, in the same order. */
function getWarnings(entry: DaProjectEntry, pageUrl: string) {
  const ongoingAnomaly =
    entry.entryType === 'common' ? entry.header.ongoingAnomaly : undefined
  return compact([
    ongoingAnomaly &&
      `${ongoingAnomaly === 'single' ? 'Ongoing anomaly' : 'Ongoing anomalies'} in the DA bridge liveness, see ${link('the HTML page', `${pageUrl}#da-bridge-liveness`)}.`,
    entry.archivedAt !== undefined &&
      'This project is archived and no longer maintained.',
    entry.isUnderReview && getUnderReviewText('config'),
  ])
}

/** Labels follow the stats block at the top of the HTML page; tooltips become parentheticals. */
function getFacts(entry: DaProjectEntry) {
  const { header } = entry
  return compact([
    { label: 'Type', value: entry.type },
    {
      label: 'Total Value Secured',
      value: `${formatUsd(header.tvs)} (across the L2s and L3s listed on L2BEAT that use this DA layer, excluding sovereign rollups)`,
    },
    !!header.economicSecurity && {
      label: 'Economic security',
      value: `${formatUsd(header.economicSecurity)} (slashable in case of a data withholding attack)`,
    },
    !!header.numberOfValidators && {
      label: 'Secured by',
      value: formatSecuredBy(entry, header.numberOfValidators),
    },
    getDurationOfStorage(entry),
    !!header.maxThroughputPerSecond && {
      label: 'Max throughput',
      value: formatBpsToMbps(header.maxThroughputPerSecond),
    },
    {
      label: 'DA Bridge',
      value:
        entry.entryType === 'ethereum'
          ? entry.header.bridgeName
          : entry.selectedBridge.name,
    },
    entry.entryType === 'common' && getOtherBridges(entry),
    header.usedIn.length > 0 && {
      label: 'Used by',
      value: header.usedIn.map((project) => project.name).join(', '),
    },
  ])
}

function formatSecuredBy(entry: DaProjectEntry, numberOfValidators: number) {
  if (entry.slug === 'ethereum') {
    return `${withRegularSpaces(formatNumber(numberOfValidators))} validators`
  }
  return entry.type === 'Public Blockchain'
    ? `${numberOfValidators} validators`
    : `${numberOfValidators} operators`
}

function getDurationOfStorage({ kind, header }: DaProjectEntry) {
  const label = 'Duration of storage'
  if (kind === 'DA Service' && !header.durationStorage) {
    return {
      label,
      value: 'Flexible (depends on the offchain configuration of the DAC)',
    }
  }
  return (
    !!header.durationStorage && {
      label,
      value: `${round(header.durationStorage / UnixTime.DAY, 2)} days`,
    }
  )
}

/** The HTML page lets the reader switch bridges; here each one links to its own markdown page. */
function getOtherBridges(entry: DaProjectPageEntry) {
  const others = entry.bridges.filter(
    (bridge) => bridge.slug !== entry.selectedBridge.slug,
  )
  return (
    others.length > 0 && {
      label: 'Other DA bridges',
      value: others
        .map(
          (bridge) =>
            `${link(bridge.name, `${PRODUCTION_ORIGIN}${getDaProjectPagePath(entry.slug, bridge.slug)}.md`)} (TVS ${formatUsd(bridge.tvs)})`,
        )
        .join(', '),
    }
  )
}

function getSelectedBridgeRisks(entry: DaProjectPageEntry) {
  return [
    ...entry.header.daLayerGrissiniValues,
    ...(entry.selectedBridge.isNoBridge
      ? [NO_BRIDGE_RISK]
      : entry.header.daBridgeGrissiniValues),
  ]
}

/** The Ethereum summary has no risk rosette; it explains the enshrined bridge instead. */
function renderCallout({ header }: EthereumDaProjectPageEntry) {
  return `**${header.callout.title}:** ${header.callout.description}`
}

function formatUsd(value: number) {
  return withRegularSpaces(formatCurrency(value, 'usd'))
}

/** The HTML page separates the unit with a hair space; plain text reads better with a regular one. */
function withRegularSpaces(text: string) {
  return text.replaceAll('\u200A', ' ')
}
