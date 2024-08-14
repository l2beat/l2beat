import { assertUnreachable } from '@l2beat/shared-pure'
import { Badge } from '~/app/_components/badge/badge'
import { DetailedOnHover } from '~/app/_components/detailed-on-hover'
import { Skeleton } from '~/app/_components/skeleton'
import { EM_DASH } from '~/consts/characters'
import { formatCostValue } from '../_utils/format-cost-value'
import { useCostsMetricContext } from './costs-metric-context'
import { useCostsUnitContext } from './costs-unit-context'
import { type CostsData } from './table/columns'

interface Props {
  data: CostsData
  type: 'calldata' | 'blobs' | 'compute' | 'overhead'
}

export function CostsBreakdownValueCell({ data, type }: Props) {
  const { metric } = useCostsMetricContext()
  const { unit } = useCostsUnitContext()

  if (data.type === 'not-available') {
    switch (data.reason) {
      case 'loading':
        return <Skeleton className="ml-auto h-6 w-20" />
      case 'coming-soon':
      case 'no-per-tx-metric':
      case 'no-data':
        return EM_DASH
      default:
        assertUnreachable(data.reason)
    }
  }
  const value = data[type]
  if (!value) return <Badge type="gray">N/A</Badge>

  const formatted = formatCostValue(value, unit, metric)

  return <DetailedOnHover value={value}>{formatted}</DetailedOnHover>
}
