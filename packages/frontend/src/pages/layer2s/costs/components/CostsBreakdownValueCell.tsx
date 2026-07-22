import { assertUnreachable } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { Skeleton } from '~/components/core/Skeleton'
import { DetailedOnHover } from '~/components/DetailedOnHover'
import { formatCostValue } from '../utils/formatCostValue'
import { useCostsMetricContext } from './CostsMetricContext'
import { useCostsUnitContext } from './CostsUnitContext'
import type { CostsData } from './table/columns'

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
      case 'no-data':
        return <NoDataBadge />
      default:
        assertUnreachable(data.reason)
    }
  }
  const value = data[type]
  if (value === null) return <NotApplicableBadge />

  const formatted = formatCostValue(value, unit, metric)

  return <DetailedOnHover value={value}>{formatted}</DetailedOnHover>
}
