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
    entry,
    interopChains,
    topRoutes,
  }: Pick<InteropVolumeSectionProps, 'entry' | 'interopChains' | 'topRoutes'>,
  level: number,
  flowsGraphUrl: string,
) {
  const chainNames = new Map(interopChains.map((c) => [c.id, c.name]))
  const chainName = (id: string) => chainNames.get(id) ?? id

  return joinBlocks([
    subsection(
      level,
      'Top chains by volume',
      bulletList(
        listTopItems(
          entry.chains,
          (chain) =>
            `${chain.name}: ${formatUsd(chain.volume)} (${formatCount(chain.transferCount)} transfers)`,
        ),
      ),
    ),
    subsection(
      level,
      'Top routes by volume',
      bulletList(
        topRoutes.map(
          (route) =>
            `${chainName(route.srcChain)} → ${chainName(route.dstChain)}: ${formatUsd(route.volume)}`,
        ),
      ),
    ),
    `The flows between chains are an interactive graph on ${link('the HTML page', flowsGraphUrl)}.`,
  ])
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
