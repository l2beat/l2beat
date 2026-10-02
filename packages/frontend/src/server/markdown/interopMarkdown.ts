import { INTEROP_CHAINS } from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import type { InteropVolumeSectionProps } from '~/components/projects/sections/interop/InteropVolumeSection'
import type { TopItems } from '~/server/features/layer2s/interop/utils/getTopItems'
import {
  bulletList,
  formatCount,
  formatUsd,
  joinBlocks,
  link,
  subsection,
} from './markdown'

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
    `The flows between chains are an interactive graph on ${link('the HTML page', `#${id}`)}.`,
  ])
}

/** Routes are directed, unlike the top path of the stats block. */
export function renderTopRoutes(
  routes: { srcChain: string; dstChain: string; volume: number }[],
  chainName: (id: string) => string,
  level: number,
  more?: number,
) {
  return subsection(
    level,
    'Top routes by volume (last 24h)',
    bulletList([
      ...routes.map(
        (route) =>
          `${chainName(route.srcChain)} → ${chainName(route.dstChain)}: ${formatUsd(route.volume)}`,
      ),
      ...(more ? [`and ${more} more`] : []),
    ]),
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
