import { assertUnreachable } from '@l2beat/shared-pure'
import { Badge } from '~/app/_components/badge/badge'
import { DetailedOnHover } from '~/app/_components/detailed-on-hover'
import { EM_DASH } from '~/app/_components/nav/consts'
import { Skeleton } from '~/app/_components/skeleton'
import { formatCostValue } from '../_utils/format-cost-value'
import { type CostsData } from './table/columns'

interface Props {
  data: CostsData
  type: 'calldata' | 'blobs' | 'compute' | 'overhead'
}

export function CostsBreakdownValueCell({ data, type }: Props) {
  if (data.type === 'not-available') {
    switch (data.reason) {
      case 'loading':
        return <Skeleton className="ml-auto h-6 w-20" />
      case 'coming-soon':
      case 'no-per-tx-metric':
        return EM_DASH
      default:
        assertUnreachable(data.reason)
    }
  }
  const value = data[type]
  if (!value) return <Badge type="gray">N/A</Badge>

  const formatted = formatCostValue(value, data.unit)

  return <DetailedOnHover value={value}>{formatted}</DetailedOnHover>
}
