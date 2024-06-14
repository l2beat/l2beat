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
              value={project.data.canonical.displayValue}
              percentChange={project.data.canonical.change}
              tokens={project.data.canonical.tokens.filter(
                (t) => t.info.type === 'canonical',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            <ValueWithPercentageCell
              value={
                project.data.excludedAssociatedTokens.canonical.displayValue
              }
              percentChange={
                project.data.excludedAssociatedTokens.canonical.change
              }
              tokens={project.data.excludedAssociatedTokens.canonical.tokens.filter(
                (t) => t.info.type === 'canonical',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens':
            project.data.canonical.value !== 0
              ? project.data.canonical.value
              : undefined,
          'excluded-associated-tokens':
            project.data.excludedAssociatedTokens.canonical.value !== 0
              ? project.data.excludedAssociatedTokens.canonical.value
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
              value={project.data.external.displayValue}
              percentChange={project.data.external.change}
              tokens={project.data.external.tokens.filter(
                (t) => t.info.type === 'external',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            <ValueWithPercentageCell
              value={
                project.data.excludedAssociatedTokens.external.displayValue
              }
              percentChange={
                project.data.excludedAssociatedTokens.external.change
              }
              tokens={project.data.excludedAssociatedTokens.external.tokens.filter(
                (t) => t.info.type === 'external',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens':
            project.data.external.value !== 0
              ? project.data.external.value
              : undefined,
          'excluded-associated-tokens':
            project.data.excludedAssociatedTokens.external.value !== 0
              ? project.data.excludedAssociatedTokens.external.value
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
              value={project.data.native.displayValue}
              percentChange={project.data.native.change}
              tokens={project.data.native.tokens.filter(
                (t) => t.info.type === 'native',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Included>
          <ExcludeAssociatedTokensWrapper.Excluded>
            <ValueWithPercentageCell
              value={project.data.excludedAssociatedTokens.native.displayValue}
              percentChange={
                project.data.excludedAssociatedTokens.native.change
              }
              tokens={project.data.excludedAssociatedTokens.native.tokens.filter(
                (t) => t.info.type === 'native',
              )}
            />
          </ExcludeAssociatedTokensWrapper.Excluded>
        </ExcludeAssociatedTokensWrapper>
      ),
      sorting: {
        getOrderValue: (project) => ({
          'included-associated-tokens':
            project.data.native.value !== 0
              ? project.data.native.value
              : undefined,
          'excluded-associated-tokens':
            project.data.excludedAssociatedTokens.native.value !== 0
              ? project.data.excludedAssociatedTokens.native.value
              : undefined,
        }),
        defaultOrderKey: 'included-associated-tokens',
        rule: 'numeric',
      },
    },
  ]

  return columns
}
