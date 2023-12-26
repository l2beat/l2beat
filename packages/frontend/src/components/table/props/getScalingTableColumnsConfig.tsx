import cx from 'classnames'
import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling/activity/types'
import { ScalingLivenessViewEntry } from '../../../pages/scaling/liveness/types'
import { LivenessDurationTimeRangeCell } from '../../../pages/scaling/liveness/view/LivenessDurationTimeRangeCell'
import { LivenessTimeRangeCell } from '../../../pages/scaling/liveness/view/LivenessTimeRangeCell'
import { ScalingRiskViewEntry } from '../../../pages/scaling/risk/types'
import { ScalingSummaryViewEntry } from '../../../pages/scaling/summary/types'
import { ScalingTvlViewEntry } from '../../../pages/scaling/tvl/types'
import { formatLargeNumber } from '../../../utils'
import { formatTps } from '../../../utils/formatTps'
import { AnomalyIndicator } from '../../AnomalyIndicator'
import { CanonicalIcon, ExternalIcon, InfoIcon, NativeIcon } from '../../icons'
import { StageCell } from '../../stages/StageCell'
import { ComingSoonCell } from '../ComingSoonCell'
import { EthereumCell } from '../EthereumCell'
import { IndexCell } from '../IndexCell'
import { NumberCell } from '../NumberCell'
import { ProjectCell } from '../ProjectCell'
import { RiskCell } from '../RiskCell'
import { RosetteCell } from '../RosetteCell'
import { TypeCell } from '../TypeCell'
import { ColumnConfig } from '../types'
import { ValueWithPercentageCell } from '../ValueWithPercentageCell'
import { getOrderValueBySentiment } from './sorting/getOrderValueBySentiment'

export function getActiveScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingSummaryViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      idHref: 'risk-analysis',
      minimalWidth: true,
      alignCenter: true,
      getValue: (project) => (
        <RosetteCell
          riskValues={project.riskValues}
          isUpcoming={project.isUpcoming}
        />
      ),
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
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
      getValue: (project: ScalingSummaryViewEntry) => (
        <StageCell stageConfig={project.stage} />
      ),
      sorting: {
        getOrderValue: (project) => {
          const stage = project.stage.stage
          if (stage === 'NotApplicable' || stage === 'UnderReview') {
            return undefined
          }
          if (stage === 'Stage 0') {
            if (project.stage.message?.type === 'warning') {
              return 0
            }

            if (project.stage.message?.type === 'underReview') {
              return 1
            }

            return 2
          }
          if (stage === 'Stage 1') {
            return 3
          }
          return 4
        },
        rule: 'numeric',
      },
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purpose,
    },
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      alignRight: true,
      noPaddingRight: true,
      headClassName: '-translate-x-[72px]',
      getValue: (project) => (
        <>
          <NumberCell className="font-bold" tooltip={project.tvlTooltip}>
            {project.tvl?.displayValue}
          </NumberCell>
          <NumberCell signed className="ml-1 w-[72px] !text-base font-medium ">
            {project.sevenDayChange}
          </NumberCell>
        </>
      ),
      sorting: {
        getOrderValue: (project) => project.tvl?.value,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      minimalWidth: true,
      headClassName: '!pr-4',
      getValue: (project) =>
        project.tvlBreakdown && (
          <NumberCell className="pr-4">
            {project.marketShare?.displayValue}
          </NumberCell>
        ),
      //TODO: (Radina) do we need this sorting? its the same as TVL
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
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
        defaultState: 'asc',
      },
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
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
      getValue: (project) => project.purpose,
    },
  ]

  return columns
}

export function getArchivedScalingSummaryColumnsConfig() {
  const columns: ColumnConfig<ScalingSummaryViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      minimalWidth: true,
      alignCenter: true,
      getValue: (project) => <RosetteCell riskValues={project.riskValues} />,
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
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
      getValue: (project) => project.purpose,
    },
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.',
      alignRight: true,
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
  const columns: ColumnConfig<ScalingSummaryViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
        defaultState: 'asc',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
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
      getValue: (project) => project.purpose,
    },
  ]

  return columns
}

export function getScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
    {
      type: 'group',
      columns: [
        {
          name: 'Total',
          tooltip: 'Total = Canonical + External + Native',
          alignCenter: true,
          noPaddingRight: true,
          getValue: (project) => (
            <ValueWithPercentageCell
              value={project.tvl?.displayValue}
              percentChange={project.tvlChange}
            />
          ),
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
      alignCenter: true,
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
      alignCenter: true,
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
      alignCenter: true,
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
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
        defaultState: 'asc',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
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
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      minimalWidth: true,
      getValue: (project) =>
        project.slug !== 'ethereum' ? (
          <ProjectCell project={project} />
        ) : (
          <EthereumCell project={project} />
        ),
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Past day TPS',
      tooltip: 'Transactions per second averaged over the past day.',
      alignRight: true,
      getValue: (project) =>
        project.tpsDaily !== undefined ? (
          <NumberCell>{formatTps(project.tpsDaily)}</NumberCell>
        ) : (
          <ComingSoonCell />
        ),
      sorting: {
        getOrderValue: (project) => project.tpsDaily,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: '7d Change',
      tooltip:
        'Observed change in average daily transactions per second as compared to a week ago.',
      alignRight: true,
      getValue: (project) => (
        <NumberCell signed>{project.tpsWeeklyChange}</NumberCell>
      ),
      sorting: {
        getOrderValue: (project) => project.tpsWeeklyChange,
        rule: 'numeric',
      },
    },
    {
      name: 'Max daily TPS',
      tooltip:
        'Highest observed transactions per second averaged over a single day.',
      alignRight: true,
      getValue: (project) =>
        project.maxTps !== undefined && (
          <span className="flex items-baseline justify-end gap-1.5">
            <NumberCell>{formatTps(project.maxTps)}</NumberCell>
            <span
              className={cx(
                'text-gray-700 dark:text-gray-300',
                'block min-w-[115px] text-left',
              )}
            >
              on {project.maxTpsDate}
            </span>
          </span>
        ),
      sorting: {
        getOrderValue: (project) => project.maxTps,
        rule: 'numeric',
      },
    },
    {
      name: '30D Count',
      tooltip: 'Total number of transactions over the past month.',
      alignRight: true,
      getValue: (project) =>
        project.transactionsMonthlyCount ? (
          <NumberCell>
            {formatLargeNumber(project.transactionsMonthlyCount)}
          </NumberCell>
        ) : undefined,
      sorting: {
        getOrderValue: (project) => project.transactionsMonthlyCount,
        rule: 'numeric',
      },
    },
    {
      name: 'Data source',
      tooltip: 'Where is the transaction data coming from.',
      getValue: (project) => project.dataSource,
    },
  ]
  return columns
}

export function getScalingLivenessColumnsConfig() {
  const columns: ColumnConfig<ScalingLivenessViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
      sorting: {
        getOrderValue: (_, index) => index,
        rule: 'numeric',
        defaultState: 'asc',
      },
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      minimalWidth: true,
      getValue: (project) => <ProjectCell project={project} />,
      sorting: {
        getOrderValue: (project) => project.name,
        rule: 'alphabetical',
      },
    },
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
          getValue: (project) => {
            return (
              <LivenessDurationTimeRangeCell
                data={project.batchSubmissions}
                project={project}
                dataType="batchSubmissions"
              />
            )
          },
          sorting: {
            getOrderValue: (project) => ({
              '30D': project.batchSubmissions?.last30Days?.averageInSeconds,
              '90D': project.batchSubmissions?.last90Days?.averageInSeconds,
              MAX: project.batchSubmissions?.allTime?.averageInSeconds,
            }),
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
        {
          name: 'Proof\nsubmissions',
          tooltip: 'How often validity proofs are submitted to the L1',
          getValue: (project) => {
            return (
              <LivenessDurationTimeRangeCell
                data={project.proofSubmissions}
                project={project}
                dataType="proofSubmissions"
              />
            )
          },
          sorting: {
            getOrderValue: (project) => ({
              '30D': project.proofSubmissions?.last30Days?.averageInSeconds,
              '90D': project.proofSubmissions?.last90Days?.averageInSeconds,
              MAX: project.proofSubmissions?.allTime?.averageInSeconds,
            }),
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
        {
          name: 'State\nupdates',
          tooltip: 'How often state roots are submitted to the L1',
          getValue: (project) => {
            return (
              <LivenessDurationTimeRangeCell
                data={project.stateUpdates}
                project={project}
                dataType="stateUpdates"
              />
            )
          },
          sorting: {
            getOrderValue: (project) => ({
              '30D': project.stateUpdates?.last30Days?.averageInSeconds,
              '90D': project.stateUpdates?.last90Days?.averageInSeconds,
              MAX: project.stateUpdates?.allTime?.averageInSeconds,
            }),
            defaultOrderKey: '30D',
            rule: 'numeric',
          },
        },
      ],
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data',
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
      alignCenter: true,
      getValue: (project) => (
        <AnomalyIndicator
          anomalyEntries={project.anomalyEntries}
          showComingSoon={
            project.slug === 'starknet' ||
            project.slug === 'zksync-era' ||
            project.slug === 'linea'
          }
        />
      ),
    },
    {
      name: '',
      getValue: (project) =>
        project.explanation ? (
          <div className="pr-4">
            <div className="Tooltip" title={project.explanation}>
              <InfoIcon className="fill-blue-550" />
            </div>
          </div>
        ) : null,
    },
  ]
  return columns
}
