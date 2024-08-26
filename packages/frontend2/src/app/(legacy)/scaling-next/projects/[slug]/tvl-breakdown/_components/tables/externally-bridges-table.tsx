import { type TvlProjectBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { TableSum } from './table-sum'

interface ExternallyBridgedTableProps {
  tokens: TvlProjectBreakdown['breakdowns'][number]['external']
}

export function ExternallyBridgedTable(props: ExternallyBridgedTableProps) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mb-3 ml-1 mt-12 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Externally Bridged Value
      </h2>

      <TableSum amount={sum} />
    </div>
  )
}
