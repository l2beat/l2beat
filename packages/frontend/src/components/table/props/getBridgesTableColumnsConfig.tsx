import React from 'react'
import { BridgesRiskViewEntry } from '../../../pages/bridges/risk/types'
import { BridgesSummaryViewEntry } from '../../../pages/bridges/summary/types'
import { WarningBar } from '../../WarningBar'
import { TokenBreakdown } from '../../breakdown/TokenBreakdown'
import { RoundedWarningIcon } from '../../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'
import { NumberCell } from '../NumberCell'
import { RiskCell } from '../RiskCell'
import { TypeCell } from '../TypeCell'
import { ColumnConfig } from '../types'
import { getProjectWithIndexColumns } from './getProjectWithIndexColumns'
import { getOrderValueBySentiment } from './sorting/getOrderValueBySentiment'

export function getArchivedBridgesSummaryColumnsConfig() {
  const columns: ColumnConfig<BridgesSummaryViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Total',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago.',
      align: 'right',
      getValue: (entry) =>
        !entry.isUpcoming &&
        entry.tvlBreakdown && (
          <NumberCell>{entry.tvl?.displayValue}</NumberCell>
        ),
      sorting: {
        getOrderValue: (project) => project.tvl?.value,
        rule: 'numeric',
        defaultState: 'desc',
      },
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      getValue: (entry) => <RiskCell item={entry.validatedBy} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.validatedBy),
        rule: 'numeric',
      },
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      getValue: (entry) => <TypeCell>{entry.category}</TypeCell>,
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
  ]

  return columns
}

export function getActiveBridgesSummaryColumnsConfig() {
  const columns = getArchivedBridgesSummaryColumnsConfig()

  columns.splice(
    4,
    0,
    {
      name: '7d Change',
      tooltip: 'Change in the total value locked as compared to a week ago.',
      className: 'hidden 2xl:table-cell',
      align: 'right',
      getValue: (entry) =>
        entry.tvlBreakdown && (
          <NumberCell signed>{entry.sevenDayChange}</NumberCell>
        ),
      sorting: {
        getOrderValue: (project) => project.sevenDayChange,
        rule: 'numeric',
      },
    },
    {
      name: 'Tokens',
      tooltip:
        'Composition of the total value locked broken down by token type.',
      className: 'hidden 2xl:table-cell',
      getValue: (entry) =>
        entry.tvlBreakdown && (
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1">
              <TokenBreakdown {...entry.tvlBreakdown} className="opacity-80" />
              {entry.tvlBreakdown.warning && (
                <RoundedWarningIcon
                  sentiment={entry.tvlBreakdown.warningSeverity}
                />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {entry.tvlBreakdown.label}
              {entry.tvlBreakdown.warning && (
                <WarningBar
                  className="mt-2"
                  text={entry.tvlBreakdown.warning}
                  icon={RoundedWarningIcon}
                  ignoreMarkdown
                  color={
                    entry.tvlBreakdown.warningSeverity === 'warning'
                      ? 'yellow'
                      : 'red'
                  }
                />
              )}
            </TooltipContent>
          </Tooltip>
        ),
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      align: 'right',
      getValue: (entry) =>
        entry.tvlBreakdown && (
          <NumberCell>
            <span data-bridges-only-cell>{entry.bridgesMarketShare}</span>
            <span data-combined-only-cell className="hidden">
              {entry.combinedMarketShare?.displayValue}
            </span>
          </NumberCell>
        ),
      sorting: {
        getOrderValue: (project) => project.combinedMarketShare?.value,
        rule: 'numeric',
      },
    },
  )

  return columns
}

export function getBridgesRiskColumnsConfig() {
  const columns: ColumnConfig<BridgesRiskViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Destination',
      tooltip: 'What chains can you get to using this bridge?',
      getValue: (entry) => <RiskCell item={entry.destination} />,
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      className: 'whitespace-normal',
      getValue: (entry) => <RiskCell item={entry.validatedBy} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.validatedBy),
        rule: 'numeric',
      },
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      getValue: (entry) => (
        <span className="md:text-base sm:text-xs">{entry.category}</span>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'Source\nUpgradeability',
      tooltip:
        'Are the Ethereum contracts upgradeable? Note that the delay itself might not be enough to ensure that users can withdraw their funds in the case of a malicious and censoring operator.',
      getValue: (entry) => <RiskCell item={entry.sourceUpgradeability} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.sourceUpgradeability),
        rule: 'numeric',
      },
    },
    {
      name: 'Destination\nToken',
      className: 'whitespace-normal',
      tooltip: 'What is the token that you receive from this bridge?',
      getValue: (entry) => <RiskCell item={entry.destinationToken} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.destinationToken),
        rule: 'numeric',
      },
    },
  ]

  return columns
}
