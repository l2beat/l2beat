import React from 'react'

import { BridgesRiskViewEntry } from '../../../pages/bridges-risk/types'
import { BridgesTvlViewEntry } from '../../../pages/bridges-tvl/types'
import { TVLBreakdown } from '../../TVLBreakdown'
import { IndexCell } from '../IndexCell'
import { NumberCell } from '../NumberCell'
import { ProjectCell } from '../ProjectCell'
import { RiskCell } from '../RiskCell'
import { ColumnConfig } from '../TableView'
import { TechnologyCell } from '../TechnologyCell'

export function getArchivedBridgesTvlColumns() {
  const columns: ColumnConfig<BridgesTvlViewEntry>[] = [
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
      getValue: (entry) => (
        <ProjectCell highlightL2 type={entry.type} project={entry} />
      ),
    },
    {
      name: 'TVL',
      tooltip:
        'Total value locked in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago.',
      alignRight: true,
      getValue: (entry) =>
        !entry.isUpcoming &&
        entry.tvlBreakdown && <NumberCell>{entry.tvl}</NumberCell>,
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      getValue: (entry) => <RiskCell item={entry.validatedBy} />,
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      getValue: (entry) => <TechnologyCell>{entry.category}</TechnologyCell>,
    },
  ]

  return columns
}

export function getActiveBridgesTvlColumns() {
  const columns = getArchivedBridgesTvlColumns()

  columns.splice(
    3,
    0,
    {
      name: '7d Change',
      tooltip: 'Change in the total value locked as compared to a week ago.',
      alignRight: true,
      getValue: (entry) =>
        entry.tvlBreakdown && (
          <NumberCell signed>{entry.sevenDayChange}</NumberCell>
        ),
    },
    {
      name: 'Breakdown',
      tooltip:
        'Composition of the total value locked broken down by token type.',
      getValue: (entry) =>
        entry.tvlBreakdown && <TVLBreakdown {...entry.tvlBreakdown} />,
    },
    {
      name: 'Mkt share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      getValue: (entry) =>
        entry.tvlBreakdown && (
          <NumberCell>
            <span data-bridges-only-cell>{entry.bridgesMarketShare}</span>
            <span data-combined-only-cell className="hidden">
              {entry.combinedMarketShare}
            </span>
          </NumberCell>
        ),
    },
  )

  return columns
}

export function getCanonicalBridgesTvlColumns() {
  return getActiveBridgesTvlColumns()
}

export function getBridgesRiskColumns() {
  const columns: ColumnConfig<BridgesRiskViewEntry>[] = [
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
      getValue: (entry) => (
        <ProjectCell highlightL2 type={entry.type} project={entry} />
      ),
    },
    {
      name: 'Destination',
      tooltip: 'What chains can you get to using this bridge?',
      noHrefMobile: true,
      getValue: (entry) => <RiskCell item={entry.destination} />,
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      noHrefMobile: true,
      getValue: (entry) => <RiskCell item={entry.validatedBy} />,
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      noHrefMobile: true,
      getValue: (entry) => (
        <span className="sm:text-xs md:text-base">{entry.category}</span>
      ),
    },
    {
      name: 'Source\nUpgradeability',
      tooltip:
        'Are the Ethereum contracts upgradeable? Note that the delay itself might not be enough to ensure that users can withdraw their funds in the case of a malicious and censoring operator.',
      noHrefMobile: true,
      getValue: (entry) => <RiskCell item={entry.sourceUpgradeability} />,
    },
    {
      name: 'Destination\nToken',
      tooltip: 'What is the token that you receive from this bridge?',
      noHrefMobile: true,
      getValue: (entry) => <RiskCell item={entry.destinationToken} />,
    },
  ]

  return columns
}
