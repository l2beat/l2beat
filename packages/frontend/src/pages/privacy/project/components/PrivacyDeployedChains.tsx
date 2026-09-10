import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { PrivacyDeployedChain } from '~/server/features/privacy/utils/getPrivacyDeployedChains'

interface Props {
  chains: PrivacyDeployedChain[]
}

export function PrivacyDeployedChains({ chains }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chains.map((chain) => {
        const image = (
          <img
            width={20}
            height={20}
            src={chain.iconUrl}
            alt={`${chain.name} logo`}
            className="size-5 min-w-5 rounded-full"
          />
        )

        return (
          <Tooltip key={chain.id}>
            {chain.href ? (
              <TooltipTrigger asChild disabledOnMobile>
                <a href={chain.href} className="size-5">
                  {image}
                </a>
              </TooltipTrigger>
            ) : (
              <TooltipTrigger>{image}</TooltipTrigger>
            )}
            <TooltipContent>
              <p className="font-bold">{chain.name}</p>
              {chain.href && (
                <p className="text-secondary text-xs">
                  Click to view project page
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
