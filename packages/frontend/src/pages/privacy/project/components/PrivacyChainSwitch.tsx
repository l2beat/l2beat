import { createContext, type ReactNode, useContext, useState } from 'react'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { cn } from '~/utils/cn'

const ALL_CHAINS = 'all'

interface PrivacyChainContextValue {
  /** Chain name, undefined for the totals across every tracked chain. */
  chain: string | undefined
  setChain: (chain: string | undefined) => void
}

const PrivacyChainContext = createContext<PrivacyChainContextValue>({
  chain: undefined,
  setChain: () => {},
})

export function PrivacyChainProvider({
  initialChain,
  children,
}: {
  initialChain: string | undefined
  children: ReactNode
}) {
  const [chain, setChainState] = useState(initialChain)

  const setChain = (next: string | undefined) => {
    setChainState(next)
    const url = new URL(window.location.href)
    if (next === undefined) {
      url.searchParams.delete('chain')
    } else {
      url.searchParams.set('chain', next)
    }
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <PrivacyChainContext.Provider value={{ chain, setChain }}>
      {children}
    </PrivacyChainContext.Provider>
  )
}

/** The selected chain, if it is one of `chains`. Other chains read as the totals. */
export function usePrivacyChain(chains: ProjectIconListItem[] | undefined) {
  const { chain } = useContext(PrivacyChainContext)
  return chains?.some((c) => c.id === chain) ? chain : undefined
}

/** Chain tabs shown before the tab that lists the rest in a dropdown. */
const VISIBLE_CHAIN_TABS = 3

/**
 * Folder tabs that the summary card hangs from: totals, the first chains, and
 * past those a tab with a dropdown of the rest, which shows the chain picked
 * from it.
 */
export function PrivacyChainTabs({
  chains,
}: {
  chains: ProjectIconListItem[]
}) {
  const { setChain } = useContext(PrivacyChainContext)
  const selected = usePrivacyChain(chains) ?? ALL_CHAINS
  const select = (id: string) => setChain(id === ALL_CHAINS ? undefined : id)

  // A dropdown of a single chain would take the place of its own tab.
  const hasMore = chains.length > VISIBLE_CHAIN_TABS + 1
  const visible = hasMore ? chains.slice(0, VISIBLE_CHAIN_TABS) : chains
  const rest = hasMore ? chains.slice(VISIBLE_CHAIN_TABS) : []
  const picked = rest.find((c) => c.id === selected)

  return (
    // Even the first tabs can be wider than a phone.
    <OverflowWrapper className="max-md:px-4">
      <div role="tablist" className="flex w-max gap-1 md:gap-2">
        <ChainTab
          active={selected === ALL_CHAINS}
          onClick={() => select(ALL_CHAINS)}
        >
          <ChainIcons chains={chains.slice(0, 3)} />
          All chains
        </ChainTab>
        {visible.map((c) => (
          <ChainTab
            key={c.id}
            active={selected === c.id}
            onClick={() => select(c.id)}
          >
            <ChainIcon chain={c} />
            {c.name}
          </ChainTab>
        ))}
        {hasMore && (
          <Select value={picked?.id ?? ''} onValueChange={select}>
            <SelectTrigger
              aria-label="More chains"
              data-state={picked ? 'active' : 'inactive'}
              className={cn(
                chainTabClassName,
                'rounded-b-none',
                picked ? 'bg-surface-primary' : 'bg-surface-tertiary',
              )}
            >
              {/* With nothing picked, Radix shows the placeholder, not the children. */}
              <SelectValue
                placeholder={
                  <span className="flex items-center gap-1.5">
                    <ChainIcons chains={rest.slice(0, 3)} />+{rest.length} more
                  </span>
                }
              >
                {picked && (
                  <span className="flex items-center gap-1.5">
                    <ChainIcon chain={picked} />
                    {picked.name}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {rest.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="flex items-center gap-2">
                    <ChainIcon chain={c} />
                    {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </OverflowWrapper>
  )
}

const chainTabClassName = cn(
  'flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-t-md px-4 md:h-10 md:min-w-36 md:rounded-t-xl',
  'whitespace-nowrap font-bold text-xs md:text-sm',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
  'data-[state=inactive]:bg-surface-tertiary data-[state=inactive]:text-secondary',
  'data-[state=active]:bg-surface-primary',
)

function ChainTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? 'active' : 'inactive'}
      onClick={onClick}
      className={chainTabClassName}
    >
      {children}
    </button>
  )
}

/** Names the picked chain in the header of a section it filters. */
export function PrivacySectionChainBadge({
  chains,
}: {
  chains: ProjectIconListItem[]
}) {
  const chain = usePrivacyChain(chains)
  const selected = chains.find((c) => c.id === chain)
  if (!selected) return null
  return (
    <ChainBadge>
      <ChainIcon chain={selected} />
      {selected.name}
    </ChainBadge>
  )
}

/**
 * For a section that shows the totals whatever the selection, so a reader who
 * picked a chain sees that this one is not filtered.
 */
export function PrivacyAllChainsBadge({
  chains,
}: {
  chains: ProjectIconListItem[]
}) {
  const chain = usePrivacyChain(chains)
  if (chain === undefined) return null

  return (
    <ChainBadge>
      <ChainIcons chains={chains} />
      All chains
    </ChainBadge>
  )
}

function ChainBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-8 w-max items-center gap-1.5 rounded-lg bg-surface-secondary px-3 font-medium text-secondary text-xs md:text-sm">
      {children}
    </div>
  )
}

function ChainIcons({ chains }: { chains: ProjectIconListItem[] }) {
  return (
    <span className="-space-x-1 flex">
      {chains.map((c) => (
        <ChainIcon key={c.id} chain={c} />
      ))}
    </span>
  )
}

function ChainIcon({ chain }: { chain: ProjectIconListItem }) {
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
