import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { useInteropFlows } from '../utils/InteropFlowsContext'

export function TopRouteCell({ route }: { route: ProtocolEntry['topRoute'] }) {
  const { setHighlightedChainPair } = useInteropFlows()

  if (!route) return <span className="text-secondary">{EM_DASH}</span>

  const { srcChain, dstChain } = route

  const handleClick = () => {
    setHighlightedChainPair(srcChain.id, dstChain.id)
    document
      .getElementById('flows-graph')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Show ${srcChain.name} to ${dstChain.name} route in the flows chart`}
      className="md:-mx-2 flex items-center gap-1.5 rounded transition-colors md:px-2 md:py-2 md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/10"
    >
      <img src={srcChain.iconUrl} alt={srcChain.name} className="size-5" />
      <span className="truncate font-medium text-label-value-15 max-md:hidden">
        {srcChain.name}
      </span>
      <ArrowRightIcon className="size-4 shrink-0 fill-brand" />
      <img src={dstChain.iconUrl} alt={dstChain.name} className="size-5" />
      <span className="truncate font-medium text-label-value-15 max-md:hidden">
        {dstChain.name}
      </span>
    </button>
  )
}
