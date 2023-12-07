import cx from 'classnames'
import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling/activity/view/types'
import { ScalingDetailedTvlViewEntry } from '../../../pages/scaling/detailed-tvl/types'
import { ScalingLivenessViewEntry } from '../../../pages/scaling/liveness/types'
import { LivenessDurationTimeRangeCell } from '../../../pages/scaling/liveness/view/LivenessDurationTimeRangeCell'
import { LivenessTimeRangeCell } from '../../../pages/scaling/liveness/view/LivenessTimeRangeCell'
import { ScalingRiskViewEntry } from '../../../pages/scaling/risk/view/types'
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
import { ColumnConfig } from '../TableView'
import { TypeCell } from '../TypeCell'
import { ValueWithPercentageCell } from '../ValueWithPercentageCell'

export function getActiveScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
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
    },
    {
      name: 'Stage',
      idHref: 'stage' as const,
      tooltip: 'Rollup stage based on its features and maturity.',
      getValue: (project: ScalingTvlViewEntry) => (
        <StageCell stageConfig={project.stage} />
      ),
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
            {project.tvl}
          </NumberCell>
          <NumberCell signed className="ml-1 w-[72px] !text-base font-medium ">
            {project.sevenDayChange}
          </NumberCell>
        </>
      ),
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      minimalWidth: true,
      headClassName: '!pr-4',
      getValue: (project) =>
        project.tvlBreakdown && (
          <NumberCell className="pr-4">{project.marketShare}</NumberCell>
        ),
    },
  ]

  return columns
}

export function getScalingDetailedTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingDetailedTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
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
              value={project.tvl}
              percentChange={project.tvlChange}
            />
          ),
        },
      ],
    },
    {
      name: (
        <div className="flex items-center gap-1">
          <CanonicalIcon />
          <span>Canonical</span>
        </div>
      ),
      tooltip:
        'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      alignCenter: true,
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.cbv}
          percentChange={project.cbvChange}
          tokens={project.tokens.filter((t) => t.info.type === 'CBV')}
        />
      ),
    },
    {
      name: (
        <div className="flex items-center gap-1">
          <ExternalIcon />
          <span>External</span>
        </div>
      ),
      tooltip:
        'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      alignCenter: true,
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.ebv}
          percentChange={project.ebvChange}
          tokens={project.tokens.filter((t) => t.info.type === 'EBV')}
        />
      ),
    },
    {
      name: (
        <div className="flex items-center gap-1">
          <NativeIcon />
          <span>Native</span>
        </div>
      ),
      tooltip:
        'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
      alignCenter: true,
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.nmv}
          percentChange={project.nmvChange}
          tokens={project.tokens.filter((t) => t.info.type === 'NMV')}
        />
      ),
    },
  ]

  return columns
}

export function getUpcomingScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this project.',
      getValue: (project) => project.purpose,
    },
  ]

  return columns
}

export function getArchivedScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
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
          <NumberCell className="font-bold">{project.tvl}</NumberCell>
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
    },
  ]

  return columns
}

export function getLayer3sScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
      shortName: 'Type',
      getValue: (project) => <TypeCell>{project.category}</TypeCell>,
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

export function getScalingRiskColumnsConfig() {
  const columns: ColumnConfig<ScalingRiskViewEntry>[] = [
    {
      name: '#',
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      getValue: (project) => <ProjectCell project={project} />,
    },
    {
      name: 'State validation',
      tooltip: 'How is the validity of the system state checked?',
      getValue: (project) => <RiskCell item={project.stateValidation} />,
    },
    {
      name: 'Data availability',
      tooltip: 'Is the data needed to reconstruct the state available?',
      getValue: (project) => <RiskCell item={project.dataAvailability} />,
    },
    {
      name: 'Upgradeability',
      tooltip:
        'Are the Ethereum contracts upgradeable? Note that the delay itself might not be enough to ensure that users can withdraw their funds in the case of a malicious and censoring operator.',
      getValue: (project) => <RiskCell item={project.upgradeability} />,
    },
    {
      name: 'Sequencer failure',
      tooltip:
        "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
    },
    {
      name: 'Proposer failure',
      tooltip:
        'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
      getValue: (project) => <RiskCell item={project.proposerFailure} />,
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
    },
    {
      name: '7d Change',
      tooltip:
        'Observed change in average daily transactions per second as compared to a week ago.',
      alignRight: true,
      getValue: (project) => (
        <NumberCell signed>{project.tpsWeeklyChange}</NumberCell>
      ),
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
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
      minimalWidth: true,
      getValue: (project) => <ProjectCell project={project} />,
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
          name: 'Tx data submissions',
          tooltip: 'How often transaction batches are submitted to the L1',
          getValue: (project) => {
            return (
              <LivenessDurationTimeRangeCell
                data={project.batchSubmissions}
                project={project}
                dataType="txDataSubmissions"
              />
            )
          },
        },
        {
          name: 'State updates',
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
        },
      ],
    },
    {
      name: 'Type',
      tooltip:
        'Type of this project. Determines data availability and proof system used.<br>ZK Rollups = Validity Proofs + onchain data<br>Optimistic Rollups = Fraud Proofs + onchain data<br>Validiums = Validity Proofs + offchain data<br>Optimiums = Fraud Proofs + offchain data',
      shortName: 'Type',
      getValue: (project) => (
        <TypeCell provider={project.provider} disableColors>
          {project.category}
        </TypeCell>
      ),
    },
    {
      name: '30-day anomalies',
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
