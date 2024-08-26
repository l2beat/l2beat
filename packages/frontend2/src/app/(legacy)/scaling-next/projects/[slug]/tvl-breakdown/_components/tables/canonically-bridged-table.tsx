import { type TvlProjectBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { TableSum } from './table-sum'

interface CanonicallyBridgedTableProps {
  tokens: TvlProjectBreakdown['breakdowns'][number]['canonical']
}

export function CanonicallyBridgedTable(props: CanonicallyBridgedTableProps) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mb-3 ml-1 mt-12 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Canonically Bridged Value
      </h2>

      <TableSum amount={sum} />
    </div>
  )
}
