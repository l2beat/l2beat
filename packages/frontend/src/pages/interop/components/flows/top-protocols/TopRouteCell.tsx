import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'

export function TopRouteCell({ route }: { route: ProtocolEntry['topRoute'] }) {
  const { allChains, setHighlightedChainPair } = useInteropFlows()

  if (!route) return <span className="text-secondary">{EM_DASH}</span>

  const from = allChains.find((chain) => chain.id === route.srcChain)
  const to = allChains.find((chain) => chain.id === route.dstChain)
  if (!from || !to) return <span className="text-secondary">{EM_DASH}</span>

  const handleClick = () => {
    setHighlightedChainPair(route.srcChain, route.dstChain)
    document
      .getElementById('flows-graph')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Show ${from.name} to ${to.name} route in the flows chart`}
      className="md:-mx-2 flex items-center gap-1.5 rounded transition-colors md:px-2 md:py-1 md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/10"
    >
      <img src={from.iconUrl} alt={from.name} className="size-5" />
      <span className="truncate font-medium text-label-value-15 max-md:hidden">
        {from.name}
      </span>
      <ArrowRightIcon className="size-4 shrink-0 fill-brand" />
      <img src={to.iconUrl} alt={to.name} className="size-5" />
      <span className="truncate font-medium text-label-value-15 max-md:hidden">
        {to.name}
      </span>
    </button>
  )
}
