import { createColumnHelper } from '@tanstack/react-table'
import { useSelectedTokenContext } from '~/components/chart/tvs/token/SelectedTokenContext'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PercentChange } from '~/components/PercentChange'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { IndexCell } from '~/components/table/cells/IndexCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { EM_DASH } from '~/consts/characters'
import { ChevronIcon } from '~/icons/Chevron'
import { LineChartIcon } from '~/icons/LineChart'
import { sourceToLabel } from '~/server/features/scaling/tvs/utils/sourceToLabel'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'
import { categoryToLabel } from './categoryToLabel'
import { BridgedUsingCell } from './cells/BridgedUsingCell'
import { TokenAddressCell } from './cells/TokenAddressCell'
import { TokenNameCell } from './cells/TokenNameCell'
import type { TokenRow } from './ProjectTvsBreakdownTokenTable'

const columnHelper = createColumnHelper<TokenRow>()
export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    sortDescFirst: false,
    meta: {
      headClassName: 'w-0',
    },
    size: 44,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => {
      return (
        <img
          width={24}
          height={24}
          src={ctx.row.original.iconUrl}
          className="size-6 min-w-6 rounded-full"
          alt={`Icon of ${ctx.row.original.name}`}
        />
      )
    },
    size: 36,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:pr-1.5! w-[30px]',
    },
  }),
  columnHelper.display({
    id: 'token',
    header: 'Token',
    cell: (ctx) => {
      return <TokenNameCell {...ctx.row.original} />
    },
  }),
  columnHelper.display({
    id: 'bridgingType',
    header: 'Bridging Type',
    cell: (ctx) => {
      return (
        <TwoRowCell>
          <TwoRowCell.First>
            {sourceToLabel(ctx.row.original.source)}
          </TwoRowCell.First>
          <TwoRowCell.Second>
            <BridgedUsingCell {...ctx.row.original} />
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
  }),
  columnHelper.display({
    id: 'category',
    header: 'Category',
    cell: (ctx) => (
      <div className="font-medium text-xs">
        {categoryToLabel(ctx.row.original.category)}
      </div>
    ),
  }),
  columnHelper.display({
    id: 'contract',
    header: 'Token Contract',
    cell: (ctx) => {
      const { address } = ctx.row.original
      if (!address) return <div className="font-medium text-xs">Native</div>

      if (address === 'multiple')
        return <div className="font-medium text-xs">Multiple</div>

      return <TokenAddressCell {...address} />
    },
  }),
  columnHelper.accessor((row) => row.priceUsd.value, {
    id: 'priceUsd',
    header: 'Price',
    meta: {
      align: 'right',
    },
    cell: (ctx) => {
      const { priceUsd } = ctx.row.original
      return (
        <div className="flex items-center justify-end gap-1">
          <div className="font-medium text-xs">
            {formatCurrency(priceUsd.value, 'usd')}
          </div>
          {priceUsd.change !== undefined ? (
            <PercentChange
              value={priceUsd.change}
              period={priceUsd.changePeriod}
            />
          ) : (
            <PercentChangeNotAvailable />
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.valueForProject.value, {
    id: 'value',
    header: 'TVS-Adjusted Value',
    meta: {
      align: 'right',
      tooltip:
        'The value is calculated by multiplying the amount by the token price for most tokens. For some tokens, we use custom calculations to avoid double counting. Percentage change compared to 7 days ago. Expand the section to learn more.',
    },
    cell: (ctx) => {
      return <ProjectTokenValueCell row={ctx.row.original} />
    },
  }),
  columnHelper.display({
    id: 'actions',
    meta: {
      align: 'right',
    },
    cell: (ctx) => {
      const { setSelectedToken } = useSelectedTokenContext()
      const isExpended = ctx.row.getIsExpanded()
      const toggleExpandedHandler = ctx.row.getToggleExpandedHandler()

      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild disabledOnMobile>
              <button onClick={() => setSelectedToken(ctx.row.original)}>
                <a href="#token-chart">
                  <LineChartIcon className="size-4" />
                </a>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Click to preview historical chart for this token
            </TooltipContent>
          </Tooltip>
          <button
            onClick={toggleExpandedHandler}
            className="h-full cursor-pointer p-1 align-middle"
          >
            <ChevronIcon
              className={cn(
                'size-3 transition-transform duration-300',
                isExpended && 'rotate-180',
              )}
            />
          </button>
        </div>
      )
    },
  }),
]

function PercentChangeNotAvailable() {
  return (
    <span className="inline-block w-[52px] text-right text-secondary text-xs">
      {EM_DASH}
    </span>
  )
}

function ProjectTokenValueCell({ row }: { row: TokenRow }) {
  return (
    <SyncStatusWrapper isSynced={row.syncStatus === undefined}>
      <div className="flex items-center justify-end gap-1">
        <div className="font-bold text-xs">
          ${formatNumberWithCommas(+row.valueForProject.value)}
        </div>
        {row.valueForProject.change !== undefined ? (
          <PercentChange
            value={row.valueForProject.change}
            period={row.valueForProject.changePeriod}
          />
        ) : (
          <PercentChangeNotAvailable />
        )}
      </div>
    </SyncStatusWrapper>
  )
}
