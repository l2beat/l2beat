import { formatAddress } from '@l2beat/shared-pure'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { linkVariants } from '~/components/link/CustomLink'
import { HighlightableLink } from '~/components/link/highlightable/HighlightableLink'
import { ChevronIcon } from '~/icons/Chevron'
import { CustomLinkIcon } from '~/icons/Outlink'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'
import type { UnverifiedContractEntry } from '~/utils/project/contracts-and-permissions/getUnverifiedContractEntries'
import { WarningBar } from '../../WarningBar'

interface Props {
  entries?: UnverifiedContractEntry[]
  className?: string
}

export function UnverifiedContractsWarning({ entries, className }: Props) {
  if (!entries || entries.length === 0) {
    return (
      <WarningBar
        text="This project includes unverified contracts."
        color="red"
        isCritical
        className={className}
        icon={UnverifiedIcon}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg bg-negative/20 p-4',
        className,
      )}
    >
      <UnverifiedIcon className="size-5 shrink-0 fill-red-300" />
      <Collapsible className="min-w-0 flex-1">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-start justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          <span className="leading-snug">
            {entries.length}{' '}
            {entries.length === 1 ? 'address has' : 'addresses have'} unverified
            source code.
            <span className="text-red-300"> (CRITICAL)</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-medium text-link text-xs md:text-sm">
            View details
            <ChevronIcon className="group-data-[state=open]/Collapsible:-rotate-180 size-3 fill-current transition-transform duration-200" />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-3 space-y-2 border-divider border-t pt-3">
            {entries.map((entry) => (
              <li
                key={`${entry.targetId}-${entry.address}`}
                className="flex flex-col gap-0.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <div className="min-w-0">
                  <a
                    href={`#${entry.targetId}`}
                    className={linkVariants({ variant: 'plain' })}
                  >
                    {entry.contractName || formatAddress(entry.address)}
                  </a>{' '}
                  <span className="font-normal text-secondary">
                    · {typeLabels[entry.type]}
                  </span>
                </div>
                <HighlightableLink
                  href={entry.href}
                  address={entry.address}
                  variant="danger"
                  className="flex shrink-0 items-center gap-1"
                >
                  {formatAddress(entry.address)}
                  <CustomLinkIcon className="size-3.5" />
                </HighlightableLink>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

const typeLabels: Record<UnverifiedContractEntry['type'], string> = {
  proxy: 'Proxy',
  implementation: 'Implementation',
  standalone: 'Standalone',
  permission: 'Permission',
}
