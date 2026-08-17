import {
  formatAddress,
  formatCurrency,
  formatInteger,
  formatSeconds,
} from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { CloseIcon } from '~/icons/Close'
import type {
  InteropTokenRelationsDeployment,
  InteropTokenRelationsEdge,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'

interface Props {
  graph: InteropTokenRelationsGraph
  nodeId: string
  onSelectNode: (nodeId: string) => void
  onClose: () => void
}

interface BackingPath {
  nodes: InteropTokenRelationsNode[]
  edges: InteropTokenRelationsEdge[]
  complete: boolean
}

interface SameChainDeployment {
  deployment: InteropTokenRelationsDeployment
  nodeId: string
  selected: boolean
  directMinters: UsedInProjectWithIcon[]
}

interface SameChainComparison {
  chain: string
  chainName: string
  iconUrl: string | undefined
  selected: SameChainDeployment
  ranked: SameChainDeployment[]
  selectedRank: number | undefined
  selectedRankSize: number
}

interface DetailsContext {
  node: InteropTokenRelationsNode
  first: InteropTokenRelationsDeployment | undefined
  isGroup: boolean
  sameChainComparisons: SameChainComparison[]
  backingPaths: BackingPath[]
  backedPaths: BackingPath[]
}

export function RelationsDetails({
  graph,
  nodeId,
  onSelectNode,
  onClose,
}: Props) {
  const node = graph.nodes.find((candidate) => candidate.id === nodeId)
  if (!node) return null

  const context = buildDetailsContext(graph, node)

  return (
    <aside className="flex h-full flex-col overflow-y-auto rounded-lg border border-divider bg-surface-primary p-4 [&_.text-label-value-12]:leading-[normal]! [&_.text-label-value-13]:leading-[normal]! [&_.text-label-value-15]:leading-[normal]!">
      <DetailsHeader context={context} onClose={onClose} />

      <PanelSection title="Past 24h crosschain activity" className="mt-5">
        <TransferActivity context={context} />
      </PanelSection>

      <PanelSection title="Same-chain activity">
        <SameChainComparisons context={context} onSelectNode={onSelectNode} />
      </PanelSection>

      <div className="mt-4">
        <BackingOverview context={context} onSelectNode={onSelectNode} />
      </div>
    </aside>
  )
}

function DetailsHeader({
  context,
  onClose,
}: {
  context: DetailsContext
  onClose: () => void
}) {
  return (
    <header>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-heading-18">
            {context.first?.symbol ?? 'Token'}
          </p>
          {context.isGroup ? (
            <p className="mt-0.5 truncate text-label-value-13 text-secondary">
              {context.node.deployments.length}-contract burn-mint cluster
            </p>
          ) : (
            <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-label-value-13 text-secondary">
              {context.first?.iconUrl && (
                <img
                  src={context.first.iconUrl}
                  alt=""
                  className="size-4 shrink-0 rounded-full"
                />
              )}
              <span className="truncate">{context.first?.chainName}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-surface-secondary hover:text-primary"
        >
          <CloseIcon className="size-3 fill-current" />
        </button>
      </div>

      {!context.isGroup && context.first && (
        <p className="mt-2 text-label-value-13">
          <DeploymentAddress deployment={context.first} />
        </p>
      )}
    </header>
  )
}

function PanelSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('mt-4', className)}>
      <p className="font-bold text-label-value-12 text-secondary">{title}</p>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function TransferActivity({ context }: { context: DetailsContext }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-divider">
      <ActivityStat label="Volume" value={transferVolume(context)} emphasis />
      <ActivityStat label="Transfers" value={transferCount(context)} />
      <ActivityStat label="Avg. time" value={transferTime(context)} />
    </div>
  )
}

function ActivityStat({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="min-w-0 px-2 first:pl-0 last:pr-0">
      <p className="text-label-value-12 text-secondary">{label}</p>
      <p
        className={cn(
          'mt-0.5 truncate font-bold text-label-value-13 tabular-nums',
          emphasis && 'text-label-value-15',
        )}
        title={value}
      >
        {value}
      </p>
    </div>
  )
}

function SameChainComparisons({
  context,
  onSelectNode,
}: {
  context: DetailsContext
  onSelectNode: (nodeId: string) => void
}) {
  const comparisons = context.sameChainComparisons
  if (comparisons.length === 0) {
    return (
      <p className="text-label-value-13 text-secondary">
        {context.isGroup
          ? 'No member chain has another visible deployment of this token.'
          : `This is the only visible deployment on ${context.first?.chainName ?? 'this chain'}.`}
      </p>
    )
  }

  const shown = comparisons.slice(0, context.isGroup ? 3 : comparisons.length)

  return (
    <div>
      <div>
        {shown.map((comparison, index) => (
          <div
            key={`${comparison.chain}|${deploymentKey(comparison.selected.deployment)}`}
            className={cn(index > 0 && 'mt-5 border-divider border-t pt-5')}
          >
            <SameChainComparisonView
              comparison={comparison}
              onSelectNode={onSelectNode}
            />
          </div>
        ))}
      </div>
      {comparisons.length > shown.length && (
        <p className="mt-2 text-label-value-12 text-secondary">
          +{comparisons.length - shown.length} more member{' '}
          {comparisons.length - shown.length === 1 ? 'chain' : 'chains'} with
          alternatives
        </p>
      )}
    </div>
  )
}

function SameChainComparisonView({
  comparison,
  onSelectNode,
}: {
  comparison: SameChainComparison
  onSelectNode: (nodeId: string) => void
}) {
  const maxVolume = Math.max(
    0,
    ...comparison.ranked.map((item) => item.deployment.volume ?? 0),
  )

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-bold text-label-value-12">
          {comparison.iconUrl && (
            <img
              src={comparison.iconUrl}
              alt=""
              className="size-4 shrink-0 rounded-full"
            />
          )}
          <span className="truncate">{comparison.chainName}</span>
        </span>
        <span className="shrink-0 font-bold text-brand text-label-value-12">
          {sameChainRankLabel(comparison)}
        </span>
      </div>

      <div className="mt-2 space-y-4">
        {comparison.ranked.map((item) => {
          const rank = deploymentActivityRank(comparison.ranked, item)

          return (
            <div
              key={`${item.nodeId}|${deploymentKey(item.deployment)}`}
              className={cn(
                'text-label-value-12',
                item.selected &&
                  '-mx-2 rounded-r-md border-brand border-l-2 bg-brand/5 py-2 pr-2 pl-1.5',
              )}
            >
              <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-2">
                <span className="flex h-5 min-w-6 items-center justify-center rounded-full bg-surface-secondary px-1 font-bold text-2xs text-secondary tabular-nums">
                  {rank === undefined ? '—' : `#${rank}`}
                </span>
                <span className="min-w-0 truncate">
                  {item.selected ? (
                    <span className="font-bold text-brand">
                      This deployment
                    </span>
                  ) : (
                    <SelectNodeButton
                      nodeId={item.nodeId}
                      onSelectNode={onSelectNode}
                      className="font-medium"
                    >
                      {item.deployment.symbol}
                    </SelectNodeButton>
                  )}{' '}
                  <DeploymentAddress deployment={item.deployment} />
                </span>
                <span
                  className={cn(
                    'shrink-0 text-secondary tabular-nums',
                    item.selected && 'font-bold text-brand',
                  )}
                >
                  {formatDeploymentVolume(item.deployment.volume)}
                </span>
                <div className="col-span-2 col-start-2">
                  <DirectMinterLine minters={item.directMinters} />
                </div>
                <div className="col-span-2 col-start-2 mt-1 h-1 overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      item.selected ? 'bg-brand' : 'bg-secondary/50',
                    )}
                    style={{
                      width: `${activityBarWidth(item.deployment.volume, maxVolume)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DirectMinterLine({ minters }: { minters: UsedInProjectWithIcon[] }) {
  const shown = minters.slice(0, 2)
  if (shown.length === 0) return null

  return (
    <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 text-label-value-12 text-secondary">
      <span>Minted by</span>
      {shown.map((minter, index) => (
        <span key={minter.id} className="contents">
          {index > 0 && <span>·</span>}
          <a
            href={minter.url}
            className="inline-flex min-w-0 items-center gap-1 text-primary hover:text-brand"
          >
            <img
              src={minter.icon}
              alt=""
              className="size-3 shrink-0 rounded-full"
            />
            <span className="truncate">{minter.name}</span>
          </a>
        </span>
      ))}
      {minters.length > shown.length && (
        <span>+{minters.length - shown.length}</span>
      )}
    </div>
  )
}

function BackingOverview({
  context,
  onSelectNode,
}: {
  context: DetailsContext
  onSelectNode: (nodeId: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <RelationHeading>Backed by</RelationHeading>
        <div className="mt-2">
          <BackingAncestry context={context} onSelectNode={onSelectNode} />
        </div>
      </div>
      <div>
        <RelationHeading>Backs</RelationHeading>
        <div className="mt-2">
          <BackingDescendants context={context} onSelectNode={onSelectNode} />
        </div>
      </div>
    </div>
  )
}

function RelationHeading({ children }: { children: ReactNode }) {
  return (
    <p className="font-medium text-label-value-12 text-secondary">{children}</p>
  )
}

function SelectNodeButton({
  nodeId,
  onSelectNode,
  children,
  className,
}: {
  nodeId: string
  onSelectNode: (nodeId: string) => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectNode(nodeId)}
      className={cn(
        'cursor-pointer rounded-sm text-left hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-1',
        className,
      )}
    >
      {children}
    </button>
  )
}

function BackingAncestry({
  context,
  onSelectNode,
}: {
  context: DetailsContext
  onSelectNode: (nodeId: string) => void
}) {
  const paths = context.backingPaths.filter((path) => path.edges.length > 0)
  if (paths.length === 0) {
    return (
      <p className="text-label-value-13 text-secondary">
        Source-side deployment; no upstream backing is observed.
      </p>
    )
  }

  const shown = paths.slice(0, 2)
  return (
    <div className="space-y-4">
      {shown.map((path, index) => (
        <UpstreamPath
          key={pathKey(path)}
          path={path}
          pathNumber={paths.length > 1 ? index + 1 : undefined}
          onSelectNode={onSelectNode}
        />
      ))}
      {paths.length > shown.length && (
        <p className="text-label-value-12 text-secondary">
          +{paths.length - shown.length} other observed source{' '}
          {paths.length - shown.length === 1 ? 'path' : 'paths'}
        </p>
      )}
    </div>
  )
}

function UpstreamPath({
  path,
  pathNumber,
  onSelectNode,
}: {
  path: BackingPath
  pathNumber?: number
  onSelectNode: (nodeId: string) => void
}) {
  const steps = path.nodes.slice(0, -1).map((node, index) => ({
    node,
    edge: path.edges[index],
  }))

  return (
    <div>
      {pathNumber !== undefined && (
        <p className="mb-1.5 text-label-value-12 text-secondary">
          Source path {pathNumber}
        </p>
      )}
      <div>
        {steps.map(({ node, edge }, index) => (
          <div key={`${node.id}-${index}`}>
            <div className="flex items-start gap-2">
              <NodeIcon node={node} />
              <div className="min-w-0 flex-1">
                <SelectNodeButton
                  nodeId={node.id}
                  onSelectNode={onSelectNode}
                  className="font-medium text-label-value-12"
                >
                  {describeNode(node)}
                </SelectNodeButton>
                {node.bridges.length > 0 && (
                  <div className="mt-1">
                    <InlineBridgeList
                      bridges={node.bridges}
                      prefix="Burn & mint via"
                      hangingPrefix
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="ml-2.5 flex min-h-12 items-center border-divider border-l pl-4">
              {edge && edge.bridges.length > 0 ? (
                <InlineBridgeList bridges={edge.bridges} prefix="Minted by" />
              ) : (
                <span className="text-label-value-12 text-secondary">
                  observed backing relation
                </span>
              )}
            </div>
          </div>
        ))}
        <p className="ml-2.5 border-brand border-l-2 pl-4 font-medium text-brand text-label-value-12">
          This deployment
        </p>
      </div>
      {!path.complete && (
        <p className="mt-2 text-label-value-12 text-secondary">
          Upstream source is not visible beyond this point.
        </p>
      )}
    </div>
  )
}

function BackingDescendants({
  context,
  onSelectNode,
}: {
  context: DetailsContext
  onSelectNode: (nodeId: string) => void
}) {
  const paths = context.backedPaths.filter((path) => path.edges.length > 0)
  if (paths.length === 0) {
    return (
      <p className="text-label-value-13 text-secondary">
        No downstream deployment is visibly backed by this one.
      </p>
    )
  }

  const direct = paths.filter((path) => path.nodes.length === 2)
  const nested = paths.filter((path) => path.nodes.length > 2)
  const directGroups = groupDirectBackedPaths(direct)
  const shownNested = nested.slice(0, 3)

  return (
    <div className="space-y-3">
      {directGroups.map((group) => (
        <DirectBackedGroup
          key={group.key}
          group={group}
          onSelectNode={onSelectNode}
        />
      ))}
      {shownNested.map((path) => (
        <DownstreamPath
          key={pathKey(path)}
          path={path}
          onSelectNode={onSelectNode}
        />
      ))}
      {nested.length > shownNested.length && (
        <p className="text-label-value-12 text-secondary">
          +{nested.length - shownNested.length} other downstream{' '}
          {nested.length - shownNested.length === 1 ? 'path' : 'paths'}
        </p>
      )}
    </div>
  )
}

interface DirectBackedPathGroup {
  key: string
  bridges: UsedInProjectWithIcon[]
  nodes: InteropTokenRelationsNode[]
}

function groupDirectBackedPaths(paths: BackingPath[]): DirectBackedPathGroup[] {
  const groups = new Map<string, DirectBackedPathGroup>()
  for (const path of paths) {
    const node = path.nodes[1]
    if (!node) continue
    const bridges = uniqueBridges(path.edges.flatMap((edge) => edge.bridges))
    const key = bridges.map((bridge) => bridge.id).join('|') || 'unattributed'
    const group = groups.get(key) ?? { key, bridges, nodes: [] }
    group.nodes.push(node)
    groups.set(key, group)
  }
  return [...groups.values()]
}

function DirectBackedGroup({
  group,
  onSelectNode,
}: {
  group: DirectBackedPathGroup
  onSelectNode: (nodeId: string) => void
}) {
  const shown = group.nodes.slice(0, 4)
  return (
    <div>
      <InlineBridgeList bridges={group.bridges} prefix="via" />
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
        {shown.map((node) => (
          <SelectNodeButton
            key={node.id}
            nodeId={node.id}
            onSelectNode={onSelectNode}
            className="flex min-w-0 items-center gap-1.5 text-label-value-12"
          >
            <NodeIcon node={node} small />
            <span>{describeNode(node)}</span>
          </SelectNodeButton>
        ))}
        {group.nodes.length > shown.length && (
          <span className="text-label-value-12 text-secondary">
            +{group.nodes.length - shown.length} more
          </span>
        )}
      </div>
    </div>
  )
}

function DownstreamPath({
  path,
  onSelectNode,
}: {
  path: BackingPath
  onSelectNode: (nodeId: string) => void
}) {
  const nodes = path.nodes.slice(1)
  const bridges = uniqueBridges([
    ...path.edges.flatMap((edge) => edge.bridges),
    ...nodes.flatMap((node) => node.bridges),
  ])

  return (
    <div>
      <InlineBridgeList bridges={bridges} prefix="via" />
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-label-value-12">
        {nodes.map((node, index) => (
          <span key={`${node.id}-${index}`} className="contents">
            {index > 0 && <span className="text-secondary">→</span>}
            <SelectNodeButton
              nodeId={node.id}
              onSelectNode={onSelectNode}
              className="flex items-center gap-1.5"
            >
              <NodeIcon node={node} small />
              {describeNode(node)}
            </SelectNodeButton>
          </span>
        ))}
      </div>
      {!path.complete && (
        <p className="mt-1 text-label-value-12 text-secondary">
          Downstream endpoint is not visible.
        </p>
      )}
    </div>
  )
}

function InlineBridgeList({
  bridges,
  prefix,
  hangingPrefix,
}: {
  bridges: UsedInProjectWithIcon[]
  prefix?: string
  hangingPrefix?: boolean
}) {
  const unique = uniqueBridges(bridges)
  if (unique.length === 0) return null

  const bridgeLinks = unique.map((bridge) => (
    <a
      key={bridge.id}
      href={bridge.url}
      className="inline-flex min-w-0 items-center gap-1 hover:text-brand"
    >
      <img
        src={bridge.icon}
        alt=""
        className="size-3.5 shrink-0 rounded-full"
      />
      <span className="truncate">{bridge.name}</span>
    </a>
  ))

  if (prefix && hangingPrefix) {
    return (
      <div className="flex min-w-0 items-start gap-x-2 text-label-value-12">
        <span className="shrink-0 text-secondary">{prefix}</span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          {bridgeLinks}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-label-value-12">
      {prefix && <span className="text-secondary">{prefix}</span>}
      {bridgeLinks.map((link, index) => (
        <span key={unique[index]?.id} className="contents">
          {index > 0 && <span className="text-secondary">·</span>}
          {link}
        </span>
      ))}
    </div>
  )
}

function NodeIcon({
  node,
  small,
}: {
  node: InteropTokenRelationsNode
  small?: boolean
}) {
  const icon =
    node.deployments.length > 1
      ? (node.bridges[0]?.icon ?? node.deployments[0]?.iconUrl)
      : (node.deployments[0]?.iconUrl ?? node.bridges[0]?.icon)

  if (!icon) {
    return (
      <span
        className={cn(
          'mt-0.5 shrink-0 rounded-full border border-divider bg-surface-secondary',
          small ? 'size-3.5' : 'size-5',
        )}
      />
    )
  }

  return (
    <img
      src={icon}
      alt=""
      className={cn(
        'mt-0.5 shrink-0 rounded-full',
        small ? 'size-3.5' : 'size-5',
      )}
    />
  )
}

function buildDetailsContext(
  graph: InteropTokenRelationsGraph,
  node: InteropTokenRelationsNode,
): DetailsContext {
  return {
    node,
    first: node.deployments[0],
    isGroup: node.deployments.length > 1,
    sameChainComparisons: getSameChainComparisons(graph, node),
    backingPaths: getBackingPaths(graph, node),
    backedPaths: getBackedPaths(graph, node),
  }
}

function getSameChainComparisons(
  graph: InteropTokenRelationsGraph,
  selectedNode: InteropTokenRelationsNode,
): SameChainComparison[] {
  const allDeployments = graph.nodes.flatMap((node) => {
    const directMinters = getDirectMinters(graph, node)
    return node.deployments.map((deployment) => ({
      deployment,
      nodeId: node.id,
      selected:
        node.id === selectedNode.id &&
        selectedNode.deployments.some(
          (candidate) => deploymentKey(candidate) === deploymentKey(deployment),
        ),
      directMinters,
    }))
  })

  return selectedNode.deployments
    .flatMap((selectedDeployment): SameChainComparison[] => {
      const sameChain = allDeployments.filter(
        (candidate) => candidate.deployment.chain === selectedDeployment.chain,
      )
      if (sameChain.length <= 1) return []

      const selected = sameChain.find(
        (candidate) =>
          candidate.selected &&
          deploymentKey(candidate.deployment) ===
            deploymentKey(selectedDeployment),
      )
      if (!selected) return []

      const ranked = sameChain.toSorted(compareDeploymentActivity)
      const selectedVolume = selected.deployment.volume
      const selectedRank =
        selectedVolume === null
          ? undefined
          : 1 +
            ranked.filter(
              (candidate) =>
                candidate.deployment.volume !== null &&
                candidate.deployment.volume > selectedVolume,
            ).length
      const selectedRankSize =
        selectedVolume === null
          ? 0
          : ranked.filter(
              (candidate) => candidate.deployment.volume === selectedVolume,
            ).length

      return [
        {
          chain: selectedDeployment.chain,
          chainName: selectedDeployment.chainName,
          iconUrl: selectedDeployment.iconUrl,
          selected,
          ranked,
          selectedRank,
          selectedRankSize,
        },
      ]
    })
    .toSorted(
      (a, b) =>
        Number(a.selectedRank === 1) - Number(b.selectedRank === 1) ||
        (b.selected.deployment.volume ?? -1) -
          (a.selected.deployment.volume ?? -1) ||
        a.chainName.localeCompare(b.chainName),
    )
}

function compareDeploymentActivity(
  a: SameChainDeployment,
  b: SameChainDeployment,
): number {
  return (
    (b.deployment.volume ?? -1) - (a.deployment.volume ?? -1) ||
    deploymentKey(a.deployment).localeCompare(deploymentKey(b.deployment))
  )
}

function getDirectMinters(
  graph: InteropTokenRelationsGraph,
  node: InteropTokenRelationsNode,
): UsedInProjectWithIcon[] {
  if (node.bridges.length > 0) return uniqueBridges(node.bridges)
  return uniqueBridges(
    graph.edges
      .filter((edge) => edge.to === node.id)
      .flatMap((edge) => edge.bridges),
  )
}

function getBackingPaths(
  graph: InteropTokenRelationsGraph,
  selected: InteropTokenRelationsNode,
): BackingPath[] {
  const maxDepth = 10
  const maxPaths = 16
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  const incomingByNode = new Map<string, InteropTokenRelationsEdge[]>()
  for (const edge of graph.edges) {
    const incoming = incomingByNode.get(edge.to) ?? []
    incoming.push(edge)
    incomingByNode.set(edge.to, incoming)
  }

  function walk(
    current: InteropTokenRelationsNode,
    visited: Set<string>,
    depth: number,
  ): BackingPath[] {
    if (depth >= maxDepth) {
      return [{ nodes: [current], edges: [], complete: false }]
    }

    const incoming = (incomingByNode.get(current.id) ?? [])
      .filter((edge) => nodesById.has(edge.from))
      .toSorted((a, b) => {
        const aNode = nodesById.get(a.from)
        const bNode = nodesById.get(b.from)
        return (
          (bNode?.volume ?? -1) - (aNode?.volume ?? -1) ||
          a.from.localeCompare(b.from)
        )
      })

    if (incoming.length === 0) {
      return [{ nodes: [current], edges: [], complete: true }]
    }

    const paths: BackingPath[] = []
    for (const edge of incoming) {
      const source = nodesById.get(edge.from)
      if (!source || visited.has(source.id)) {
        paths.push({ nodes: [current], edges: [], complete: false })
      } else {
        const sourcePaths = walk(
          source,
          new Set([...visited, source.id]),
          depth + 1,
        )
        for (const sourcePath of sourcePaths) {
          paths.push({
            nodes: [...sourcePath.nodes, current],
            edges: [...sourcePath.edges, edge],
            complete: sourcePath.complete,
          })
          if (paths.length >= maxPaths) break
        }
      }
      if (paths.length >= maxPaths) break
    }

    return paths.length > 0
      ? paths
      : [{ nodes: [current], edges: [], complete: false }]
  }

  return walk(selected, new Set([selected.id]), 0).toSorted(
    (a, b) =>
      Number(b.complete) - Number(a.complete) ||
      b.nodes.length - a.nodes.length ||
      (b.nodes[0]?.volume ?? -1) - (a.nodes[0]?.volume ?? -1) ||
      pathKey(a).localeCompare(pathKey(b)),
  )
}

function getBackedPaths(
  graph: InteropTokenRelationsGraph,
  selected: InteropTokenRelationsNode,
): BackingPath[] {
  const maxDepth = 10
  const maxPaths = 16
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  const outgoingByNode = new Map<string, InteropTokenRelationsEdge[]>()
  for (const edge of graph.edges) {
    const outgoing = outgoingByNode.get(edge.from) ?? []
    outgoing.push(edge)
    outgoingByNode.set(edge.from, outgoing)
  }

  function walk(
    current: InteropTokenRelationsNode,
    visited: Set<string>,
    depth: number,
  ): BackingPath[] {
    if (depth >= maxDepth) {
      return [{ nodes: [current], edges: [], complete: false }]
    }

    const outgoing = (outgoingByNode.get(current.id) ?? [])
      .filter((edge) => nodesById.has(edge.to))
      .toSorted((a, b) => {
        const aNode = nodesById.get(a.to)
        const bNode = nodesById.get(b.to)
        return (
          (bNode?.volume ?? -1) - (aNode?.volume ?? -1) ||
          a.to.localeCompare(b.to)
        )
      })

    if (outgoing.length === 0) {
      return [{ nodes: [current], edges: [], complete: true }]
    }

    const paths: BackingPath[] = []
    for (const edge of outgoing) {
      const target = nodesById.get(edge.to)
      if (!target || visited.has(target.id)) {
        paths.push({ nodes: [current], edges: [], complete: false })
      } else {
        const targetPaths = walk(
          target,
          new Set([...visited, target.id]),
          depth + 1,
        )
        for (const targetPath of targetPaths) {
          paths.push({
            nodes: [current, ...targetPath.nodes],
            edges: [edge, ...targetPath.edges],
            complete: targetPath.complete,
          })
          if (paths.length >= maxPaths) break
        }
      }
      if (paths.length >= maxPaths) break
    }

    return paths.length > 0
      ? paths
      : [{ nodes: [current], edges: [], complete: false }]
  }

  return walk(selected, new Set([selected.id]), 0).toSorted(
    (a, b) =>
      Number(b.complete) - Number(a.complete) ||
      b.nodes.length - a.nodes.length ||
      (b.nodes.at(-1)?.volume ?? -1) - (a.nodes.at(-1)?.volume ?? -1) ||
      pathKey(a).localeCompare(pathKey(b)),
  )
}

function transferVolume(context: DetailsContext): string {
  const volume = context.node.volume
  return volume === null || volume === undefined
    ? '—'
    : formatCurrency(volume, 'usd')
}

function transferCount(context: DetailsContext): string {
  return formatTransferCount(context.node.transferCount)
}

function transferTime(context: DetailsContext): string {
  return formatDuration(context.node.avgDuration)
}

function formatTransferCount(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : formatInteger(value)
}

function formatDuration(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : formatSeconds(value)
}

function sameChainRankLabel(comparison: SameChainComparison): string {
  if (comparison.selectedRank === undefined) return 'No activity rank'
  if (comparison.selectedRank === 1 && comparison.selectedRankSize > 1) {
    return `Tied #1 of ${comparison.ranked.length}`
  }
  if (comparison.selectedRank === 1) {
    return `Most active of ${comparison.ranked.length}`
  }
  return `#${comparison.selectedRank} of ${comparison.ranked.length}`
}

function deploymentActivityRank(
  ranked: SameChainDeployment[],
  item: SameChainDeployment,
): number | undefined {
  const volume = item.deployment.volume
  if (volume === null) return undefined
  return (
    1 +
    ranked.filter(
      (candidate) =>
        candidate.deployment.volume !== null &&
        candidate.deployment.volume > volume,
    ).length
  )
}

function activityBarWidth(volume: number | null, maxVolume: number): number {
  if (volume === null || maxVolume <= 0) return 0
  return Math.max(2, Math.min(100, (volume / maxVolume) * 100))
}

function formatDeploymentVolume(volume: number | null): string {
  return volume === null ? '—' : formatCurrency(volume, 'usd')
}

function shortDeploymentAddress(address: string): string {
  if (address === 'native' || address.length <= 12) return address
  return formatAddress(address)
}

function DeploymentAddress({
  deployment,
}: {
  deployment: InteropTokenRelationsDeployment
}) {
  const label = shortDeploymentAddress(deployment.address)
  return deployment.explorerUrl ? (
    <CustomLink href={deployment.explorerUrl}>{label}</CustomLink>
  ) : (
    <span className="text-secondary">{label}</span>
  )
}

function deploymentKey(
  deployment: Pick<InteropTokenRelationsDeployment, 'chain' | 'address'>,
): string {
  return `${deployment.chain}|${deployment.address.toLowerCase()}`
}

function pathKey(path: BackingPath): string {
  return path.nodes.map((node) => node.id).join('>')
}

function describeNode(node: InteropTokenRelationsNode): string {
  const first = node.deployments[0]
  if (!first) return 'Unknown deployment'
  if (node.deployments.length > 1) {
    return `${first.symbol} across ${node.deployments.length} chains`
  }
  return `${first.symbol} on ${first.chainName}`
}

function uniqueBridges(
  bridges: UsedInProjectWithIcon[],
): UsedInProjectWithIcon[] {
  return [
    ...new Map(bridges.map((bridge) => [bridge.id, bridge])).values(),
  ].toSorted((a, b) => a.name.localeCompare(b.name))
}
