import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import type { InteropVolumeSectionProps } from '~/components/projects/sections/interop/InteropVolumeSection'
import type { TopItems } from '~/server/features/layer2s/interop/utils/getTopItems'
import { bulletList, joinBlocks, link, subsection } from './markdown'

/**
 * The HTML section is an interactive flows graph; its props also carry the
 * chains and routes the graph draws, which read fine as lists.
 */
export function renderInteropVolumeSection(
  {
    entry,
    interopChains,
  }: Pick<InteropVolumeSectionProps, 'entry' | 'interopChains'>,
  level: number,
  flowsGraphUrl: string,
) {
  const chainNames = new Map(interopChains.map((c) => [c.id, c.name]))
  const chainName = (id: string) => chainNames.get(id) ?? id
  const routes = sumRouteVolumes(entry).slice(0, MAX_ROUTES)

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
        routes.map(
          (route) =>
            `${chainName(route.srcChain)} → ${chainName(route.dstChain)}: ${formatUsd(route.volume)}`,
        ),
      ),
    ),
    `The flows between chains are an interactive graph on ${link('the HTML page', flowsGraphUrl)}.`,
  ])
}

const MAX_ROUTES = 10

/** Every bridge type lists its own flows; the graph adds them up per route. */
function sumRouteVolumes({ byBridgeType }: InteropVolumeSectionProps['entry']) {
  const routes = new Map<
    string,
    { srcChain: string; dstChain: string; volume: number }
  >()
  for (const bridgeType of Object.values(byBridgeType ?? {})) {
    for (const flow of bridgeType?.flows ?? []) {
      const key = `${flow.srcChain}>${flow.dstChain}`
      const route = routes.get(key) ?? { ...flow, volume: 0 }
      route.volume += flow.volume
      routes.set(key, route)
    }
  }
  return [...routes.values()]
    .filter((route) => route.volume > 0)
    .toSorted((a, b) => b.volume - a.volume)
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

export function formatUsd(value: number) {
  return withPlainSpaces(formatCurrency(value, 'usd'))
}

export function formatCount(value: number) {
  return withPlainSpaces(formatInteger(value))
}

/** The HTML page separates the unit with a hair space; plain text reads better with a regular one. */
function withPlainSpaces(formatted: string) {
  return formatted.replaceAll('\u200A', ' ')
}
