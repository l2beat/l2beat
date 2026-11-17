import { Fragment } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import type {
  InsightBacking,
  InsightChain,
  InsightRouteGroup,
} from '~/server/features/insight/InsightReport'

/**
 * Only what token-db's relations show. No relation is not proof of a native
 * token: the relation may just not be indexed, so the cell says so.
 */
export function BackingCell({ backing }: { backing: InsightBacking }) {
  const lines = [
    ...backing.mintedAgainst.map((group) => (
      <span key={`minted:${group.plugin}`}>
        Minted by <Bridges group={group} /> against tokens locked on{' '}
        <Chains chains={group.chains} />
      </span>
    )),
    ...backing.burnAndMint.map((group) => (
      <span key={`burn:${group.plugin}`}>
        Burn-and-mint with <Chains chains={group.chains} /> via{' '}
        <Bridges group={group} />
      </span>
    )),
    ...backing.unknownRole.map((group) => (
      <span key={`unknown:${group.plugin}`}>
        Lock-and-mint with <Chains chains={group.chains} /> via{' '}
        <Bridges group={group} />, locked side not identified
      </span>
    )),
  ]
  // Most Ethereum tokens are the locked side of many bridges. That puts
  // nothing between the holder and the token, so it is one summary line.
  const lockedChains = new Set(
    backing.lockedFor.flatMap((group) =>
      group.chains.map((chain) => chain.name),
    ),
  )
  if (lockedChains.size > 0) {
    lines.push(
      <span
        key="locked"
        className="text-secondary"
        title={[...lockedChains].sort().join(', ')}
      >
        Ethereum is the locked side for {lockedChains.size}{' '}
        {lockedChains.size === 1 ? 'chain' : 'chains'}
      </span>,
    )
  }

  if (lines.length === 0) {
    return <span className="text-secondary">No bridge relation known</span>
  }
  return <div className="flex flex-col gap-1 text-xs md:text-sm">{lines}</div>
}

function Bridges({ group }: { group: InsightRouteGroup }) {
  if (group.bridges.length === 0) {
    return <code className="text-xs">{group.plugin}</code>
  }
  return (
    <>
      {group.bridges.map((bridge, i) => (
        <Fragment key={bridge.id}>
          {i > 0 && ', '}
          {bridge.href ? (
            <CustomLink href={bridge.href}>{bridge.name}</CustomLink>
          ) : (
            bridge.name
          )}
        </Fragment>
      ))}
    </>
  )
}

function Chains({ chains }: { chains: InsightChain[] }) {
  return <>{chains.map((chain) => chain.name).join(', ')}</>
}
