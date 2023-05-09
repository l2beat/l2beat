import React from 'react'
import { BridgesTvlViewEntry } from '../../../pages/bridges-tvl/BridgesTvlView'
import { TVLBreakdown } from '../../TVLBreakdown'
import { IndexCell } from '../IndexCell'
import { NoInfoCell } from '../NoInfoCell'
import { NumberCell } from '../NumberCell'
import { ProjectCell } from '../ProjectCell'
import { RiskCell } from '../RiskCell'
import { ColumnConfig } from '../TableView'
import { TechnologyCell } from '../TechnologyCell'

export function getBridgesTableColumns(
  tab: 'active' | 'canonical-bridges' | 'archived',
) {
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
      tooltip: 'Total value locked in escrow contracts on Ethereum.',
      alignRight: true,
      getValue: (entry) =>
        !entry.isUpcoming &&
        entry.tvlBreakdown && <NumberCell>{entry.tvl}</NumberCell>,
    },
    {
      name: 'Validated by',
      tooltip: 'How are the messages sent via this bridge checked?',
      getValue: (entry) =>
        entry.validatedBy ? (
          <RiskCell item={entry.validatedBy} />
        ) : (
          <NoInfoCell />
        ),
    },
    {
      name: 'Type',
      tooltip:
        'Token bridges use escrows and mint tokens. Liquidity Networks use pools and swap tokens. Hybrid do both.',
      getValue: (entry) => <TechnologyCell>{entry.category}</TechnologyCell>,
    },
  ]
  if (tab === 'active' || tab === 'canonical-bridges') {
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

  if (tab === 'archived') {
    return columns
  }
  throw new Error(`Unknown tab: ${tab}`)
}
