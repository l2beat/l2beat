import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { TokenData } from '~/server/features/scaling/interop/types'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { ChainIcon } from '../../../components/ChainIcon'
import { InteropNoDataBadge } from '../../../components/InteropNoDataBadge'
import { InteropTransferTrigger } from '../../../components/InteropTransferTrigger'
import { getInteropTokenUrl } from '../../../utils/getInteropTokenUrl'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'

export function IntentTokenRow({
  token,
  bridge,
  showBridgeBadge,
}: {
  token: TokenData
  bridge: InteropIntentBridge | undefined
  showBridgeBadge: boolean
}) {
  const href = getInteropTokenUrl(token)
  const topRoute = token.flows[0]
  const txsLabel = `${formatInteger(token.transferCount)} txs`
  const identity = (
    <>
      <img
        src={token.iconUrl}
        alt={token.symbol}
        className="size-6 shrink-0 rounded-full"
      />
      <span className="font-bold text-heading-16">{token.symbol}</span>
    </>
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        {href ? (
          <a href={href} className="flex items-center gap-2 hover:underline">
            {identity}
          </a>
        ) : (
          identity
        )}
        {showBridgeBadge && bridge && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex shrink-0 items-center gap-1 font-bold text-label-value-14"
                style={{ color: bridge.color }}
              >
                <img
                  src={bridge.iconUrl}
                  alt={bridge.name}
                  className="size-4 rounded-sm"
                />
                <span className="@max-[450px]:hidden">{bridge.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>{bridge.name}</TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
        {topRoute && (
          <div className="flex items-center gap-1 text-label-value-12 text-secondary">
            <span className="font-medium">Top path</span>
            <ChainIcon
              iconUrl={topRoute.srcChain.iconUrl}
              alt={topRoute.srcChain.id}
            />
            <ArrowRightIcon className="size-4 shrink-0 fill-brand" />
            <ChainIcon
              iconUrl={topRoute.dstChain.iconUrl}
              alt={topRoute.dstChain.id}
            />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        {token.volume === null ? (
          <InteropNoDataBadge />
        ) : (
          <span className="font-bold text-label-value-15 md:text-label-value-16">
            {formatCurrency(token.volume, 'usd', { decimals: 2 })}
          </span>
        )}
        {bridge ? (
          <InteropTransferTrigger
            protocol={{
              id: bridge.id,
              name: bridge.name,
              slug: bridge.slug,
              iconUrl: bridge.iconUrl,
            }}
            tokenId={token.id}
            className="cursor-pointer font-medium text-paragraph-14 text-secondary hover:underline md:text-paragraph-16"
          >
            {txsLabel}
          </InteropTransferTrigger>
        ) : (
          <span className="font-medium text-paragraph-14 text-secondary md:text-paragraph-16">
            {txsLabel}
          </span>
        )}
      </div>
    </div>
  )
}
