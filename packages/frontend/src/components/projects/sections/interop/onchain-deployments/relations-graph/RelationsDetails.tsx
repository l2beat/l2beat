import { useMemo } from 'react'
import { CloseIcon } from '~/icons/Close'
import { ChainIcon } from '~/pages/interop/components/ChainIcon'
import type {
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import {
  describeNode,
  getRelationsPaths,
  getSameChainComparisons,
  groupBackedPaths,
  isCluster,
  type RelationsPath,
  type SameChainComparison,
} from './graphSelectors'
import {
  Address,
  BridgeIcons,
  BridgeList,
  MoreNote,
  Muted,
  NodeButton,
  NodeIcon,
  Section,
  Stats,
  Volume,
} from './RelationsPrimitives'

const MAX_COMPARISONS = 3
const MAX_RANKED_ROWS = 4
const MAX_BACKING_PATHS = 2
const MAX_DIRECT_BACKED = 6
const MAX_NESTED_BACKED = 3

interface Props {
  graph: InteropTokenRelationsGraph
  node: InteropTokenRelationsNode
  onSelectNode: (id: string) => void
  onClose: () => void
}

export function RelationsDetails({
  graph,
  node,
  onSelectNode,
  onClose,
}: Props) {
  if (node.deployments.length === 0) return null
  return (
    <div className="flex h-full flex-col divide-y divide-divider overflow-y-auto rounded-lg border border-divider bg-surface-primary px-4 shadow-xl">
      <Header node={node} onClose={onClose} />
      <Section
        title="Past 24h crosschain activity"
        hint={
          isCluster(node)
            ? 'Each transfer touching the cluster is counted once, so this is less than the sum of its deployments.'
            : undefined
        }
      >
        <Stats stats={node} />
      </Section>
      <SameChainSection graph={graph} node={node} onSelectNode={onSelectNode} />
      <BackedBySection graph={graph} node={node} onSelectNode={onSelectNode} />
      <BacksSection graph={graph} node={node} onSelectNode={onSelectNode} />
    </div>
  )
}

interface SectionProps {
  graph: InteropTokenRelationsGraph
  node: InteropTokenRelationsNode
  onSelectNode: (id: string) => void
}

function Header({
  node,
  onClose,
}: {
  node: InteropTokenRelationsNode
  onClose: () => void
}) {
  const first = node.deployments[0]
  if (!first) return null
  const cluster = isCluster(node)
  return (
    <header className="flex items-start justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {cluster ? (
          <span className="-space-x-2 flex shrink-0">
            {node.deployments.slice(0, 3).map((deployment) => (
              <span
                key={`${deployment.chain.id}|${deployment.address}`}
                className="rounded-full border-2 border-surface-primary bg-surface-primary"
              >
                <ChainIcon iconUrl={deployment.chain.iconUrl} alt="" />
              </span>
            ))}
          </span>
        ) : (
          <ChainIcon iconUrl={first.chain.iconUrl} alt="" />
        )}
        <div className="min-w-0">
          <p className="truncate font-bold text-heading-18 leading-none">
            {first.symbol}
          </p>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-label-value-13 text-secondary">
            {cluster ? (
              `${node.deployments.length} deployments · burn & mint`
            ) : (
              <>
                <span className="truncate">{first.chain.name}</span>
                <span>·</span>
                <Address deployment={first} className="text-label-value-13" />
              </>
            )}
          </p>
          {cluster && (
            <BridgeList
              prefix="via"
              bridges={node.bridges}
              fallback="Bridge not identified"
              className="mt-1"
            />
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="-mr-1.5 flex size-7 shrink-0 items-center justify-center rounded-md text-secondary hover:bg-surface-secondary hover:text-primary"
      >
        <CloseIcon className="size-3 fill-current" />
      </button>
    </header>
  )
}

function SameChainSection({ graph, node, onSelectNode }: SectionProps) {
  const comparisons = useMemo(
    () => getSameChainComparisons(graph, node),
    [graph, node],
  )
  return (
    <Section title="Same-chain activity">
      {comparisons.length === 0 ? (
        <Muted>
          {isCluster(node)
            ? 'No member chain has another deployment of this token.'
            : `The only deployment of this token on ${node.deployments[0]?.chain.name}.`}
        </Muted>
      ) : (
        <div className="space-y-5">
          {comparisons.slice(0, MAX_COMPARISONS).map((comparison) => (
            <SameChainComparisonView
              key={comparison.chain.id}
              comparison={comparison}
              onSelectNode={onSelectNode}
            />
          ))}
          <MoreNote count={comparisons.length - MAX_COMPARISONS} noun="chain" />
        </div>
      )}
    </Section>
  )
}

function BackedBySection({ graph, node, onSelectNode }: SectionProps) {
  const paths = useMemo(
    () => getRelationsPaths(graph, node.id, 'backing'),
    [graph, node],
  )
  return (
    <Section title="Backed by">
      {paths.length === 0 ? (
        <Muted>
          No upstream backing observed. This is a source deployment.
        </Muted>
      ) : (
        <div className="space-y-4">
          {paths.slice(0, MAX_BACKING_PATHS).map((path, index) => (
            <BackingPath
              key={pathKey(path)}
              path={path}
              label={paths.length > 1 ? `Source path ${index + 1}` : undefined}
              onSelectNode={onSelectNode}
            />
          ))}
          <MoreNote
            count={paths.length - MAX_BACKING_PATHS}
            noun="source path"
          />
        </div>
      )}
    </Section>
  )
}

function BacksSection({ graph, node, onSelectNode }: SectionProps) {
  const { direct, nested } = useMemo(
    () => groupBackedPaths(getRelationsPaths(graph, node.id, 'backed')),
    [graph, node],
  )
  return (
    <Section title="Backs">
      {direct.length === 0 ? (
        <Muted>Backs no other deployment.</Muted>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2.5">
            {direct
              .slice(0, MAX_DIRECT_BACKED)
              .map(({ node: other, bridges }) => (
                <li
                  key={other.id}
                  className="flex items-center justify-between gap-3 text-label-value-13"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <NodeIcon node={other} />
                    <NodeButton
                      node={other}
                      onSelectNode={onSelectNode}
                      className="font-medium"
                    />
                    {isAmbiguous(other, direct) && other.deployments[0] && (
                      <Address deployment={other.deployments[0]} />
                    )}
                  </span>
                  <BridgeIcons bridges={bridges} />
                </li>
              ))}
            <MoreNote
              count={direct.length - MAX_DIRECT_BACKED}
              noun="deployment"
            />
          </ul>
          {nested.length > 0 && (
            <div>
              <Muted className="mb-2">Further downstream</Muted>
              <div className="space-y-2">
                {nested.slice(0, MAX_NESTED_BACKED).map((path) => (
                  <BackedPath
                    key={pathKey(path)}
                    path={path}
                    onSelectNode={onSelectNode}
                  />
                ))}
                <MoreNote
                  count={nested.length - MAX_NESTED_BACKED}
                  noun="downstream path"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  )
}

function SameChainComparisonView({
  comparison,
  onSelectNode,
}: {
  comparison: SameChainComparison
  onSelectNode: (id: string) => void
}) {
  const maxVolume = Math.max(
    0,
    ...comparison.ranked.map((item) => item.deployment.volume ?? 0),
  )
  // The selected deployment stays visible even when it ranks below the cut.
  const shown = comparison.ranked.filter(
    (item, index) => index < MAX_RANKED_ROWS || item.selected,
  )
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-label-value-12">
        <span className="flex min-w-0 items-center gap-1.5 font-medium">
          <ChainIcon iconUrl={comparison.chain.iconUrl} alt="" />
          <span className="truncate">{comparison.chain.name}</span>
        </span>
        <span className="shrink-0 text-secondary">
          {comparison.rank === undefined
            ? 'no volume data'
            : `#${comparison.rank} of ${comparison.ranked.length} by volume`}
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {shown.map((item) => (
          <li key={`${item.node.id}|${item.deployment.address}`}>
            <div className="flex items-center justify-between gap-3 text-label-value-13">
              <span className="flex min-w-0 items-baseline gap-1.5">
                {item.selected ? (
                  <span className="font-bold">{item.deployment.symbol}</span>
                ) : (
                  <NodeButton
                    node={item.node}
                    onSelectNode={onSelectNode}
                    className="font-medium"
                  >
                    {item.deployment.symbol}
                  </NodeButton>
                )}
                <Address deployment={item.deployment} />
              </span>
              <Volume
                value={item.deployment.volume}
                className={item.selected ? 'font-bold' : 'text-secondary'}
              />
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-secondary">
              <div
                className={cn(
                  'h-full rounded-full',
                  item.selected ? 'bg-brand' : 'bg-secondary/40',
                )}
                style={{
                  width: `${barWidth(item.deployment.volume, maxVolume)}%`,
                }}
              />
            </div>
          </li>
        ))}
        <MoreNote
          count={comparison.ranked.length - shown.length}
          noun="deployment"
        />
      </ul>
    </div>
  )
}

/** Same symbol on the same chain reads identically, so the address has to tell them apart. */
function isAmbiguous(
  node: InteropTokenRelationsNode,
  among: { node: InteropTokenRelationsNode }[],
): boolean {
  const label = describeNode(node)
  return among.filter((other) => describeNode(other.node) === label).length > 1
}

function barWidth(volume: number | null, maxVolume: number): number {
  if (!volume || maxVolume <= 0) return 0
  return Math.max(2, (volume / maxVolume) * 100)
}

function BackingPath({
  path,
  label,
  onSelectNode,
}: {
  path: RelationsPath
  label: string | undefined
  onSelectNode: (id: string) => void
}) {
  const steps = path.nodes.slice(0, -1)
  return (
    <div className="text-label-value-12">
      {label && <p className="mb-1.5 text-secondary">{label}</p>}
      {steps.map((node, index) => (
        <div key={node.id}>
          <NodeButton
            node={node}
            onSelectNode={onSelectNode}
            className="font-medium"
          />
          <div className="my-1 ml-1.5 border-divider border-l py-1 pl-3">
            <BridgeList
              prefix="Minted by"
              bridges={path.edges[index]?.bridges ?? []}
              fallback="Bridge not identified"
            />
          </div>
        </div>
      ))}
      <p className="ml-1.5 border-brand border-l-2 pl-3 font-medium text-brand">
        This deployment
      </p>
      {!path.complete && (
        <Muted className="mt-1">
          Upstream source is not visible beyond this point.
        </Muted>
      )}
    </div>
  )
}

function BackedPath({
  path,
  onSelectNode,
}: {
  path: RelationsPath
  onSelectNode: (id: string) => void
}) {
  return (
    <div className="text-label-value-12">
      <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
        {path.nodes.slice(1).map((node) => (
          <span key={node.id} className="flex items-center gap-1.5">
            <span className="text-secondary">→</span>
            <NodeButton
              node={node}
              onSelectNode={onSelectNode}
              className="font-medium"
            />
          </span>
        ))}
      </span>
      <BridgeList
        prefix="last hop via"
        bridges={path.edges.at(-1)?.bridges ?? []}
        fallback="Bridge not identified"
        className="mt-0.5"
      />
    </div>
  )
}

function pathKey(path: RelationsPath): string {
  return path.nodes.map((node) => node.id).join('>')
}
