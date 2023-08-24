import cx from 'classnames'
import React from 'react'

import { ActivityViewEntry } from '../../../pages/scaling-activity/view/types'
import { ScalingDetailedTvlViewEntry } from '../../../pages/scaling-detailedTvl/types'
import { ScalingRiskViewEntry } from '../../../pages/scaling-risk/view/types'
import { ScalingTvlViewEntry } from '../../../pages/scaling-tvl/types'
import { formatLargeNumber } from '../../../utils'
import { formatTps } from '../../../utils/formatTps'
import { CanonicalIcon, ExternalIcon, NativeIcon } from '../../icons'
import { StageCell } from '../../stages/StageCell'
import { ComingSoonCell } from '../ComingSoonCell'
import { EthereumCell } from '../EthereumCell'
import { IndexCell } from '../IndexCell'
import { NumberCell } from '../NumberCell'
import { ProjectCell } from '../ProjectCell'
import { RiskCell } from '../RiskCell'
import { RosetteCell } from '../RosetteCell'
import { ColumnConfig } from '../TableView'
import { TechnologyCell } from '../TechnologyCell'
import { ValueWithPercentageCell } from '../ValueWithPercentageCell'

export function getActiveScalingTvlColumns(
  stagesEnabled: boolean,
  detailedTvlEnabled: boolean,
) {
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
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
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
      name: 'Technology',
      tooltip:
        'Type of this Layer 2. Determines data availability and proof system used.',
      shortName: 'Tech',
      getValue: (project) => (
        <TechnologyCell provider={project.provider}>
          {project.category}
        </TechnologyCell>
      ),
    },
    ...(stagesEnabled
      ? [
          {
            name: 'Stage',
            idHref: 'stage' as const,
            tooltip: 'Rollup stage based on its features and maturity.',
            alignCenter: true as const,
            getValue: (project: ScalingTvlViewEntry) => (
              <StageCell item={project.stage} />
            ),
          },
        ]
      : []),
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this Layer 2.',
      getValue: (project) => project.purpose,
    },
    {
      name: 'Total',
      tooltip: detailedTvlEnabled
        ? 'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.'
        : 'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago. Some project may include natively minted assets.',
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
      headClassName: 'pr-4',
      getValue: (project) =>
        project.tvlBreakdown && (
          <NumberCell className="pr-4">{project.marketShare}</NumberCell>
        ),
    },
  ]

  return columns
}

export function getScalingDetailedTvlColumns() {
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
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'Total',
      tooltip: 'Total = Canonical + External + Native',
      alignCenter: true,
      noPaddingRight: true,
      highlight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.tvl}
          percentChange={project.tvlChange}
        />
      ),
    },
    {
      name: (
        <div className="flex items-center gap-1">
          <CanonicalIcon />
          <span>Canonical</span>
        </div>
      ),
      tooltip:
        'Canonical refers to assets locked in the L2-secured bridge on Ethereum, displayed together with a percentage change compared to 7D ago.',
      alignCenter: true,
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.cbv}
          percentChange={project.cbvChange}
          tokens={project.tokens.filter((t) => t.assetType === 'CBV')}
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
        "External refers to assets obtained on L2 via bridges outside of the L2's security, displayed together with a percentage change compared to 7D ago.",
      alignCenter: true,
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.ebv}
          percentChange={project.ebvChange}
          tokens={project.tokens.filter((t) => t.assetType === 'EBV')}
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
        'Native refers to non-bridged assets minted directly on the given L2, displayed together with a percentage change compared to 7D ago.',
      alignCenter: true,
      noPaddingRight: true,
      getValue: (project) => (
        <ValueWithPercentageCell
          value={project.nmv}
          percentChange={project.nmvChange}
          tokens={project.tokens.filter((t) => t.assetType === 'NMV')}
        />
      ),
    },
  ]

  return columns
}

export function getUpcomingScalingTvlColumns() {
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
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'Technology',
      tooltip:
        'Type of this Layer 2. Determines data availability and proof system used.',
      shortName: 'Tech',
      getValue: (project) => (
        <TechnologyCell provider={project.provider}>
          {project.category}
        </TechnologyCell>
      ),
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this Layer 2.',
      getValue: (project) => project.purpose,
    },
  ]

  return columns
}

export function getArchivedScalingTvlColumns(detailedTvlEnabled: boolean) {
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
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'Risks',
      tooltip: 'Risks associated with this project.',
      minimalWidth: true,
      alignCenter: true,
      getValue: (project) => <RosetteCell riskValues={project.riskValues} />,
    },
    {
      name: 'Technology',
      tooltip:
        'Type of this Layer 2. Determines data availability and proof system used.',
      shortName: 'Tech',
      getValue: (project) => (
        <TechnologyCell provider={project.provider}>
          {project.category}
        </TechnologyCell>
      ),
    },
    {
      name: 'Purpose',
      tooltip: 'Functionality supported by this Layer 2.',
      getValue: (project) => project.purpose,
    },
    {
      name: 'Total',
      tooltip: detailedTvlEnabled
        ? 'Total value locked in escrow contracts on Ethereum displayed together with a percentage changed compared to 7D ago. Some projects may include externally bridged and natively minted assets.'
        : 'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago. Some project may include natively minted assets.',
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

export function getScalingRiskColumns() {
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
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
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
        "Sequencer is an entity responsible for constructing L2 blocks and deciding on the ordering of user's L2 transactions. What happens if it is offline or censors individual user?",
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
    },
    {
      name: 'Proposer failure',
      tooltip:
        'Proposer is an entity responsible for submitting L2 state to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
      getValue: (project) => <RiskCell item={project.proposerFailure} />,
    },
  ]
  return columns
}

export function getScalingActivityColumns() {
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
          <ProjectCell type="layer2" project={project} />
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
