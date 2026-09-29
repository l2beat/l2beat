import {
  assertUnreachable,
  formatAddress,
  formatCurrency,
  formatInteger,
  formatSeconds,
  unique,
} from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type {
  InteropTokenDeploymentView,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import type {
  AverageDuration,
  ProtocolEntry,
} from '~/server/features/layer2s/interop/types'
import { bulletList, joinBlocks, link, subsection, table } from './markdown'

/** The deployments table, then the backing relations the HTML page draws as a diagram. */
export function renderOnchainDeployments(
  { graph }: { graph: InteropTokenRelationsGraph },
  level: number,
) {
  return joinBlocks([
    renderDeploymentsTable(graph),
    subsection(level, 'Backing relations', renderBackingRelations(graph)),
  ])
}

/** Columns and order of the protocols table on the token page. */
export function renderProtocolsTable(entries: ProtocolEntry[]) {
  if (entries.length === 0) return 'No protocol data for this token.'
  return table(
    [
      '#',
      'Name',
      'Category',
      'Last 24h volume',
      'Last 24h transfer count',
      'Last 24h avg. transfer time',
      'Last 24h avg. transfer value',
    ],
    entries
      .toSorted((a, b) => b.volume - a.volume)
      .map((entry, i) => [
        String(i + 1),
        renderProtocolName(entry),
        entry.type,
        entry.volume ? formatUsd(entry.volume) : NO_DATA,
        String(entry.transferCount),
        entry.averageDuration
          ? formatAverageDuration(entry.averageDuration)
          : NO_DATA,
        entry.averageValue ? formatUsd(entry.averageValue) : NO_DATA,
      ]),
  )
}

export function formatAverageDuration(duration: AverageDuration) {
  switch (duration.type) {
    case 'single':
      return formatSeconds(duration.duration)
    case 'split':
      return duration.splits
        .map(
          (split) =>
            `${split.label}: ${split.duration === null ? 'N/A' : formatSeconds(split.duration)}`,
        )
        .join(', ')
    case 'unknown':
      return 'Unknown (cannot be derived from onchain data alone)'
    default:
      assertUnreachable(duration)
  }
}

export function formatUsd(value: number) {
  return withPlainSpaces(formatCurrency(value, 'usd'))
}

/** Abbreviated like the HTML page, e.g. 4.32 K. */
export function formatCount(value: number) {
  return withPlainSpaces(formatInteger(value))
}

/** The HTML page separates the unit with a hair space; plain text reads better with a regular one. */
function withPlainSpaces(text: string) {
  return text.replaceAll('\u200A', ' ')
}

export function interopProtocolUrl(slug: string) {
  return `${PRODUCTION_ORIGIN}/interop/protocols/${slug}`
}

const NO_DATA = 'No data'

function renderDeploymentsTable(graph: InteropTokenRelationsGraph) {
  const deployments = graph.nodes
    .flatMap((node) => node.deployments)
    .toSorted((a, b) => (b.volume ?? -1) - (a.volume ?? -1))
  return table(
    [
      '#',
      'Chain',
      'Address',
      'Symbol',
      'Minters',
      'Last 24h volume',
      'Last 24h transfer count',
      'Last 24h avg. transfer time',
    ],
    deployments.map((deployment, i) => [
      String(i + 1),
      deployment.chain.name,
      deployment.explorerUrl
        ? link(deployment.address, deployment.explorerUrl)
        : deployment.address,
      deployment.symbol,
      renderMinters(deployment.minters),
      deployment.volume === null
        ? noDeploymentData(deployment)
        : formatUsd(deployment.volume),
      deployment.transferCount === null
        ? noDeploymentData(deployment)
        : String(deployment.transferCount),
      deployment.avgDuration === null
        ? noDeploymentData(deployment)
        : formatSeconds(deployment.avgDuration),
    ]),
  )
}

function renderMinters(minters: ProjectIconListItem[]) {
  if (minters.length === 0) {
    return 'None known (likely the locked or natively issued side)'
  }
  return minters.map(renderProjectLink).join(', ')
}

function noDeploymentData(deployment: InteropTokenDeploymentView) {
  return deployment.isSupported
    ? NO_DATA
    : `${NO_DATA} (chain not fully supported)`
}

/**
 * A group of several deployments is in a burn-and-mint relation; an edge means
 * the backed deployment is minted against the backer.
 */
function renderBackingRelations(graph: InteropTokenRelationsGraph) {
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]))
  const describe = (id: string) => {
    const node = nodes.get(id)
    return node ? describeNode(node) : id
  }
  return bulletList([
    ...graph.nodes
      .filter((node) => node.deployments.length > 1)
      .map(
        (node) =>
          `Burn and mint between ${describeNode(node)}${via(node.bridges)}`,
      ),
    ...graph.edges.map(
      (edge) =>
        `${describe(edge.backed)} is backed by ${describe(edge.backer)}${via(edge.bridges)}`,
    ),
  ])
}

/** Single deployments carry their address, as a chain can hold several deployments of the token. */
function describeNode({ deployments }: InteropTokenRelationsNode) {
  const [first] = deployments
  if (deployments.length === 1 && first) {
    return `${first.symbol} on ${first.chain.name} (${formatAddress(first.address)})`
  }
  const symbols = unique(deployments.map((deployment) => deployment.symbol))
  const chains = deployments.map((deployment) => deployment.chain.name)
  return `${symbols.join('/')} on ${chains.join(', ')}`
}

function via(bridges: ProjectIconListItem[]) {
  return bridges.length > 0
    ? ` via ${bridges.map(renderProjectLink).join(', ')}`
    : ' (bridge not identified)'
}

/** Icon list items link relatively, which a standalone markdown document cannot resolve. */
function renderProjectLink(project: ProjectIconListItem) {
  return project.href
    ? link(project.name, `${PRODUCTION_ORIGIN}${project.href}`)
    : project.name
}

function renderProtocolName(entry: ProtocolEntry) {
  const notes = [
    entry.isAggregate && 'aggregate',
    entry.subgroup && `using ${entry.subgroup.name}`,
  ].filter(Boolean)
  const suffix = notes.length > 0 ? ` (${notes.join(', ')})` : ''
  return `${link(entry.name, interopProtocolUrl(entry.slug))}${suffix}`
}
