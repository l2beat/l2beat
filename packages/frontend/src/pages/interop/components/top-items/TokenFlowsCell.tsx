import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { TokenFlowData } from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { InteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function TokenFlowsCell({
  netFlows,
  selectedChains,
}: {
  netFlows: TokenFlowData[]
  selectedChains: InteropSelectedChains | undefined
}) {
  const selectedChainsById = new Map(
    [selectedChains?.first, selectedChains?.second]
      .filter(
        (chain): chain is NonNullable<InteropSelectedChains['first']> =>
          chain !== null && chain !== undefined,
      )
      .map((chain) => [chain.id, chain]),
  )

  return (
    <div className="flex flex-col items-end gap-1">
      {netFlows.map((flow) => {
        const srcChain = selectedChainsById.get(flow.srcChain)
        const dstChain = selectedChainsById.get(flow.dstChain)

        return (
          <div
            key={`${flow.srcChain}-${flow.dstChain}`}
            className="flex items-center gap-1"
          >
            {srcChain ? (
              <img
                src={srcChain.iconUrl}
                alt={flow.srcChain}
                className="size-4"
              />
            ) : (
              <span className="text-secondary">{flow.srcChain}</span>
            )}
            <ArrowRightIcon className="size-4 min-w-4 fill-brand" />
            {dstChain ? (
              <img
                src={dstChain.iconUrl}
                alt={flow.dstChain}
                className="size-4"
              />
            ) : (
              <span className="text-secondary">{flow.dstChain}</span>
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
