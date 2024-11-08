import { createColumnHelper } from '@tanstack/react-table'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'
import { CriticalBadgeIcon } from '../../_assets/critical-badge'
import { WarningBadgeIcon } from '../../_assets/warning-badge'
import { TokenWithChainLogo } from './token-with-chain-logo'

export interface TokenEntry {
  symbol: string
  logoUrl: string
  chainName: string
  chainLogoUrl: string
  value: number
  balance: number
  type: string
  managedBy: string
  underlyingTokens: Omit<TokenEntry, 'underlyingTokens'>[]
  criticalWarnings: string[]
  warnings: string[]
}
const columnHelper = createColumnHelper<TokenEntry>()

export const tokenColumns = [
  columnHelper.display({
    id: 'logo',
    cell: ({ row }) => {
      return (
        <TokenWithChainLogo
          token={{
            logoUrl: row.original.logoUrl,
            symbol: row.original.symbol,
          }}
          chain={{
            logoUrl: row.original.chainLogoUrl,
            name: row.original.chainName,
          }}
        />
      )
    },
    meta: {
      headClassName: 'w-0 !pr-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('symbol', {
    header: 'Asset',
    cell: ({ row }) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First>{row.original.symbol}</TwoRowCell.First>
          <TwoRowCell.Second>on {row.original.chainName}</TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip: 'Asset',
    },
  }),
  columnHelper.accessor('value', {
    id: 'value',
    header: 'Value',
    cell: ({ row }) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First className="font-oswald !text-lg font-semibold text-[#D1FF1A]">
            ${formatNumberWithCommas(row.original.value)}
          </TwoRowCell.First>
          <TwoRowCell.Second>
            {formatNumberWithCommas(row.original.balance)}
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip: 'Value',
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
  columnHelper.accessor('underlyingTokens', {
    header: 'Underlying Tokens',
    cell: ({ row }) => {
      return `${row.original.underlyingTokens.length} underlying`
    },
    meta: {
      tooltip: 'Underlying Tokens',
    },
  }),
  columnHelper.display({
    id: 'warnings',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          {!!row.original.criticalWarnings.length && <CriticalBadgeIcon />}
          {!!row.original.warnings.length && <WarningBadgeIcon />}
        </div>
      )
    },
  }),
]
