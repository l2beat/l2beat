import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { TotalValue } from '../../../../components/table/TotalValue'
import { ColumnConfig } from '../../../../components/table/types'
import { ValueWithPercentageCell } from '../../../../components/table/ValueWithPercentageCell'
import { getColumnHeaderUnderline } from '../../../../utils/table/getColumnHeaderUnderline'
import { ScalingTvlViewEntry } from '../types'

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
      tooltip:
        'These tokens use L1 Ethereum as their main ledger and are bridged to L2 via a canonical bridge locking tokens in L1 escrow and minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      align: 'center',
      noPaddingRight: true,
      headClassName: getColumnHeaderUnderline('before:bg-purple-100'),
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
      tooltip:
        'These tokens use some external blockchain as their main ledger and are bridged to L2 via a non-canonical bridge. Tokens are locked on their native ledger and the bridge is minting on L2 an IOU representation of that token. The value is displayed together with a percentage change compared to 7D ago.',
      align: 'center',
      noPaddingRight: true,
      headClassName: getColumnHeaderUnderline('before:bg-yellow-200'),
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
      tooltip:
        'These tokens are using L2 as their ledger and are minted directly on L2. Note that for some tokens (omnichain tokens) their ledger is distributed across many blockchains and they can be moved to L2 via a burn-mint bridge. The value is displayed together with a percentage change compared to 7D ago.',
      align: 'center',
      noPaddingRight: true,
      headClassName: getColumnHeaderUnderline('before:bg-pink-100'),
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
