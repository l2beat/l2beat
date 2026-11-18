import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type {
  InsightBacking,
  InsightChain,
  InsightRouteGroup,
} from '~/server/features/insight/InsightReport'

/**
 * Only what token-db's relations show, one short line per kind of relation.
 * No relation is not proof of a native token: it may just not be indexed, so
 * the cell says so instead of staying empty.
 */
export function BackingCell({ backing }: { backing: InsightBacking }) {
  const lines: React.ReactNode[] = []
  if (backing.mintedAgainst.length > 0) {
    const chains = getChainNames(backing.mintedAgainst)
    lines.push(
      <span key="minted">
        Minted against tokens locked on {chains.join(', ')}
        <Via groups={backing.mintedAgainst} />
      </span>,
    )
  }
  if (backing.burnAndMint.length > 0) {
    lines.push(
      <span key="burn">
        Burn-and-mint across{' '}
        <ChainCount chains={getChainNames(backing.burnAndMint)} />
        <Via groups={backing.burnAndMint} />
      </span>,
    )
  }
  if (backing.lockedFor.length > 0) {
    lines.push(
      <span key="locked" className="text-secondary">
        Bridged out to <ChainCount chains={getChainNames(backing.lockedFor)} />
      </span>,
    )
  }
  if (backing.unknownRole.length > 0) {
    lines.push(
      <span key="unknown" className="text-secondary">
        Also bridged with{' '}
        <ChainCount chains={getChainNames(backing.unknownRole)} />, direction
        unknown
      </span>,
    )
  }

  if (lines.length === 0) {
    return <span className="text-secondary">No bridge relation known</span>
  }
  return <div className="flex flex-col gap-0.5">{lines}</div>
}

/** The bridges by name; a plugin with no configured bridge says nothing. */
function Via({ groups }: { groups: InsightRouteGroup[] }) {
  const names = [
    ...new Set(groups.flatMap((group) => group.bridges.map((b) => b.name))),
  ]
  if (names.length === 0) return null
  return <> via {names.join(', ')}</>
}

/** The chain list is long for big tokens, so it sits in a tooltip. */
function ChainCount({ chains }: { chains: string[] }) {
  if (chains.length === 1) return <>{chains[0]}</>
  return (
    <Tooltip>
      <TooltipTrigger className="underline decoration-dotted underline-offset-2">
        {chains.length} chains
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="max-w-72">
          {chains.join(', ')}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

function getChainNames(groups: InsightRouteGroup[]): string[] {
  const byId = new Map<string, InsightChain>()
  for (const group of groups) {
    for (const chain of group.chains) byId.set(chain.id, chain)
  }
  return [...byId.values()].map((chain) => chain.name).sort()
}
