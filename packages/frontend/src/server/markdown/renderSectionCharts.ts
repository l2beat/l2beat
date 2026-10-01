import { formatSeconds } from '@l2beat/shared-pure'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'
import type { CostsSectionProps } from '~/components/projects/sections/costs/CostsSection'
import { TRACKED_TXS_SUBTYPE_TITLES } from '~/components/projects/sections/costs/trackedTxsSubtypeTitles'
import type { DataPostedSectionProps } from '~/components/projects/sections/data-posted/DataPostedSection'
import type { LivenessSectionProps } from '~/components/projects/sections/liveness/LivenessSection'
import type { ThroughputSectionProps } from '~/components/projects/sections/throughput/ThroughputSection'
import type { L2TvsSectionProps } from '~/components/projects/sections/tvs/L2TvsSection'
import type { ProjectSectionId } from '~/components/projects/sections/types'
import { env } from '~/env'
import { anomalySubtypeToLabel } from '~/pages/layer2s/liveness/components/anomalySubtypeToLabel'
import type { LivenessAnomaly } from '~/server/features/layer2s/liveness/types'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import type {
  TrackedTransaction,
  TrackedTransactionsByType,
} from '~/utils/project/tracked-txs/getTrackedTransactions'
import {
  bulletList,
  joinBlocks,
  link,
  resolveSiteUrl,
  subsection,
  warning,
} from './markdown'
import type { SectionBody, SectionContext } from './renderProjectSection'
import { formatUtcDateTime } from './renderSectionParts'

/*
 * Sections built around a chart or a client-loaded widget. The data behind
 * them is not in the page props, so the markdown points to the HTML page for
 * it, but carries the text and facts the server renders around it.
 */

/** For sections whose whole content is loaded by the browser. */
export function pointToHtmlPage(
  whatIsShown: string,
): SectionBody<{ id: ProjectSectionId }> {
  return (props, _level, context) =>
    htmlPagePointer(whatIsShown, props.id, context)
}

export function renderActivitySection(
  props: Pick<ActivitySectionProps, 'id' | 'dataSource'>,
  _level: number,
  context: SectionContext,
) {
  return joinBlocks([
    htmlPagePointer(
      'The interactive activity chart is shown',
      props.id,
      context,
    ),
    renderDataSource(props.dataSource),
  ])
}

export function renderL2TvsSection(
  props: Pick<L2TvsSectionProps, 'id' | 'tvsBreakdownUrl'>,
  _level: number,
  context: SectionContext,
) {
  return joinBlocks([
    htmlPagePointer('The interactive TVS charts are shown', props.id, context),
    props.tvsBreakdownUrl
      ? `Token by token: ${link('TVS breakdown', resolveSiteUrl(props.tvsBreakdownUrl, context.pageUrl))}.`
      : '',
  ])
}

export function renderCostsSection(
  props: Pick<CostsSectionProps, 'id' | 'trackedTransactions'>,
  level: number,
  context: SectionContext,
) {
  return joinBlocks([
    'The section shows the operating costs that L2s pay to Ethereum.',
    renderTrackedTxsOutage(),
    htmlPagePointer('The interactive costs chart is shown', props.id, context),
    renderTrackedTransactions(props.trackedTransactions, level),
  ])
}

export function renderDataPostedSection(
  props: Pick<
    DataPostedSectionProps,
    'id' | 'currentDaLayers' | 'pastDaLayers' | 'daTrackingConfig'
  >,
  level: number,
  context: SectionContext,
) {
  const daLayerLinks = (layers: DataPostedSectionProps['currentDaLayers']) =>
    layers
      .map((layer) =>
        link(layer.name, resolveSiteUrl(layer.href, context.pageUrl)),
      )
      .join(', ')
  const previously =
    props.pastDaLayers.length > 0
      ? `; previously it posted to ${daLayerLinks(props.pastDaLayers)}`
      : ''
  const allLayers = [...props.pastDaLayers, ...props.currentDaLayers]
  return joinBlocks([
    `This section shows how much data the project publishes to its data-availability (DA) layer over time. The project currently posts data to ${daLayerLinks(props.currentDaLayers)}${previously}.`,
    renderDataSource(
      allLayers.some((layer) => layer.name === 'EigenDA')
        ? 'API provided by EigenLayer'
        : undefined,
    ),
    htmlPagePointer(
      'The interactive data posted chart is shown',
      props.id,
      context,
    ),
    subsection(
      level,
      'Tracked transactions',
      subsection(
        level + 1,
        'Blob submissions',
        bulletList(props.daTrackingConfig.map(formatDaTrackingConfig)),
      ),
    ),
  ])
}

export function renderLivenessSection(
  props: Pick<
    LivenessSectionProps,
    | 'id'
    | 'anomalies'
    | 'hasTrackedContractsChanged'
    | 'trackedTransactions'
    | 'isArchived'
    | 'isForDaBridge'
  >,
  level: number,
  context: SectionContext,
) {
  const ongoing = props.anomalies.filter(isOngoing)
  return joinBlocks([
    props.isForDaBridge
      ? 'This section shows how frequently DA attestations are submitted. It also highlights anomalies - significant deviations from the typical schedule.'
      : 'This section shows how "live" the project\'s operators are by displaying how frequently they submit transactions of the selected type. It also highlights anomalies - significant deviations from their typical schedule.',
    renderTrackedTxsOutage(),
    props.isArchived
      ? ''
      : renderOngoingAnomalies(
          ongoing,
          props.hasTrackedContractsChanged,
          level,
        ),
    htmlPagePointer(
      'The interactive liveness chart is shown',
      props.id,
      context,
    ),
    renderTrackedTransactions(props.trackedTransactions, level),
    props.isArchived
      ? ''
      : renderLast30DayAnomalies(
          props.anomalies,
          props.hasTrackedContractsChanged,
          level,
        ),
  ])
}

export function renderThroughputSection(
  props: Pick<ThroughputSectionProps, 'id' | 'syncStatus'>,
  _level: number,
  context: SectionContext,
) {
  return joinBlocks([
    props.syncStatus.warning ? warning(props.syncStatus.warning) : '',
    'The chart shows the actual size of data posted to the DA Layer per day for the selected time period, as well as the maximum possible throughput per day.',
    htmlPagePointer(
      'The interactive throughput chart and its past day stats are shown',
      props.id,
      context,
    ),
  ])
}

/** The explanations around the two charts; the charts load in the browser. */
export function renderPrivacyAnonymitySetSection(
  props: { id: ProjectSectionId },
  level: number,
  context: SectionContext,
) {
  const days = ANONYMITY_SET_WINDOW_DAYS
  return joinBlocks([
    subsection(
      level,
      `${days} day historic anonymity set`,
      joinBlocks([
        `How many unique addresses you could have blended in with if you withdrew on a particular day after depositing during the previous ${days} days. This metric is a proxy for the historic anonymity set and shows how it developed over time.`,
        'The metric looks backwards: it counts deposits that already happened, including from addresses that have since withdrawn. Your real anonymity also depends on deposits made after yours, which cannot be known in advance.',
      ]),
    ),
    subsection(
      level,
      'Estimated anonymity set by holding duration',
      `An estimate of how many unique addresses you blend in with, depending on how long you leave your deposit in the pool. It is based on historic data of past deposits: each point counts depositors from the preceding period, so holding for up to ${days} days effectively means blending in with everyone who deposited during the last ${days} days.`,
    ),
    htmlPagePointer('The interactive charts are shown', props.id, context),
  ])
}

/** `whatIsShown` starts the sentence, e.g. "The interactive chart is shown". */
function htmlPagePointer(
  whatIsShown: string,
  id: ProjectSectionId,
  context: SectionContext,
) {
  return `${whatIsShown} on ${link('the HTML page', `${context.pageUrl}#${id}`)}.`
}

function renderDataSource(dataSource: string | undefined) {
  return dataSource ? `Data source: ${dataSource}` : ''
}

function renderTrackedTxsOutage() {
  return env.CLIENT_SIDE_TRACKED_TXS_OUTAGE
    ? warning(
        "Data in this section may be temporarily out of date due to third-party provider issues. We're working to resolve this.",
      )
    : ''
}

const IMPLEMENTATION_CHANGE_WARNING = warning(
  'There are implementation changes to tracked contracts, anomaly data might be inaccurate.',
)

function renderOngoingAnomalies(
  ongoing: LivenessAnomaly[],
  hasTrackedContractsChanged: boolean,
  level: number,
) {
  if (ongoing.length === 0) return 'No ongoing anomalies detected.'
  const approved = ongoing.filter((anomaly) => anomaly.isApproved)
  const unapproved = ongoing.filter((anomaly) => !anomaly.isApproved)
  const group = (title: string, anomalies: LivenessAnomaly[]) =>
    subsection(
      level,
      `${title} ${anomalies.length === 1 ? 'anomaly' : 'anomalies'}`,
      anomalies.length > 0
        ? joinBlocks([
            hasTrackedContractsChanged ? IMPLEMENTATION_CHANGE_WARNING : '',
            bulletList(anomalies.map(formatAnomaly)),
          ])
        : '',
    )
  return joinBlocks([
    group('Ongoing', approved),
    group('Potential ongoing', unapproved),
  ])
}

function renderLast30DayAnomalies(
  anomalies: LivenessAnomaly[],
  hasTrackedContractsChanged: boolean,
  level: number,
) {
  return subsection(
    level,
    'Last 30 day anomalies',
    anomalies.length > 0
      ? joinBlocks([
          'All liveness anomalies detected for this project in the last 30 days, helping you review recent downtime and availability issues.',
          hasTrackedContractsChanged ? IMPLEMENTATION_CHANGE_WARNING : '',
          bulletList(anomalies.map(formatAnomaly)),
        ])
      : '',
  )
}

/** Same sentence as the HTML anomaly text. */
function formatAnomaly(anomaly: LivenessAnomaly) {
  const what = anomalySubtypeToLabel(anomaly.subtype).toLowerCase()
  const duration = formatSeconds(anomaly.durationInSeconds)
  const usually = `These typically occur every ${formatSeconds(anomaly.avgInterval)} on average.`
  if (isOngoing(anomaly)) {
    return `No ${what} have been performed for the past ${duration} (since ${formatUtcDateTime(anomaly.start)}). ${usually}`
  }
  const until = anomaly.end ? ` until ${formatUtcDateTime(anomaly.end)}` : ''
  return `No ${what} were performed for ${duration} (from ${formatUtcDateTime(anomaly.start)}${until}). ${usually}`
}

function isOngoing(anomaly: LivenessAnomaly) {
  return anomaly.status === 'ongoing'
}

/** Collapsed on the HTML page, with historical ones behind a checkbox; here all are listed and marked. */
function renderTrackedTransactions(
  transactions: TrackedTransactionsByType,
  level: number,
) {
  return subsection(
    level,
    'Tracked transactions',
    joinBlocks(
      (['batchSubmissions', 'proofSubmissions', 'stateUpdates'] as const).map(
        (subtype) =>
          subsection(
            level + 1,
            TRACKED_TXS_SUBTYPE_TITLES[subtype],
            bulletList(
              (transactions[subtype] ?? []).map(formatTrackedTransaction),
            ),
          ),
      ),
    ),
  )
}

function formatTrackedTransaction(transaction: TrackedTransaction) {
  const { params } = transaction
  const until = transaction.untilTimestamp
    ? formatUtcDateTime(transaction.untilTimestamp)
    : 'now'
  const details = [
    `${formatUtcDateTime(transaction.sinceTimestamp)} - ${until}`,
    transaction.isHistorical ? 'historical' : 'currently used',
    ...(params.formula === 'transfer'
      ? [
          ...(params.from ? [`from: ${etherscanLink(params.from)}`] : []),
          `to: ${etherscanLink(params.to)}`,
        ]
      : [
          `address: ${etherscanLink(params.address)}`,
          `selector: ${params.selector}`,
        ]),
    ...('signature' in params ? [`signature: \`${params.signature}\``] : []),
    ...(params.formula === 'sharedBridge'
      ? [`first calldata parameter: ${params.firstParameter}`]
      : []),
    ...(params.formula === 'sharpSubmission'
      ? [
          `program hashes: ${params.programHashes.map((hash) => `\`${hash}\``).join(', ')}`,
        ]
      : []),
    ...(transaction.costMultiplier
      ? [`cost multiplier: ${transaction.costMultiplier}`]
      : []),
  ]
  return `${params.formula}: ${details.join('; ')}`
}

function formatDaTrackingConfig(
  config: DataPostedSectionProps['daTrackingConfig'][number],
) {
  const range =
    config.type === 'eigen-da'
      ? `from ${formatUtcDateTime(config.sinceTimestamp)} to ${config.untilTimestamp ? formatUtcDateTime(config.untilTimestamp) : 'now'}`
      : `from block ${config.sinceBlock} to ${config.untilBlock ?? 'now'}`
  const isHistorical =
    config.type === 'eigen-da' ? !!config.untilTimestamp : !!config.untilBlock
  const details = [
    range,
    isHistorical ? 'historical' : 'currently used',
    ...(config.type === 'ethereum'
      ? [
          `inbox: ${etherscanLink(config.inbox)}`,
          ...(config.sequencers && config.sequencers.length > 0
            ? [`sequencers: ${config.sequencers.map(etherscanLink).join(', ')}`]
            : []),
          ...(config.topics && config.topics.length > 0
            ? [`topics: ${config.topics.join(', ')}`]
            : []),
        ]
      : []),
    ...(config.type === 'celestia' ? [`namespace: ${config.namespace}`] : []),
    ...(config.type === 'avail'
      ? [`app IDs: ${config.appIds.join(', ')}`]
      : []),
    ...(config.type === 'eigen-da'
      ? [`customer ID: ${config.customerId}`]
      : []),
  ]
  return `DA layer ${config.daLayerName}: ${details.join('; ')}`
}

/** The HTML links tracked addresses to Etherscan. */
function etherscanLink(address: string) {
  return link(address, `https://etherscan.io/address/${address}`)
}
