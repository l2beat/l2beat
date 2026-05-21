import { formatAddress } from '@l2beat/shared-pure'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { linkVariants } from '~/components/link/CustomLink'
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
  const [expandedAddresses, setExpandedAddresses] = useState<Set<string>>(
    () => new Set(),
  )

  const toggleAddress = (address: string) => {
    setExpandedAddresses((prev) => {
      const next = new Set(prev)
      if (next.has(address)) {
        next.delete(address)
      } else {
        next.add(address)
      }
      return next
    })
  }

  return (
    <div
      className={cn(
        'flex flex-row flex-wrap items-center gap-x-1.5 gap-y-1 text-paragraph-15 md:text-paragraph-16',
        className,
      )}
    >
      {addresses.map((entry, i) => {
        const isExpanded = expandedAddresses.has(entry.address)

        return (
          <span key={entry.address} className="inline-flex items-center gap-1">
            {i > 0 && <span className="text-secondary">, </span>}
            <button
              type="button"
              aria-expanded={isExpanded}
              className={cn(
                linkVariants({ variant: 'primary', underline: true }),
                'cursor-pointer',
              )}
              onClick={() => toggleAddress(entry.address)}
            >
              {entry.name}
            </button>
            {isExpanded && (
              <HighlightableLink
                variant={
                  entry.verificationStatus === 'unverified'
                    ? 'danger'
                    : undefined
                }
                href={entry.href}
                address={entry.address}
                className="inline-flex items-center gap-0.5"
              >
                {entry.verificationStatus === 'unverified' && (
                  <Tooltip>
                    <TooltipTrigger>
                      <UnverifiedIcon className="fill-red-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                      This contract is not verified
                    </TooltipContent>
                  </Tooltip>
                )}
                {formatAddress(entry.address)}
              </HighlightableLink>
            )}
          </span>
        )
      })}
    </div>
  )
}
