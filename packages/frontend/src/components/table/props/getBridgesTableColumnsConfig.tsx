import React from 'react'
import { BridgesRiskViewEntry } from '../../../pages/bridges/risk/types'
import { RiskCell } from '../RiskCell'
import { ColumnConfig } from '../types'
import { getProjectWithIndexColumns } from './getProjectWithIndexColumns'
import { getOrderValueBySentiment } from './sorting/getOrderValueBySentiment'

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
      className: 'whitespace-nowrap md:whitespace-normal',
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
      className: 'whitespace-nowrap md:whitespace-normal',
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
