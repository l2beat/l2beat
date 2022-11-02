import { ProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { NoInfoCell } from '../../components/table/NoInfoCell'
import { NumberCell } from '../../components/table/NumberCell'
import { ProjectCell } from '../../components/table/ProjectCell'
import { RiskCell } from '../../components/table/RiskCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../components/table/TableView'
import { TechnologyCell } from '../../components/table/TechnologyCell'
import { UnverifiedWarning } from '../../components/table/UnverifiedWarning'
import { TVLBreakdown, TVLBreakdownProps } from '../../components/TVLBreakdown'
import {
  UNVERIFIED_DARK_CX,
  UNVERIFIED_LIGHT_CX,
} from '../scaling-tvl/view/ScalingTvlView'

export interface BridgesTvlViewProps {
  items: BridgesTvlViewEntry[]
}

export interface BridgesTvlViewEntry {
  type: 'bridge' | 'layer2'
  name: string
  slug: string
  warning?: string
  verificationStatus: boolean
  tvl: string
  tvlBreakdown: TVLBreakdownProps
  oneDayChange: string
  sevenDayChange: string
  bridgesMarketShare: string
  combinedMarketShare: string
  validatedBy?: ProjectRiskViewEntry
  category: string
}

export function BridgesTvlView({ items }: BridgesTvlViewProps) {
  const onlyBridges = items.filter((x) => x.type === 'bridge')

  const columns: ColumnConfig<BridgesTvlViewEntry>[] = [
    {
      name: '#',
      alignRight: true,
      minimalWidth: true,
      getValue: (entry, index) => (
        <>
          <span data-bridges-only>
            {entry.verificationStatus === false ? (
              <div className="">
                <UnverifiedWarning message="This project includes unverified contracts" />
              </div>
            ) : (
              onlyBridges.indexOf(entry) + 1
            )}
          </span>
          <span data-combined-only className="hidden">
            {entry.verificationStatus === false ? (
              <div className="">
                <UnverifiedWarning message="This project includes unverified contracts" />
              </div>
            ) : (
              index + 1
            )}
          </span>
        </>
      ),
    },
    {
      name: 'Name',
      getValue: (entry) => (
        <ProjectCell highlightL2 type={entry.type} project={entry} />
      ),
    },
    {
      name: 'TVL',
      tooltip: 'Total value locked in escrow contracts on Ethereum.',
      alignRight: true,
      getValue: (entry) => <NumberCell>{entry.tvl}</NumberCell>,
    },
    {
      name: 'Breakdown',
      tooltip:
        'Composition of the total value locked broken down by token type.',
      getValue: (entry) => <TVLBreakdown {...entry.tvlBreakdown} />,
    },
    {
      name: '7d Change',
      tooltip: 'Change in the total value locked as compared to a week ago.',
      alignRight: true,
      getValue: (entry) => (
        <NumberCell signed>{entry.sevenDayChange}</NumberCell>
      ),
    },
    {
      name: 'Market share',
      tooltip: 'Share of the sum of total value locked of all projects.',
      alignRight: true,
      getValue: (entry) => (
        <NumberCell>
          <span data-bridges-only>{entry.bridgesMarketShare}</span>
          <span data-combined-only className="hidden">
            {entry.combinedMarketShare}
          </span>
        </NumberCell>
      ),
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

  const rows: RowConfig<BridgesTvlViewEntry> = {
    getProps: (entry) => {
      const result: Record<string, string | boolean> = {
        className: '',
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
      if (entry.verificationStatus === false) {
        result.className += cx(UNVERIFIED_LIGHT_CX, UNVERIFIED_DARK_CX)
      }

      if (entry.type !== 'bridge') {
        result.className += cx(result.className, 'hidden')
        result['data-combined-only'] = true
      }

      return result
    },
  }

  return (
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} rows={rows} />
    </section>
  )
}
