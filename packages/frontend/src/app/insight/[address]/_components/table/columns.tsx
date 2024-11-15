import { pluralize } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { uniq } from 'lodash'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import { getFirstTwoNonZeroPrecision } from '~/utils/get-first-two-non-zero-precision'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'
import { TokenWithChainLogo } from '../../../_components/token-with-chain-logo'
import { type TokenEntry } from './get-token-entries'

const columnHelper = createColumnHelper<TokenEntry>()

export const tokenColumns = [
  columnHelper.display({
    id: 'logo',
    cell: ({ row }) => {
      return (
        <TokenWithChainLogo
          token={{ symbol: row.original.symbol, logoUrl: row.original.logoUrl }}
          chain={row.original.chain}
        />
      )
    },
    meta: {
      headClassName: 'w-0 !pr-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    header: 'Asset',
    cell: ({ row }) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First>{row.original.name}</TwoRowCell.First>
          <TwoRowCell.Second>on {row.original.chain.name}</TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip: 'Asset',
    },
  }),
  columnHelper.accessor('usdValue', {
    id: 'value',
    header: 'Value',
    cell: ({ row }) => {
      return (
        <TwoRowCell className="text-right">
          <TwoRowCell.First className="font-oswald !text-lg font-semibold text-[#D1FF1A]">
            ${formatNumberWithCommas(row.original.usdValue)}
          </TwoRowCell.First>
          <TwoRowCell.Second>
            {row.original.amount < 1
              ? formatNumberWithCommas(
                  row.original.amount,
                  getFirstTwoNonZeroPrecision(row.original.amount),
                )
              : formatNumberWithCommas(row.original.amount)}{' '}
            {row.original.symbol}
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip: 'Value',
      align: 'right',
    },
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    meta: {
      tooltip: 'Type',
    },
  }),
  columnHelper.accessor('managedBy', {
    header: 'Managed by',
    meta: {
      tooltip: 'Managed by',
    },
  }),
  columnHelper.accessor((row) => row.underlyingTokens.length, {
    id: 'underlyingTokens',
    header: 'Underlying Tokens',
    cell: ({ row }) => {
      if (row.original.underlyingTokens.length === 0) {
        return (
          <TwoRowCell>
            <TwoRowCell.First>None</TwoRowCell.First>
          </TwoRowCell>
        )
      }
      const chainCount = uniq(
        row.original.underlyingTokens.map((token) => token.chain.id),
      ).length
      return (
        <TwoRowCell>
          <TwoRowCell.First>
            {row.original.underlyingTokens.length} tokens
          </TwoRowCell.First>
          <TwoRowCell.Second>
            on {chainCount} {pluralize(chainCount, 'chain')}
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip: 'Underlying Tokens',
    },
  }),
  columnHelper.display({
    id: 'expander',
    cell: ({ row }) => {
      if (!row.getCanExpand()) {
        return null
      }

      return (
        <button onClick={row.getToggleExpandedHandler()}>
          <ChevronIcon
            className={cn(
              'fill-[#CA80EC] transition-transform duration-200',
              row.getIsExpanded() && 'rotate-180',
            )}
          />
        </button>
      )
    },
  }),
]
