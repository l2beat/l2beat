import { formatSeconds } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import type { ActivitySectionProps } from '~/components/projects/sections/ActivitySection'
import type { CostsSectionProps } from '~/components/projects/sections/costs/CostsSection'
import { TRACKED_TXS_SUBTYPE_TITLES } from '~/components/projects/sections/costs/trackedTxsSubtypeTitles'
import type { DataPostedSectionProps } from '~/components/projects/sections/data-posted/DataPostedSection'
import { anomalySubtypeToLabel } from '~/components/projects/sections/liveness/anomalySubtypeToLabel'
import type { LivenessSectionProps } from '~/components/projects/sections/liveness/LivenessSection'
import {
  ANONYMITY_SET_LOOKS_BACKWARDS_NOTE,
  anonymitySetByHoldingDurationDescription,
  anonymitySetHistoricDescription,
  COSTS_DESCRIPTION,
  DA_BRIDGE_LIVENESS_DESCRIPTION,
  DATA_POSTED_DESCRIPTION,
  LAST_30_DAY_ANOMALIES_DESCRIPTION,
  LIVENESS_DESCRIPTION,
  TRACKED_CONTRACTS_CHANGED_WARNING,
  trackedTxsOutageText,
} from '~/components/projects/sections/sectionCopy'
import type { L2TvsSectionProps } from '~/components/projects/sections/tvs/L2TvsSection'
import type { ProjectSectionId } from '~/components/projects/sections/types'
import { env } from '~/env'
import type { LivenessAnomaly } from '~/server/features/layer2s/liveness/types'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import { isAnomalyOngoing } from '~/utils/project/liveness/isAnomalyOngoing'
import type {
  TrackedTransaction,
  TrackedTransactionsByType,
} from '~/utils/project/tracked-txs/getTrackedTransactions'
import { bulletList, joinBlocks, link, subsection, warning } from './markdown'
import type { SectionBody } from './renderProjectSection'
import { formatUtcDateTime, htmlPagePointer } from './renderSectionParts'

/*
 * Sections built around a chart or a client-loaded widget. The data behind
 * them is not in the page props, so the markdown points to the HTML page for
 * it, but carries the text and facts the server renders around it.
 */

/** For sections whose whole content is loaded by the browser. */
export function pointToHtmlPage(
  whatIsShown: string,
): SectionBody<{ id: ProjectSectionId }> {
  return (props) => htmlPagePointer(whatIsShown, props.id)
}

export function renderActivitySection(
  props: Pick<ActivitySectionProps, 'id' | 'dataSource'>,
) {
  return joinBlocks([
    htmlPagePointer('The interactive activity chart is shown', props.id),
    renderDataSource(props.dataSource),
  ])
}

export function renderL2TvsSection(
  props: Pick<L2TvsSectionProps, 'id' | 'tvsBreakdownUrl'>,
) {
  return joinBlocks([
    htmlPagePointer('The interactive TVS charts are shown', props.id),
    props.tvsBreakdownUrl
      ? `Token by token: ${link('TVS breakdown', props.tvsBreakdownUrl)}.`
      : '',
  ])
}

export function renderCostsSection(
  props: Pick<CostsSectionProps, 'id' | 'trackedTransactions'>,
  level: number,
) {
  return joinBlocks([
    COSTS_DESCRIPTION,
    renderTrackedTxsOutage(),
    htmlPagePointer('The interactive costs chart is shown', props.id),
    renderTrackedTransactions(props.trackedTransactions, level),
  ])
}

export function renderDataPostedSection(
  props: Pick<
    DataPostedSectionProps,
    'id' | 'currentDaLayers' | 'pastDaLayers' | 'daTrackingConfig'
  >,
  level: number,
) {
  return joinBlocks([
    `${DATA_POSTED_DESCRIPTION} ${describeDaLayers(props)}`.trimEnd(),
    htmlPagePointer('The interactive data posted chart is shown', props.id),
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
) {
  const ongoing = props.anomalies.filter(isAnomalyOngoing)
  return joinBlocks([
    props.isForDaBridge ? DA_BRIDGE_LIVENESS_DESCRIPTION : LIVENESS_DESCRIPTION,
    renderTrackedTxsOutage(),
    props.isArchived
      ? ''
      : renderOngoingAnomalies(
          ongoing,
          props.hasTrackedContractsChanged,
          level,
        ),
    htmlPagePointer('The interactive liveness chart is shown', props.id),
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

/** The explanations around the two charts; the charts load in the browser. */
export function renderPrivacyAnonymitySetSection(
  props: { id: ProjectSectionId },
  level: number,
) {
  const days = ANONYMITY_SET_WINDOW_DAYS
  return joinBlocks([
    subsection(
      level,
      `${days} day historic anonymity set`,
      joinBlocks([
        anonymitySetHistoricDescription(days),
        ANONYMITY_SET_LOOKS_BACKWARDS_NOTE,
      ]),
    ),
    subsection(
      level,
      'Estimated anonymity set by holding duration',
      anonymitySetByHoldingDurationDescription(days),
    ),
    htmlPagePointer('The interactive charts are shown', props.id),
  ])
}

/**
 * A project whose tracking has all ended has no current layer: the HTML
 * sentence then names nothing after "posts data to", so it is reworded.
 */
function describeDaLayers({
  currentDaLayers,
  pastDaLayers,
}: Pick<DataPostedSectionProps, 'currentDaLayers' | 'pastDaLayers'>) {
  const links = (layers: DataPostedSectionProps['currentDaLayers']) =>
    layers.map((layer) => layer.name).join(', ')
  if (currentDaLayers.length === 0) {
    return pastDaLayers.length > 0
      ? `The project no longer posts data; previously it posted to ${links(pastDaLayers)}.`
      : ''
  }
  const previously =
    pastDaLayers.length > 0
      ? `; previously it posted to ${links(pastDaLayers)}`
      : ''
  return `The project currently posts data to ${links(currentDaLayers)}${previously}.`
}

function renderDataSource(dataSource: string | undefined) {
  return dataSource ? `Data source: ${dataSource}` : ''
}

function renderTrackedTxsOutage() {
  return env.CLIENT_SIDE_TRACKED_TXS_OUTAGE
    ? warning(trackedTxsOutageText('section'))
    : ''
}

const IMPLEMENTATION_CHANGE_WARNING = warning(TRACKED_CONTRACTS_CHANGED_WARNING)

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
          LAST_30_DAY_ANOMALIES_DESCRIPTION,
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
  if (isAnomalyOngoing(anomaly)) {
    return `No ${what} have been performed for the past ${duration} (since ${formatUtcDateTime(anomaly.start)}). ${usually}`
  }
  const until = anomaly.end ? ` until ${formatUtcDateTime(anomaly.end)}` : ''
  return `No ${what} were performed for ${duration} (from ${formatUtcDateTime(anomaly.start)}${until}). ${usually}`
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
  const target =
    params.formula === 'transfer'
      ? [
          params.from && `from: ${etherscanLink(params.from)}`,
          `to: ${etherscanLink(params.to)}`,
        ]
      : [
          `address: ${etherscanLink(params.address)}`,
          `selector: ${params.selector}`,
        ]
  const details = compact([
    `${formatUtcDateTime(transaction.sinceTimestamp)} - ${until}`,
    transaction.isHistorical ? 'historical' : 'currently used',
    ...target,
    'signature' in params && `signature: \`${params.signature}\``,
    params.formula === 'sharedBridge' &&
      `first calldata parameter: ${params.firstParameter}`,
    params.formula === 'sharpSubmission' &&
      `program hashes: ${params.programHashes.map((hash) => `\`${hash}\``).join(', ')}`,
    transaction.costMultiplier &&
      `cost multiplier: ${transaction.costMultiplier}`,
  ])
  return `${params.formula}: ${details.join('; ')}`
}

type DaTrackingConfig = DataPostedSectionProps['daTrackingConfig'][number]

function formatDaTrackingConfig(config: DaTrackingConfig) {
  const details = [
    describeDaTrackingRange(config),
    isDaTrackingHistorical(config) ? 'historical' : 'currently used',
    ...describeDaTrackingTarget(config),
  ]
  return `DA layer ${config.daLayerName}: ${details.join('; ')}`
}

function describeDaTrackingRange(config: DaTrackingConfig) {
  return `from block ${config.sinceBlock} to ${config.untilBlock ?? 'now'}`
}

function isDaTrackingHistorical(config: DaTrackingConfig) {
  return !!config.untilBlock
}

/** What identifies the project's blobs on Ethereum. */
function describeDaTrackingTarget(config: DaTrackingConfig): string[] {
  return compact([
    `inbox: ${etherscanLink(config.inbox)}`,
    config.sequencers?.length &&
      `sequencers: ${config.sequencers.map(etherscanLink).join(', ')}`,
    config.topics?.length && `topics: ${config.topics.join(', ')}`,
  ])
}

/** The HTML links tracked addresses to Etherscan. */
function etherscanLink(address: string) {
  return link(address, `https://etherscan.io/address/${address}`)
}
