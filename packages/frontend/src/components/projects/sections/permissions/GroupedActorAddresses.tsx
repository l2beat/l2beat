import { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { HighlightableLink } from '~/components/link/highlightable/HighlightableLink'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'
import {
  type ContractAddressAnchorType,
  getContractAddressAnchor,
} from '~/utils/project/contracts-and-permissions/getContractAddressAnchor'
import type { TechnologyContractAddress } from '../ContractEntry'

export function GroupedActorAddresses({
  addresses,
  chain,
  type,
  className,
}: {
  addresses: TechnologyContractAddress[]
  chain: string
  type: ContractAddressAnchorType
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
          id={getContractAddressAnchor(
            type,
            ChainSpecificAddress.fromLong(chain, entry.address),
          )}
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
