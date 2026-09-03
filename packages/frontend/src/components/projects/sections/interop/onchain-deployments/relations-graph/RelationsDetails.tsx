import {
  formatCurrency,
  formatInteger,
  formatSeconds,
} from '@l2beat/shared-pure'
import { type ReactNode, useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { CloseIcon } from '~/icons/Close'
import { InfoIcon } from '~/icons/Info'
import { ChainIcon } from '~/pages/interop/components/ChainIcon'
import type {
  InteropTokenRelationsDeployment,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import type { InteropTokenStats } from '~/server/features/layer2s/interop/utils/aggregatePairStats'
import { cn } from '~/utils/cn'
import {
  describeNode,
  getMinters,
  getRelationsPaths,
  getSameChainAlternatives,
  isCluster,
  type RelationsPath,
} from './graphSelectors'
import { shortAddress } from './RelationsNode'

const MAX_BACKING_PATHS = 2
const MAX_BACKED_PATHS = 3

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
  const details = useMemo(
    () => ({
      backing: getRelationsPaths(graph, node.id, 'backing'),
      backed: getRelationsPaths(graph, node.id, 'backed'),
      alternatives: getSameChainAlternatives(graph, node),
    }),
    [graph, node],
  )
  const first = node.deployments[0]
  if (!first) return null
  const cluster = isCluster(node)

  return (
    <div className="flex h-full flex-col divide-y divide-divider overflow-y-auto rounded-lg border border-divider bg-surface-primary px-4 shadow-xl">
      <header className="flex items-start justify-between gap-3 py-4">
        <div className="flex min-w-0 items-center gap-3">
          {cluster ? (
            <span className="-space-x-2 flex shrink-0">
              {node.deployments.slice(0, 3).map((deployment) => (
                <span
                  key={`${deployment.chain.name}|${deployment.address}`}
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
            <p className="mt-1 truncate text-label-value-13 text-secondary">
              {cluster
                ? `${node.deployments.length} deployments · burn & mint`
                : first.chain.name}
            </p>
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
      {!cluster && (
        <div className="flex items-center justify-between py-3 text-label-value-13">
          <span className="text-secondary">Address</span>
          <Address deployment={first} />
        </div>
      )}

      <Section
        title="Past 24h crosschain activity"
        hint={
          cluster
            ? 'Each transfer touching the cluster is counted once, so this is less than the sum of its deployments.'
            : undefined
        }
      >
        <Stats stats={node} />
      </Section>

      {cluster && (
        <Section title="Deployments">
          <ul className="divide-y divide-divider">
            {node.deployments.map((deployment) => (
              <li
                key={`${deployment.chain.name}|${deployment.address}`}
                className="flex items-center justify-between gap-2 py-2 text-label-value-13"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <ChainIcon iconUrl={deployment.chain.iconUrl} alt="" />
                  <span className="truncate">{deployment.chain.name}</span>
                  <Address deployment={deployment} />
                </span>
                <Volume value={deployment.volume} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Backed by">
        {details.backing.length === 0 ? (
          <Muted>
            No upstream backing observed. This is a source deployment.
          </Muted>
        ) : (
          <div className="space-y-4">
            {details.backing.slice(0, MAX_BACKING_PATHS).map((path, index) => (
              <BackingPath
                key={pathKey(path)}
                path={path}
                label={
                  details.backing.length > 1
                    ? `Source path ${index + 1}`
                    : undefined
                }
                onSelectNode={onSelectNode}
              />
            ))}
            <MoreNote
              count={details.backing.length - MAX_BACKING_PATHS}
              noun="source path"
            />
          </div>
        )}
      </Section>

      <Section title="Backs">
        {details.backed.length === 0 ? (
          <Muted>Backs no other deployment.</Muted>
        ) : (
          <div className="space-y-2">
            {details.backed.slice(0, MAX_BACKED_PATHS).map((path) => (
              <BackedPath
                key={pathKey(path)}
                path={path}
                onSelectNode={onSelectNode}
              />
            ))}
            <MoreNote
              count={details.backed.length - MAX_BACKED_PATHS}
              noun="downstream path"
            />
          </div>
        )}
      </Section>

      {details.alternatives.map((group) => (
        <Section key={group.chain.name} title={`Also on ${group.chain.name}`}>
          <ul className="divide-y divide-divider">
            {group.others.map(({ node: other, deployment }) => (
              <li
                key={`${other.id}|${deployment.address}`}
                className="flex items-center justify-between gap-2 py-2 text-label-value-13"
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5">
                    <NodeButton node={other} onSelectNode={onSelectNode}>
                      {deployment.symbol}
                    </NodeButton>
                    <Address deployment={deployment} />
                  </span>
                  <BridgeList
                    prefix="Minted by"
                    bridges={getMinters(graph, other)}
                  />
                </span>
                <Volume value={deployment.volume} />
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </div>
  )
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
      <div className="mt-0.5">
        <BridgeList prefix="via" bridges={path.edges[0]?.bridges ?? []} />
      </div>
    </div>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <section className="py-4">
      <p className="flex items-center gap-1 font-medium text-paragraph-12 text-secondary">
        {title}
        {hint && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3 fill-current" />
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        )}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function Stats({ stats }: { stats: InteropTokenStats }) {
  const items = [
    [
      'Volume',
      stats.volume === null ? '—' : formatCurrency(stats.volume, 'usd'),
    ],
    [
      'Transfers',
      stats.transferCount === null ? '—' : formatInteger(stats.transferCount),
    ],
    [
      'Avg. time',
      stats.avgDuration === null ? '—' : formatSeconds(stats.avgDuration),
    ],
  ]
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p className="font-medium text-paragraph-12 text-secondary">
            {label}
          </p>
          <p
            className="mt-1 truncate font-bold text-label-value-16 tabular-nums leading-none"
            title={value}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

function NodeButton({
  node,
  onSelectNode,
  className,
  children,
}: {
  node: InteropTokenRelationsNode
  onSelectNode: (id: string) => void
  className?: string
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectNode(node.id)}
      className={cn(
        'truncate text-left hover:text-brand hover:underline',
        className,
      )}
    >
      {children ?? describeNode(node)}
    </button>
  )
}

function BridgeList({
  prefix,
  bridges,
}: {
  prefix: string
  bridges: ProjectIconListItem[]
}) {
  if (bridges.length === 0) return <Muted>Bridge not identified</Muted>
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-label-value-12 text-secondary">
      {prefix}
      {bridges.map((bridge) => (
        <CustomLink
          key={bridge.id}
          href={bridge.href}
          className="flex items-center gap-1 text-primary"
        >
          <img src={bridge.iconUrl} alt="" className="size-3.5 rounded-full" />
          {bridge.name}
        </CustomLink>
      ))}
    </span>
  )
}

function Address({
  deployment,
  className,
}: {
  deployment: InteropTokenRelationsDeployment
  className?: string
}) {
  const label = shortAddress(deployment.address)
  return deployment.explorerUrl ? (
    <CustomLink
      href={deployment.explorerUrl}
      className={cn('text-label-value-12', className)}
    >
      {label}
    </CustomLink>
  ) : (
    <span className={cn('text-label-value-12 text-secondary', className)}>
      {label}
    </span>
  )
}

function Volume({ value }: { value: number | null }) {
  return (
    <span className="shrink-0 font-medium tabular-nums">
      {value === null ? '—' : formatCurrency(value, 'usd')}
    </span>
  )
}

function Muted({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <p className={cn('text-label-value-12 text-secondary', className)}>
      {children}
    </p>
  )
}

function MoreNote({ count, noun }: { count: number; noun: string }) {
  if (count <= 0) return null
  return (
    <Muted>
      +{count} other {noun}
      {count === 1 ? '' : 's'}
    </Muted>
  )
}

function pathKey(path: RelationsPath): string {
  return path.nodes.map((node) => node.id).join('>')
}
