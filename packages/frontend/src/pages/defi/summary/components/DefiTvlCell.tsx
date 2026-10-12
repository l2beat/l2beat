import { formatCurrency } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'

/** The TVL of a DeFi table row, with its external data source on hover. */
export function DefiTvlCell({
  value,
  dataSource,
}: {
  value: number | undefined
  /** External provider name, undefined when the TVL comes from L2BEAT. */
  dataSource: string | undefined
}) {
  if (value === undefined) {
    return <NoDataBadge />
  }

  const formatted = (
    <span className="font-medium text-sm">{formatCurrency(value, 'usd')}</span>
  )
  if (!dataSource) {
    return formatted
  }

  return (
    <Tooltip contentInHtml>
      <TooltipTrigger>{formatted}</TooltipTrigger>
      <TooltipContent>Data source: {dataSource}</TooltipContent>
    </Tooltip>
  )
}
