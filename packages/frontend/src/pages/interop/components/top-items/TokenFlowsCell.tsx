import { ArrowRightIcon } from '~/icons/ArrowRight'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export type TokenFlowDisplayData = {
  srcChain: {
    id: string
    iconUrl: string | undefined
  }
  dstChain: {
    id: string
    iconUrl: string | undefined
  }
  volume: number
}

export function TokenFlowsCell({ flows }: { flows: TokenFlowDisplayData[] }) {
  return (
    <div className="flex min-w-[120px] flex-col items-start gap-1 max-md:py-1">
      {flows.map((flow) => {
        return (
          <div
            key={`${flow.srcChain.id}-${flow.dstChain.id}`}
            className="flex items-center gap-1"
          >
            {flow.srcChain.iconUrl ? (
              <img
                src={flow.srcChain.iconUrl}
                alt={flow.srcChain.id}
                className="size-4"
              />
            ) : (
              <span className="text-secondary">{flow.srcChain.id}</span>
            )}
            <ArrowRightIcon className="size-4 min-w-4 fill-brand" />
            {flow.dstChain.iconUrl ? (
              <img
                src={flow.dstChain.iconUrl}
                alt={flow.dstChain.id}
                className="size-4"
              />
            ) : (
              <span className="text-secondary">{flow.dstChain.id}</span>
            )}
            <span className="ml-0.5 font-medium text-label-value-13">
              {formatCurrency(flow.volume, 'usd')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
