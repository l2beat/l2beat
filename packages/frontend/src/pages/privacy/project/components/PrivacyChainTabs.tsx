import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '~/components/core/Popover'
import { ChevronIcon } from '~/icons/Chevron'
import type { PrivacyChainTab } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { cn } from '~/utils/cn'

/** Chain tabs shown before the tab that lists the rest. */
const VISIBLE_CHAIN_TABS = 3

/**
 * Folder tabs that the summary of one chain hangs from, each a link to the
 * project's page on that chain: the first chains, and past those a tab that
 * lists the rest and shows the chain picked from it.
 */
export function PrivacyChainTabs({
  chains,
  selectedId,
}: {
  chains: PrivacyChainTab[]
  selectedId: string
}) {
  // A list of a single chain would take the place of its own tab.
  const hasMore = chains.length > VISIBLE_CHAIN_TABS + 1
  const visible = hasMore ? chains.slice(0, VISIBLE_CHAIN_TABS) : chains
  const rest = hasMore ? chains.slice(VISIBLE_CHAIN_TABS) : []
  const picked = rest.find((c) => c.id === selectedId)

  return (
    // Even the first tabs can be wider than a phone.
    <OverflowWrapper className="min-w-0 max-md:px-4">
      <nav aria-label="Tracked chains" className="flex w-max gap-1 md:gap-2">
        {visible.map((chain) => (
          <a
            key={chain.id}
            href={chain.href}
            aria-current={chain.id === selectedId ? 'page' : undefined}
            className={tabClassName(chain.id === selectedId)}
          >
            <ChainIcon chain={chain} />
            {chain.name}
          </a>
        ))}
        {hasMore && (
          <Popover>
            <PopoverTrigger
              aria-label="More chains"
              className={cn(tabClassName(!!picked), 'rounded-b-none')}
            >
              {picked ? (
                <>
                  <ChainIcon chain={picked} />
                  {picked.name}
                </>
              ) : (
                <>
                  <span className="-space-x-1 flex">
                    {rest.slice(0, 3).map((chain) => (
                      <ChainIcon key={chain.id} chain={chain} />
                    ))}
                  </span>
                  +{rest.length} more
                </>
              )}
              <ChevronIcon className="size-2.5 fill-current transition-transform group-data-[state=open]:rotate-180" />
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent
                aria-label="More chains"
                align="start"
                className="flex min-w-48 flex-col gap-1 p-1"
              >
                {rest.map((chain) => (
                  <a
                    key={chain.id}
                    href={chain.href}
                    aria-current={chain.id === selectedId ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded px-2 py-1.5 text-label-value-14 hover:bg-surface-secondary',
                      chain.id === selectedId &&
                        'bg-surface-secondary font-bold',
                    )}
                  >
                    <ChainIcon chain={chain} />
                    {chain.name}
                  </a>
                ))}
              </PopoverContent>
            </PopoverPortal>
          </Popover>
        )}
      </nav>
    </OverflowWrapper>
  )
}

function tabClassName(selected: boolean) {
  return cn(
    'flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-t-md px-4 md:h-10 md:min-w-36 md:rounded-t-xl',
    'whitespace-nowrap font-bold text-xs md:text-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
    selected ? 'bg-surface-primary' : 'bg-surface-tertiary text-secondary',
  )
}

function ChainIcon({ chain }: { chain: PrivacyChainTab }) {
  return (
    <img
      src={chain.iconUrl}
      alt=""
      width={16}
      height={16}
      className="size-4 rounded-full bg-pure-white ring-1 ring-surface-primary"
    />
  )
}
