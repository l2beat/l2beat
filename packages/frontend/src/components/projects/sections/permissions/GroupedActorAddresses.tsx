import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { HighlightableLink } from '~/components/link/highlightable/HighlightableLink'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'
import type { TechnologyContractAddress } from '../ContractEntry'

export function GroupedActorAddresses({
  addresses,
  className,
}: {
  addresses: TechnologyContractAddress[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-row flex-wrap items-center gap-x-1.5 gap-y-1 text-paragraph-15 md:text-paragraph-16',
        className,
      )}
    >
      {addresses.map((entry) => (
        <HighlightableLink
          key={entry.address}
          id={entry.anchorId}
          variant={
            entry.verificationStatus === 'unverified' ? 'danger' : undefined
          }
          href={entry.href}
          address={entry.address}
          className="inline-flex scroll-mt-14 items-center gap-0.5 md:scroll-mt-10"
        >
          {entry.verificationStatus === 'unverified' && (
            <Tooltip>
              <TooltipTrigger>
                <UnverifiedIcon className="fill-red-300" />
              </TooltipTrigger>
              <TooltipContent>This contract is not verified</TooltipContent>
            </Tooltip>
          )}
          {entry.name}
        </HighlightableLink>
      ))}
    </div>
  )
}
