import { formatAddress } from '@l2beat/shared-pure'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { linkVariants } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
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
                key={entry.address}
                className="flex flex-col gap-0.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                {entry.targetId ? (
                  <>
                    <a
                      href={`#${entry.targetId}`}
                      className={linkVariants({
                        variant: 'plain',
                        className: 'min-w-0 underline',
                      })}
                    >
                      {entry.contractName}
                    </a>
                    <span className="shrink-0">
                      {formatAddress(entry.address)}
                    </span>
                  </>
                ) : (
                  <span>{entry.contractName}</span>
                )}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
