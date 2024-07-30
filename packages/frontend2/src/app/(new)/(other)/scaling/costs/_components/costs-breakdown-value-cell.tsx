import { type CostsUnit } from '~/server/features/scaling/get-scaling-costs-entries'
import { formatCostValue } from '../_utils/format-cost-value'
import { DetailedOnHover } from '~/app/_components/detailed-on-hover'

interface Props {
  value: number
  unit: CostsUnit
}

export function CostsBreakdownValueCell({ value, unit }: Props) {
  const formatted = formatCostValue(value, unit)

  return <DetailedOnHover value={value}>{formatted}</DetailedOnHover>
}
