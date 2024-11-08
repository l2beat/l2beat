import { createColumnHelper } from '@tanstack/react-table'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'
import { TokenWithChainLogo } from '../../../_components/token-with-chain-logo'
import { type TokenEntry } from './get-token-entries'
import { pluralize } from '@l2beat/shared-pure'

const columnHelper = createColumnHelper<TokenEntry>()

export const tokenColumns = [
  columnHelper.display({
    id: 'logo',
    cell: ({ row }) => {
      return (
        <TokenWithChainLogo
          token={row.original.token}
          chain={row.original.network}
        />
      )
    },
    meta: {
      headClassName: 'w-0 !pr-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('token.name', {
    header: 'Asset',
    cell: ({ row }) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First>{row.original.token.name}</TwoRowCell.First>
          <TwoRowCell.Second>on {row.original.network.name}</TwoRowCell.Second>
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
            {formatNumberWithCommas(row.original.amount)}{' '}
            {row.original.token.symbol}
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
  columnHelper.accessor('underlyingTokens.count', {
    header: 'Underlying Tokens',
    cell: ({ row }) => {
      if (row.original.underlyingTokens.count === 0) {
        return (
          <TwoRowCell>
            <TwoRowCell.First>None</TwoRowCell.First>
            <TwoRowCell.Second>Native</TwoRowCell.Second>
          </TwoRowCell>
        )
      }

      return (
        <TwoRowCell>
          <TwoRowCell.First>
            {row.original.underlyingTokens.count} underlying
          </TwoRowCell.First>
          <TwoRowCell.Second>
            on {row.original.underlyingTokens.chainCount}{' '}
            {pluralize(row.original.underlyingTokens.chainCount, 'chain')}
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip: 'Underlying Tokens',
    },
  }),
]
