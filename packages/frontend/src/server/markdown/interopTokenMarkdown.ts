import { formatAddress, formatSeconds, unique } from '@l2beat/shared-pure'
import upperFirst from 'lodash/upperFirst'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import {
  getDeploymentsByVolume,
  isCluster,
} from '~/components/projects/sections/interop/onchain-deployments/relations-graph/graphSelectors'
import type {
  InteropTokenDeploymentView,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import {
  formatAverageDuration,
  formatTransferCount,
  interopProtocolUrl,
} from './interopMarkdown'
import {
  bulletList,
  formatUsd,
  joinBlocks,
  link,
  subsection,
  table,
} from './markdown'

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

/** Columns of the protocols table on the token page; entries arrive sorted by volume. */
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
    entries.map((entry, i) => [
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

const NO_DATA = 'No data'

function renderDeploymentsTable(graph: InteropTokenRelationsGraph) {
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
    getDeploymentsByVolume(graph).map((deployment, i) => [
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
 * the backed deployment is minted against the backer. Groups are listed once,
 * with their deployments, and referred to by number in the edges, so a large
 * group does not repeat its chains on every line.
 */
function renderBackingRelations(graph: InteropTokenRelationsGraph) {
  const groupNumbers = new Map(
    graph.nodes.filter(isCluster).map((node, i) => [node.id, i + 1]),
  )
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]))
  const describe = (id: string) => {
    const node = nodes.get(id)
    if (!node) return id
    const groupNumber = groupNumbers.get(id)
    return groupNumber !== undefined
      ? `group ${groupNumber} (${describeGroup(node)})`
      : describeDeployment(node)
  }
  const groups = graph.nodes.flatMap((node) => {
    const groupNumber = groupNumbers.get(node.id)
    return groupNumber !== undefined ? [renderGroup(node, groupNumber)] : []
  })
  const backing = graph.edges.map(
    (edge) =>
      `${upperFirst(describe(edge.backed))} is backed by ${describe(edge.backer)}${via(edge.bridges)}`,
  )
  return joinBlocks([
    listWithLead(
      'Burn-and-mint groups, whose deployments move between chains by burning on one and minting on another:',
      groups,
    ),
    listWithLead(
      'Backing, where a deployment is minted against the one backing it:',
      backing,
    ),
  ])
}

function listWithLead(lead: string, items: string[]) {
  return items.length > 0 ? joinBlocks([lead, bulletList(items)]) : ''
}

/** The totals the HTML group card shows, then every member with its address. */
function renderGroup(node: InteropTokenRelationsNode, groupNumber: number) {
  const totals = [
    node.volume !== null && `last 24h volume ${formatUsd(node.volume)}`,
    node.transferCount !== null && formatTransferCount(node.transferCount),
  ].filter(Boolean)
  const members = node.deployments
    .map(
      (deployment) =>
        `${deployment.chain.name} (${formatAddress(deployment.address)})`,
    )
    .join(', ')
  return [
    `Group ${groupNumber}: ${describeGroup(node)}, burned and minted${via(node.bridges)}`,
    totals.length > 0 ? `; ${totals.join(', ')}` : '',
    `; deployments: ${members}`,
  ].join('')
}

function describeGroup({ deployments }: InteropTokenRelationsNode) {
  const symbols = unique(deployments.map((deployment) => deployment.symbol))
  return `${symbols.join('/')}, ${deployments.length} deployments`
}

/** With its address, as a chain can hold several deployments of the token. */
function describeDeployment({ deployments }: InteropTokenRelationsNode) {
  const [first] = deployments
  if (!first) return 'unknown deployment'
  return `${first.symbol} on ${first.chain.name} (${formatAddress(first.address)})`
}

function via(bridges: ProjectIconListItem[]) {
  return bridges.length > 0
    ? ` via ${bridges.map(renderProjectLink).join(', ')}`
    : ' (bridge not identified)'
}

function renderProjectLink(project: ProjectIconListItem) {
  return project.href ? link(project.name, project.href) : project.name
}

function renderProtocolName(entry: ProtocolEntry) {
  const notes = [
    entry.isAggregate && 'aggregate',
    entry.subgroup && `using ${entry.subgroup.name}`,
  ].filter(Boolean)
  const suffix = notes.length > 0 ? ` (${notes.join(', ')})` : ''
  return `${link(entry.name, interopProtocolUrl(entry.slug))}${suffix}`
}
