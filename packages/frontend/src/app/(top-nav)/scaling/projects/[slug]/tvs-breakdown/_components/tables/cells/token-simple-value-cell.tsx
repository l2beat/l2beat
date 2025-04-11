import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  usdValue: number
}

export function TokenSimpleValueCell({ usdValue }: Props) {
  return (
    <div className="text-xs font-bold">
      ${formatNumberWithCommas(+usdValue)}
    </div>
  )
}
