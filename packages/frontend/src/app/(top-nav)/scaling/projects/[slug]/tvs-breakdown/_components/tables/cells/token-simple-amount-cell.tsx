import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  amount: number
}

export function TokenSimpleAmountCell({ amount }: Props) {
  return (
    <div className="text-xs font-medium">{formatNumberWithCommas(+amount)}</div>
  )
}
