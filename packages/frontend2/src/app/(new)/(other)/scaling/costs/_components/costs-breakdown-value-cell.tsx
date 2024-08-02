import { Badge } from '~/app/_components/badge/badge'
import { DetailedOnHover } from '~/app/_components/detailed-on-hover'
import { type CostsUnit } from '~/server/features/scaling/get-scaling-costs-entries'
import { formatCostValue } from '../_utils/format-cost-value'

interface Props {
  value: number | undefined
  unit: CostsUnit
}

export function CostsBreakdownValueCell({ value, unit }: Props) {
  if (!value) return <Badge type="gray">N/A</Badge>

  const formatted = formatCostValue(value, unit)

  return <DetailedOnHover value={value}>{formatted}</DetailedOnHover>
}
