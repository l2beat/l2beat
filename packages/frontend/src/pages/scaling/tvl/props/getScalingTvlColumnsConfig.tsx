import React from 'react'

import { ExcludeAssociatedTokensWrapper } from '../../../../components/ExcludeAssociatedTokensWrapper'
import { TotalValue } from '../../../../components/table/TotalValue'
import { ValueWithPercentageCell } from '../../../../components/table/ValueWithPercentageCell'
import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { ColumnConfig } from '../../../../components/table/types'
import { getColumnHeaderUnderline } from '../../../../utils/table/getColumnHeaderUnderline'
import { ScalingTvlViewEntry } from '../types'

export function getScalingTvlColumnsConfig() {
  const columns: ColumnConfig<ScalingTvlViewEntry>[] = [
    ...getProjectWithIndexColumns({
      showIsL3: true,
      indexAsDefaultSort: false,
    }),
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
            getOrderValue: (project) => ({
              'included-associated-tokens': project.data.tvl.value,
              'excluded-associated-tokens':
                project.data.excludedAssociatedTokens.tvl.value,
            }),
            defaultOrderKey: 'included-associated-tokens',
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
        <ExcludeAssociatedTokensWrapper>
          <ExcludeAssociatedTokensWrapper.Included>
            <ValueWithPercentageCell
              value={project.data.cbv.displayValue}
              percentChange={project.data.cbv.change}
              tokens={project.data.cbv.tokens.filter(
                (t) => t.info.type === 'CBV',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            <ValueWithPercentageCell
              value={project.data.excludedAssociatedTokens.cbv.displayValue}
              percentChange={project.data.excludedAssociatedTokens.cbv.change}
              tokens={project.data.excludedAssociatedTokens.cbv.tokens.filter(
                (t) => t.info.type === 'CBV',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens':
            project.data.cbv.value !== 0 ? project.data.cbv.value : undefined,
          'excluded-associated-tokens':
            project.data.excludedAssociatedTokens.cbv.value !== 0
              ? project.data.excludedAssociatedTokens.cbv.value
              : undefined,
        }),
        defaultOrderKey: 'included-associated-tokens',
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
        <ExcludeAssociatedTokensWrapper>
          <ExcludeAssociatedTokensWrapper.Included>
            <ValueWithPercentageCell
              value={project.data.ebv.displayValue}
              percentChange={project.data.ebv.change}
              tokens={project.data.ebv.tokens.filter(
                (t) => t.info.type === 'EBV',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            <ValueWithPercentageCell
              value={project.data.excludedAssociatedTokens.ebv.displayValue}
              percentChange={project.data.excludedAssociatedTokens.ebv.change}
              tokens={project.data.excludedAssociatedTokens.ebv.tokens.filter(
                (t) => t.info.type === 'EBV',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens':
            project.data.ebv.value !== 0 ? project.data.ebv.value : undefined,
          'excluded-associated-tokens':
            project.data.excludedAssociatedTokens.ebv.value !== 0
              ? project.data.excludedAssociatedTokens.ebv.value
              : undefined,
        }),
        defaultOrderKey: 'included-associated-tokens',
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
        <ExcludeAssociatedTokensWrapper>
          <ExcludeAssociatedTokensWrapper.Included>
            <ValueWithPercentageCell
              value={project.data.nmv.displayValue}
              percentChange={project.data.nmv.change}
              tokens={project.data.nmv.tokens.filter(
                (t) => t.info.type === 'NMV',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            <ValueWithPercentageCell
              value={project.data.excludedAssociatedTokens.nmv.displayValue}
              percentChange={project.data.excludedAssociatedTokens.nmv.change}
              tokens={project.data.excludedAssociatedTokens.nmv.tokens.filter(
                (t) => t.info.type === 'NMV',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens':
            project.data.nmv.value !== 0 ? project.data.nmv.value : undefined,
          'excluded-associated-tokens':
            project.data.excludedAssociatedTokens.nmv.value !== 0
              ? project.data.excludedAssociatedTokens.nmv.value
              : undefined,
        }),
        defaultOrderKey: 'included-associated-tokens',
        rule: 'numeric',
      },
    },
  ]

  return columns
}
