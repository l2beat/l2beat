import { ProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { getRowVerificationClassNames } from '../../components/table/getRowVerificationClassNames'
import { ProjectCell } from '../../components/table/ProjectCell'
import { RiskCell } from '../../components/table/RiskCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../components/table/TableView'
import { UnverifiedWarning } from '../../components/table/UnverifiedWarning'

export interface BridgesRiskViewProps {
  items: BridgesRiskViewEntry[]
}

export interface BridgesRiskViewEntry {
  name: string
  slug: string
  type: 'layer2' | 'bridge'
  warning?: string
  isVerified?: boolean
  category: string
  destination: ProjectRiskViewEntry
  validatedBy?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}

export function BridgesRiskView({ items }: BridgesRiskViewProps) {
  const onlyBridges = items.filter((x) => x.type === 'bridge')

  const columns: ColumnConfig<BridgesRiskViewEntry>[] = [
    {
      name: '#',
      alignRight: true,
      minimalWidth: true,
      getValue: (entry, index) => (
        <>
          <span data-bridges-only>
            {entry.isVerified === false ? (
              <UnverifiedWarning message="This project includes unverified contracts" />
            ) : (
              onlyBridges.indexOf(entry) + 1
            )}
          </span>
          <span data-combined-only className="hidden">
            {entry.isVerified === false ? (
              <UnverifiedWarning message="This project includes unverified contracts" />
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
      name: 'Destination',
      tooltip: 'What chains can you get to using this bridge?',
      getValue: (entry) => <RiskCell item={entry.destination} />,
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
      getValue: (entry) => (
        <span className="sm:text-xs md:text-base">{entry.category}</span>
      ),
    },
    {
      name: 'Source\nUpgradeability',
      tooltip: 'Are the Ethereum contracts upgradeable?',
      getValue: (entry) => <RiskCell item={entry.sourceUpgradeability} />,
    },
    {
      name: 'Destination\nToken',
      tooltip: 'What is the token that you receive from this bridge?',
      getValue: (entry) => <RiskCell item={entry.destinationToken} />,
    },
  ]

  const rows: RowConfig<BridgesRiskViewEntry> = {
    getProps: (entry) => {
      const result: Record<string, string | boolean> = {
        className: '',
      }

      if (entry.isVerified === false) {
        result.className += getRowVerificationClassNames(entry)
      }

      if (entry.type !== 'bridge') {
        result.className += cx('hidden')
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
