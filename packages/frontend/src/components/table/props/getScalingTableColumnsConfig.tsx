import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling/activity/types'
import { ScalingDataAvailabilityViewEntry } from '../../../pages/scaling/data-availability/types'
import { ScalingFinalityViewEntry } from '../../../pages/scaling/finality/types'
import { ScalingLivenessViewEntry } from '../../../pages/scaling/liveness/types'
import { LivenessDurationTimeRangeCell } from '../../../pages/scaling/liveness/view/LivenessDurationTimeRangeCell'
import { LivenessTimeRangeCell } from '../../../pages/scaling/liveness/view/LivenessTimeRangeCell'
import { ScalingRiskViewEntry } from '../../../pages/scaling/risk/types'
import {
  ScalingL2SummaryViewEntry,
  ScalingL3SummaryViewEntry,
  ScalingSummaryViewEntry,
} from '../../../pages/scaling/summary/types'
import { ScalingTvlViewEntry } from '../../../pages/scaling/tvl/types'
import { formatLargeNumber } from '../../../utils'
import { cn } from '../../../utils/cn'
import { formatTps } from '../../../utils/formatTps'
import { AnomalyIndicator } from '../../AnomalyIndicator'
import { Badge } from '../../badge/Badge'
import { CanonicalIcon, ExternalIcon, InfoIcon, NativeIcon } from '../../icons'
import { StageCell } from '../../stages/StageCell'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'
import { FinalityDurationCell } from '../FinalityDurationCell'
import { NumberCell } from '../NumberCell'
import { RiskCell } from '../RiskCell'
import { RosetteCell } from '../RosetteCell'
import { SentimentText } from '../SentimentText'
import { TotalCell } from '../TotalCell'
import { TotalValue } from '../TotalValue'
import { TypeCell, TypeColumnTooltip } from '../TypeCell'
import { ColumnConfig } from '../types'
import { ValueWithPercentageCell } from '../ValueWithPercentageCell'
import { getProjectWithIndexColumns } from './getProjectWithIndexColumns'
import { getOrderValueBySentiment } from './sorting/getOrderValueBySentiment'
import { getStageOrderValue } from './sorting/getStageOrderValue'

export function getActiveScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingL2SummaryViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      idHref: 'risk-analysis',
      minimalWidth: true,
      align: 'center',
      getValue: (project) => (
        <RosetteCell
          riskValues={project.riskValues}
          isUpcoming={project.isUpcoming}
        />
      ),
    },
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Stage',
      idHref: 'stage' as const,
      tooltip: 'Rollup stage based on its features and maturity.',
      getValue: (project) => <StageCell stageConfig={project.stage} />,
      sorting: {
        getOrderValue: (project) => getStageOrderValue(project.stage),
        rule: 'numeric',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purposes.join(', '),
    },
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      align: 'right',
      noPaddingRight: true,
      headClassName: '-translate-x-[72px]',
      getValue: (project) => <TotalCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.tvl?.value,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      align: 'right',
      minimalWidth: true,
      headClassName: '!pr-4',
      getValue: (project) =>
        project.tvlBreakdown ? (
          <NumberCell className="pr-4">
            {project.marketShare?.displayValue}
          </NumberCell>
        ) : (
          <span className="pr-4">—</span>
        ),
      sorting: {
        getOrderValue: (project) => project.marketShare?.value,
        rule: 'numeric',
      },
    },
  ]

  return columns
}

export function getUpcomingScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingSummaryViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purposes.join(', '),
    },
  ]

  return columns
}

export function getArchivedScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingL2SummaryViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      minimalWidth: true,
      align: 'center',
      getValue: (project) => <RosetteCell riskValues={project.riskValues} />,
    },
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purposes.join(', '),
    },
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      align: 'right',
      noPaddingRight: true,
      headClassName: '-translate-x-[72px]',
      getValue: (project) => (
        <>
          <NumberCell className="font-bold">
            {project.tvl?.displayValue}
          </NumberCell>
          {!project.isArchived ? (
            <NumberCell
              signed
              className="ml-1 w-[72px] !text-base font-medium "
            >
              {project.sevenDayChange}
            </NumberCell>
          ) : (
            <span className="w-[72px]" />
          )}
        </>
      ),
      sorting: {
        getOrderValue: (project) => project.tvl?.value,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
  ]

  return columns
}

export function getLayer3sScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingL3SummaryViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => <TypeCell>{project.category}</TypeCell>,
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Technology',
      tooltip: 'The technology stack used.',
      shortName: 'Tech',
      getValue: (project) => project.provider,
    },
    {
      name: 'Host Chain',
      tooltip: 'The chain, on top of which the L3 is built.',
      getValue: (project) => project.hostChainName,
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purposes.join(', '),
    },
  ]

  return columns
}

export function getScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      type: 'group',
      columns: [
        {
          name: 'Total',
          tooltip: 'Total = Canonical + External + Native',
          align: 'center',
          noPaddingRight: true,
          getValue: (project) => <TotalValue project={project} />,
          sorting: {
            getOrderValue: (project) =>
              project.tvl?.value !== 0 ? project.tvl?.value : undefined,
            rule: 'numeric',
            defaultState: 'desc',
          },
        },
      ],
    },
    {
      name: 'Canonical',
      icon: <CanonicalIcon />,
      tooltip:
        'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      align: 'center',
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.cbv?.displayValue}
          percentChange={project.cbvChange}
          tokens={project.tokens.filter((t) => t.info.type === 'CBV')}
        />
      ),
      sorting: {
        getOrderValue: (project) =>
          project.cbv?.value !== 0 ? project.cbv?.value : undefined,
        rule: 'numeric',
      },
    },
    {
      name: 'External',
      icon: <ExternalIcon />,
      tooltip:
        'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      align: 'center',
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.ebv?.displayValue}
          percentChange={project.ebvChange}
          tokens={project.tokens.filter((t) => t.info.type === 'EBV')}
        />
      ),
      sorting: {
        getOrderValue: (project) =>
          project.ebv?.value !== 0 ? project.ebv?.value : undefined,
        rule: 'numeric',
      },
    },
    {
      name: 'Native',
      icon: <NativeIcon />,
      tooltip:
        'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
      align: 'center',
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.nmv?.displayValue}
          percentChange={project.nmvChange}
          tokens={project.tokens.filter((t) => t.info.type === 'NMV')}
        />
      ),
      sorting: {
        getOrderValue: (project) =>
          project.nmv?.value !== 0 ? project.nmv?.value : undefined,
        rule: 'numeric',
      },
    },
  ]

  return columns
}

export function getScalingRiskColumnsConfig() {
  const columns: ColumnConfig<ScalingRiskViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'State\nvalidation',
      tooltip: 'How is the validity of the system state checked?',
      getValue: (project) => <RiskCell item={project.stateValidation} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.stateValidation),
        rule: 'numeric',
      },
    },
    {
      name: 'Data\navailability',
      tooltip: 'Is the data needed to reconstruct the state available?',
      getValue: (project) => <RiskCell item={project.dataAvailability} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.dataAvailability),
        rule: 'numeric',
      },
    },
    {
      name: 'Exit\nwindow',
      tooltip:
        'How much time do users have to exit the system in case of an unwanted upgrade?',
      getValue: (project) => <RiskCell item={project.exitWindow} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.exitWindow),
        rule: 'numeric',
      },
    },
    {
      name: 'Sequencer\nfailure',
      tooltip:
        "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.sequencerFailure),
        rule: 'numeric',
      },
    },
    {
      name: 'Proposer\nfailure',
      tooltip:
        'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
      getValue: (project) => <RiskCell item={project.proposerFailure} />,
      headClassName: '!pr-4',
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.proposerFailure),
        rule: 'numeric',
      },
    },
  ]
  return columns
}

export function getScalingActivityColumnsConfig() {
  const columns: ColumnConfig<ActivityViewEntry>[] = [
    ...getProjectWithIndexColumns(),
    {
      name: 'Past day TPS',
      tooltip: 'Transactions per second averaged over the past day.',
      align: 'right',
      colSpan: (project) => (project.data === undefined ? 5 : undefined),
      getValue: (project) =>
        project.data ? (
          <NumberCell>{formatTps(project.data.tpsDaily)}</NumberCell>
        ) : (
          <Badge type="gray" className="mr-0 w-full text-center lg:mr-4">
            MISSING DATA
          </Badge>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.tpsDaily,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: '7d Change',
      tooltip:
        'Observed change in average daily transactions per second as compared to a week ago.',
      align: 'right',
      getValue: (project) =>
        project.data && (
          <NumberCell signed>{project.data.tpsWeeklyChange}</NumberCell>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.tpsWeeklyChange,
        rule: 'numeric',
      },
    },
    {
      name: 'Max daily TPS',
      tooltip:
        'Highest observed transactions per second averaged over a single day.',
      align: 'right',
      getValue: (project) =>
        project.data !== undefined && (
          <span className="flex items-baseline justify-end gap-1.5">
            <NumberCell>{formatTps(project.data.maxTps)}</NumberCell>
            <span
              className={cn(
                'text-gray-700 dark:text-gray-300',
                'block min-w-[115px] text-left',
              )}
            >
              on {project.data.maxTpsDate}
            </span>
          </span>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.maxTps,
        rule: 'numeric',
      },
    },
    {
      name: '30D Count',
      tooltip: 'Total number of transactions over the past month.',
      align: 'right',
      getValue: (project) =>
        project.data && (
          <NumberCell>
            {formatLargeNumber(project.data.transactionsMonthlyCount)}
          </NumberCell>
        ),
      removeCellOnFalsyValue: true,
      sorting: {
        getOrderValue: (project) => project.data?.transactionsMonthlyCount,
        rule: 'numeric',
      },
    },
    {
      name: 'Data source',
      tooltip: 'Where is the transaction data coming from.',
      getValue: (project) => project.data !== undefined && project.dataSource,
      removeCellOnFalsyValue: true,
    },
  ]
  return columns
}

export function getScalingLivenessColumnsConfig() {
  const columns: ColumnConfig<ScalingLivenessViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      type: 'group',
      title: (
        <LivenessTimeRangeCell
          last30Days={'30-day average intervals'}
          last90Days={'90-day average intervals'}
          max={'all-time average intervals'}
        />
      ),
      columns: [
        {
          name: 'Tx data\nsubmissions',
          tooltip: 'How often transaction batches are submitted to the L1',
          colSpan: (project) => (!project.isSynced ? 3 : undefined),
          getValue: (project) =>
            project.isSynced ? (
              <LivenessDurationTimeRangeCell
                data={project.batchSubmissions}
                project={project}
                dataType="batchSubmissions"
              />
            ) : (
              <Badge type="gray" className="mr-0 w-full text-center lg:mr-4">
                COMING SOON
              </Badge>
            ),
          sorting: {
            getOrderValue: (project) => {
              if (!project.isSynced)
                return {
                  '30D': undefined,
                  '90D': undefined,
                  MAX: undefined,
                }
              return {
                '30D': project.batchSubmissions?.last30Days?.averageInSeconds,
                '90D': project.batchSubmissions?.last90Days?.averageInSeconds,
                MAX: project.batchSubmissions?.allTime?.averageInSeconds,
              }
            },
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
        {
          name: 'Proof\nsubmissions',
          tooltip: 'How often validity proofs are submitted to the L1',
          getValue: (project) =>
            project.isSynced ? (
              <LivenessDurationTimeRangeCell
                data={project.proofSubmissions}
                project={project}
                dataType="proofSubmissions"
              />
            ) : undefined,
          removeCellOnFalsyValue: true,
          sorting: {
            getOrderValue: (project) => {
              if (!project.isSynced)
                return {
                  '30D': undefined,
                  '90D': undefined,
                  MAX: undefined,
                }
              return {
                '30D': project.proofSubmissions?.last30Days?.averageInSeconds,
                '90D': project.proofSubmissions?.last90Days?.averageInSeconds,
                MAX: project.proofSubmissions?.allTime?.averageInSeconds,
              }
            },
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
        {
          name: 'State\nupdates',
          tooltip: 'How often state roots are submitted to the L1',
          getValue: (project) =>
            project.isSynced ? (
              <LivenessDurationTimeRangeCell
                data={project.stateUpdates}
                project={project}
                dataType="stateUpdates"
              />
            ) : undefined,
          removeCellOnFalsyValue: true,
          sorting: {
            getOrderValue: (project) => {
              if (!project.isSynced)
                return {
                  '30D': undefined,
                  '90D': undefined,
                  MAX: undefined,
                }
              return {
                '30D': project.stateUpdates?.last30Days?.averageInSeconds,
                '90D': project.stateUpdates?.last90Days?.averageInSeconds,
                MAX: project.stateUpdates?.allTime?.averageInSeconds,
              }
            },
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
      ],
    },
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip showOnlyRollupsDefinitions />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider} disableColors>
          {project.category}
        </TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: '30-day\nanomalies',
      tooltip:
        'Anomalies are based on a Z-score. It measures how far away a data point is from a 30-day rolling average. We consider as anomalies the data points with Z-score > 15.',
      align: 'center',
      getValue: (project) => (
        <AnomalyIndicator
          anomalyEntries={project.isSynced ? project.anomalyEntries : []}
          showComingSoon={!project.isSynced || project.slug === 'linea'}
        />
      ),
    },
    {
      name: '',
      getValue: (project) =>
        project.explanation ? (
          <Tooltip className="pr-4">
            <TooltipTrigger>
              <InfoIcon className="fill-blue-550" />
            </TooltipTrigger>
            <TooltipContent>{project.explanation}</TooltipContent>
          </Tooltip>
        ) : null,
    },
  ]
  return columns
}

export function getScalingFinalityColumnsConfig() {
  const columns: ColumnConfig<ScalingFinalityViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'DA MODE',
      getValue: (project) =>
        project.dataAvailabilityMode ?? <span>&mdash;</span>,
      tooltip:
        'The type shows whether projects are posting transaction data batches or state diffs to the L1.',
      sorting: {
        getOrderValue: (project) => project.dataAvailabilityMode,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Past day avg.\nTime to inclusion',
      getValue: (project) =>
        project.data ? (
          <FinalityDurationCell data={project.data} />
        ) : (
          <Badge type="gray">COMING SOON</Badge>
        ),
      tooltip:
        'The average time it would take for an L2 transaction to be included on the L1. Please note, this is an approximate estimation and is different than Time to finality since it ignores the overhead time to reach L1 finality after L1 inclusion.',
      sorting: {
        rule: 'numeric',
        getOrderValue: (project) =>
          project.data?.timeToInclusion.averageInSeconds,
      },
    },
    {
      name: 'State update delay',
      tooltip:
        'Time interval between time to finality and state root submission.',
      getValue: () => <Badge type="gray">COMING SOON</Badge>,
    },
    {
      name: 'Execution delay',
      tooltip:
        'Time interval between state root submission and state root finalization. For Optimistic Rollups, this usually corresponds to the challenge period, whereas for ZK Rollups, it might be added as a safety precaution.',
      getValue: (project) => <span>{project.finalizationPeriod}</span>,
    },
  ]
  return columns
}

export function getScalingDataAvailabilityColumnsConfig() {
  const columns: ColumnConfig<ScalingDataAvailabilityViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'DA Layer',
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is published.',
      getValue: (project) => (
        <SentimentText
          sentiment={project.dataAvailability.layer.sentiment}
          description={project.dataAvailability.layer.description}
        >
          {project.dataAvailability.layer.value}
        </SentimentText>
      ),
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.dataAvailability.layer),
        rule: 'alphabetical',
      },
    },
    {
      name: 'DA Bridge',
      tooltip:
        'The DA bridge used for informing Ethereum contracts if data has been made available.',
      getValue: (project) => (
        <SentimentText
          sentiment={project.dataAvailability.bridge.sentiment}
          description={project.dataAvailability.bridge.description}
        >
          {project.dataAvailability.bridge.value}
        </SentimentText>
      ),
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.dataAvailability.bridge),
        rule: 'alphabetical',
      },
    },
    {
      name: 'Type of data',
      getValue: (project) => project.dataAvailability.mode,
      sorting: {
        getOrderValue: (project) => project.dataAvailability.mode,
        rule: 'alphabetical',
      },
    },
  ]
  return columns
}
