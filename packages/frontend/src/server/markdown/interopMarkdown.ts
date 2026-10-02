import { INTEROP_CHAINS } from '@l2beat/config'
import {
  assertUnreachable,
  formatSeconds,
  pluralize,
} from '@l2beat/shared-pure'
import type { InteropVolumeSectionProps } from '~/components/projects/sections/interop/InteropVolumeSection'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type { AverageDuration } from '~/server/features/layer2s/interop/types'
import type { TopItems } from '~/server/features/layer2s/interop/utils/getTopItems'
import {
  bulletList,
  formatCount,
  formatUsd,
  joinBlocks,
  link,
  subsection,
} from './markdown'
import { htmlPagePointer } from './renderSectionParts'

/**
 * The HTML section is an interactive flows graph; its props also carry the
 * chains and routes the graph draws, which read fine as lists.
 */
export function renderInteropVolumeSection(
  {
    id,
    entry,
    interopChains,
    topRoutes,
  }: Pick<
    InteropVolumeSectionProps,
    'id' | 'entry' | 'interopChains' | 'topRoutes'
  >,
  level: number,
) {
  const chainNames = new Map(interopChains.map((c) => [c.id, c.name]))
  const chainName = (id: string) => chainNames.get(id) ?? id

  return joinBlocks([
    subsection(
      level,
      'Top chains by volume (last 24h)',
      joinBlocks([
        // Otherwise the chain volumes look inconsistent with the protocol total.
        'A transfer counts toward the volume of both its source and its destination chain, so the chain volumes add up to more than the total volume.',
        bulletList(
          listTopItems(
            entry.chains,
            (chain) =>
              `${chain.name}: ${formatUsd(chain.volume)} (${formatTransferCount(chain.transferCount)})`,
          ),
        ),
      ]),
    ),
    renderTopRoutes(topRoutes, chainName, level),
    htmlPagePointer('The flows between chains are an interactive graph', id),
  ])
}

/** Routes are directed, unlike the top path of the stats block. */
export function renderTopRoutes(
  routes: { srcChain: string; dstChain: string; volume: number }[],
  chainName: (id: string) => string,
  level: number,
) {
  return subsection(
    level,
    'Top routes by volume (last 24h)',
    bulletList(
      routes.map(
        (route) =>
          `${chainName(route.srcChain)} → ${chainName(route.dstChain)}: ${formatUsd(route.volume)}`,
      ),
    ),
  )
}

/** A top-N list as the HTML cells show it: the leaders, then how many more there are. */
export function listTopItems<T>(
  topItems: TopItems<T>,
  renderItem: (item: T) => string,
) {
  const more =
    topItems.remainingCount > 0 ? [`and ${topItems.remainingCount} more`] : []
  return [...topItems.items.map(renderItem), ...more]
}

export function formatTransferCount(count: number) {
  return `${formatCount(count)} ${pluralize(count, 'transfer')}`
}

/** Interop data carries chain ids; the configured name is what the HTML page shows. */
export function interopChainName(id: string) {
  return INTEROP_CHAINS.find((chain) => chain.id === id)?.name ?? id
}

/** The path is undirected: its volume counts transfers both ways. */
export function formatTopPath(topPath: {
  chainA: string
  chainB: string
  volume: number
}) {
  return `${interopChainName(topPath.chainA)} ↔ ${interopChainName(topPath.chainB)} (${formatUsd(topPath.volume)})`
}

/** The unknown case carries the text of the HTML tooltip. */
export function formatAverageDuration(duration: AverageDuration) {
  switch (duration.type) {
    case 'unknown':
      return 'Unknown (the transfer times for this protocol could not be derived based on onchain data only)'
    case 'single':
      return formatSeconds(duration.duration)
    case 'split':
      return duration.splits
        .map(
          (split) =>
            `${split.label}: ${split.duration !== null ? formatSeconds(split.duration) : 'N/A'}`,
        )
        .join(', ')
    default:
      assertUnreachable(duration)
  }
}

export function interopProtocolUrl(slug: string) {
  return `/interop/protocols/${slug}` as const
}

/** Protocols L2BEAT has no page for are named without a link. */
export function linkInteropProtocol(protocol: {
  name: string
  slug: string | undefined
}) {
  return protocol.slug
    ? link(protocol.name, interopProtocolUrl(protocol.slug))
    : protocol.name
}

/** The unknown token has no page, so it is named without a link, as on the HTML pages. */
export function linkInteropToken(token: {
  id: string
  symbol: string
  /** Only decorates the URL: the page is found by id alone. */
  issuer?: string | null
}) {
  const url = getInteropTokenUrl({ ...token, issuer: token.issuer ?? null })
  return url ? link(token.symbol, url) : token.symbol
}
