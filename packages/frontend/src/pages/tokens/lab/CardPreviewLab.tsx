import {
  formatAddress,
  formatCurrency,
  formatInteger,
  formatSeconds,
} from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type {
  InteropTokenRelationsDeployment,
  InteropTokenRelationsEdge,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { TokenLayoutLabToken } from './getTokenLayoutLabPageData'

type PanelVariant =
  | 'current'
  | 'direct-minter'
  | 'dependency-stack'
  | 'contract-dossier'
  | 'activity-detail'
  | 'risk-summary'
  | 'minimal-complement'
  | 'balanced'

interface PanelOptionDefinition {
  number: string
  title: string
  forWhom: string
  strength: string
  tradeoff: string
  variant: PanelVariant
}

const OPTIONS: PanelOptionDefinition[] = [
  {
    number: '1',
    title: 'Quiet sections',
    forWhom: 'A general visitor reading the panel from top to bottom',
    strength: 'Flat sections, one activity strip, and no nested cards.',
    tradeoff: 'The backing explanation still comes after activity.',
    variant: 'current',
  },
  {
    number: '2',
    title: 'Backing first',
    forWhom: 'A risk-focused holder starting with minting dependencies',
    strength: 'The source path and downstream representations lead the panel.',
    tradeoff: 'Transfer activity becomes secondary.',
    variant: 'direct-minter',
  },
  {
    number: '3',
    title: 'Single journey',
    forWhom: 'A researcher tracing from the ultimate source through this token',
    strength: 'A single flow separates upstream backing from what this backs.',
    tradeoff: 'The flow takes more vertical space than a ledger.',
    variant: 'dependency-stack',
  },
  {
    number: '4',
    title: 'Activity first',
    forWhom: 'A bridge user first checking whether this instance is used',
    strength: 'Volume, count, time, and same-chain position are immediate.',
    tradeoff: 'Backing risk starts lower in the panel.',
    variant: 'contract-dossier',
  },
  {
    number: '5',
    title: 'Comparison first',
    forWhom: 'A holder choosing between several instances on one chain',
    strength:
      'The selected instance and its same-chain alternatives are easiest to compare.',
    tradeoff: 'The backing relationships are less prominent.',
    variant: 'activity-detail',
  },
  {
    number: '6',
    title: 'Plain answers',
    forWhom:
      'A newcomer who thinks in concrete questions rather than graph terms',
    strength: 'Turns every required fact into a direct answer.',
    tradeoff: 'Less visually scannable for repeat visitors.',
    variant: 'risk-summary',
  },
  {
    number: '7',
    title: 'Compact ledger',
    forWhom: 'A frequent visitor scanning many selected nodes',
    strength: 'Fits every required fact into dense aligned rows.',
    tradeoff: 'Backing paths lose some visual storytelling.',
    variant: 'minimal-complement',
  },
  {
    number: '8',
    title: 'Balanced summary',
    forWhom:
      'A holder balancing backing risk and which same-chain instance is used',
    strength:
      'Keeps activity and comparison clear, then summarizes both paths.',
    tradeoff: 'Only the primary upstream and downstream path is expanded.',
    variant: 'balanced',
  },
]

type NodeRole = 'destination' | 'source' | 'transit' | 'cluster' | 'unconnected'

interface RelationWithNode {
  edge: InteropTokenRelationsEdge
  node: InteropTokenRelationsNode
}

interface BackingPath {
  nodes: InteropTokenRelationsNode[]
  edges: InteropTokenRelationsEdge[]
  complete: boolean
}

interface MemberActivity {
  deployment: InteropTokenRelationsDeployment
  stats: TokenLayoutLabToken['deployments'][number] | undefined
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

interface PanelContext {
  token: TokenLayoutLabToken
  node: InteropTokenRelationsNode
  first: InteropTokenRelationsDeployment | undefined
  isGroup: boolean
  role: NodeRole
  incoming: RelationWithNode[]
  outgoing: RelationWithNode[]
  backingPaths: BackingPath[]
  primaryBackingPath: BackingPath
  primarySource: InteropTokenRelationsNode
  backedPaths: BackingPath[]
  primaryBackedPath: BackingPath
  stats: TokenLayoutLabToken['deployments'][number] | undefined
  memberActivity: MemberActivity[]
  sameChainComparisons: SameChainComparison[]
}

export function CardPreviewLab({ token }: { token: TokenLayoutLabToken }) {
  const nodes = useMemo(() => sortNodes(token.graph), [token.graph])
  const [selectedNodeId, setSelectedNodeId] = useState(
    () => pickInitialNode(token.graph)?.id,
  )
  const node =
    nodes.find((candidate) => candidate.id === selectedNodeId) ?? nodes[0]
  const context = useMemo(
    () => (node ? buildPanelContext(token, node) : undefined),
    [node, token],
  )

  if (!node || !context) {
    return (
      <p className="text-label-value-14 text-secondary">
        This token has no supported deployments to preview.
      </p>
    )
  }

  return (
    <section>
      <header className="mb-4">
        <h2 className="font-bold text-heading-20">
          Selected-token panel experiments
        </h2>
        <p className="max-w-5xl text-label-value-13 text-secondary">
          Eight hierarchies for the same required information at the production
          panel width.
        </p>
      </header>

      <div className="mb-4 rounded-lg border border-brand/30 bg-brand/5 p-3 text-label-value-12">
        <p className="font-bold">Required in every option</p>
        <p className="mt-1 text-secondary">
          Past 24h crosschain transfer volume and count, average transfer time,
          what this is backed by, what this is backing, and its activity among
          other deployments on the same chain.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-divider bg-surface-secondary p-3">
        <label className="min-w-[280px] flex-1">
          <span className="mb-1 block font-medium text-label-value-12 text-secondary">
            Selected graph node
          </span>
          <select
            value={node.id}
            onChange={(event) => setSelectedNodeId(event.target.value)}
            className="h-10 w-full rounded-md border border-divider bg-surface-primary px-3 font-medium text-label-value-13"
          >
            {nodes.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {describeNodeChoice(candidate)} ·{' '}
                {roleLabel(getNodeRole(token.graph, candidate))}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-md border border-divider bg-surface-primary px-3 py-2">
          <p className="text-label-value-12 text-secondary">
            Missing-detail shape
          </p>
          <p className="font-bold text-label-value-13">
            {context.primaryBackingPath.edges.length} upstream ·{' '}
            {context.outgoing.length} backed deployments ·{' '}
            {context.sameChainComparisons.length} contested chains
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {OPTIONS.map((option) => (
          <PanelOption key={option.number} option={option}>
            <PanelPreview context={context} variant={option.variant} />
          </PanelOption>
        ))}
      </div>
    </section>
  )
}

function PanelOption({
  option,
  children,
}: {
  option: PanelOptionDefinition
  children: ReactNode
}) {
  return (
    <article className="min-w-0">
      <div className="mb-3 min-h-[132px]">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand font-bold text-label-value-12 text-white">
            {option.number}
          </span>
          <h3 className="font-bold text-label-value-15">{option.title}</h3>
        </div>
        <p className="mt-1.5 text-label-value-12 text-secondary">
          <span className="font-medium text-primary">For:</span>{' '}
          {option.forWhom}
        </p>
        <p className="text-label-value-12">
          <span className="font-medium">Strength:</span> {option.strength}
        </p>
        <p className="text-label-value-12 text-secondary">
          <span className="font-medium">Tradeoff:</span> {option.tradeoff}
        </p>
      </div>
      <div className="flex min-h-[712px] items-start justify-center overflow-hidden rounded-xl border border-divider bg-surface-secondary p-4">
        <div className="h-[680px] w-[320px] max-w-full">{children}</div>
      </div>
    </article>
  )
}

function PanelPreview({
  context,
  variant,
}: {
  context: PanelContext
  variant: PanelVariant
}) {
  if (variant === 'current') {
    return <SectionedLedgerPanel context={context} />
  }
  if (variant === 'direct-minter')
    return <DirectMinterPanel context={context} />
  if (variant === 'dependency-stack') {
    return <DependencyStackPanel context={context} />
  }
  if (variant === 'contract-dossier') {
    return <ContractDossierPanel context={context} />
  }
  if (variant === 'activity-detail') {
    return <ActivityDetailPanel context={context} />
  }
  if (variant === 'risk-summary') return <RiskSummaryPanel context={context} />
  if (variant === 'minimal-complement') {
    return <MinimalComplementPanel context={context} />
  }
  return <BalancedPanel context={context} />
}

function SectionedLedgerPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <PanelSection title="Past 24h crosschain activity" className="mt-5">
        <TransferActivityBlock context={context} />
      </PanelSection>
      <PanelSection title="Same-chain activity">
        <SameChainComparisons context={context} compact />
      </PanelSection>
      <div className="mt-4">
        <BackingOverview context={context} />
      </div>
    </PanelShell>
  )
}

function DirectMinterPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <div className="mt-5">
        <BackingOverview context={context} />
      </div>
      <PanelSection title="Past 24h crosschain activity">
        <TransferActivityBlock context={context} compact />
      </PanelSection>
      <PanelSection title="Same-chain activity">
        <SameChainComparisons context={context} compact />
      </PanelSection>
    </PanelShell>
  )
}

function DependencyStackPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <PanelSection title="Backing journey" className="mt-5">
        <RelationshipJourney context={context} />
      </PanelSection>
      <PanelSection title="Past 24h crosschain activity">
        <TransferActivityBlock context={context} compact />
      </PanelSection>
      <PanelSection title="Same-chain activity">
        <SameChainComparisons context={context} compact />
      </PanelSection>
    </PanelShell>
  )
}

function ContractDossierPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <PanelSection title="Past 24h crosschain activity" className="mt-5">
        <TransferActivityBlock context={context} emphasis />
      </PanelSection>
      <PanelSection title="Same-chain activity">
        <SameChainComparisons context={context} detailed />
      </PanelSection>
      <div className="mt-4">
        <BackingOverview context={context} />
      </div>
    </PanelShell>
  )
}

function ActivityDetailPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <PanelSection title="Same-chain activity" className="mt-5">
        <p className="mb-3 text-label-value-12 text-secondary">
          Ranked by each deployment’s past 24h crosschain volume.
        </p>
        <SameChainComparisons context={context} detailed />
      </PanelSection>
      <PanelSection title="Past 24h crosschain activity">
        <TransferActivityBlock context={context} />
      </PanelSection>
      <div className="mt-4">
        <BackingOverview context={context} />
      </div>
    </PanelShell>
  )
}

function RiskSummaryPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <div className="mt-5 space-y-4">
        <AnswerBlock question="How much moved in the past 24 hours?">
          {transferSummary(context)}
        </AnswerBlock>
        <AnswerBlock question="What is it backed by, up to the source?">
          <BackingAncestry context={context} />
        </AnswerBlock>
        <AnswerBlock question="What does it back, through every layer?">
          <BackingDescendants context={context} />
        </AnswerBlock>
        <AnswerBlock question="Is this the active instance on its chain?">
          {sameChainSummary(context)}
        </AnswerBlock>
      </div>
    </PanelShell>
  )
}

function MinimalComplementPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <div className="mt-5 divide-y divide-divider border-divider border-y">
        <FactRow label="24h volume">{transferVolume(context)}</FactRow>
        <FactRow label="24h transfers">{transferCount(context)}</FactRow>
        <FactRow label="Avg. transfer time">{transferTime(context)}</FactRow>
        <FactRow label="Same-chain">{sameChainSummary(context, true)}</FactRow>
      </div>
      <div className="mt-4">
        <BackingOverview context={context} />
      </div>
    </PanelShell>
  )
}

function BalancedPanel({ context }: { context: PanelContext }) {
  return (
    <PanelShell>
      <PanelHeader context={context} />

      <PanelSection title="Past 24h crosschain activity" className="mt-5">
        <TransferActivityBlock context={context} />
      </PanelSection>
      <PanelSection title="Same-chain activity">
        <SameChainComparisons context={context} compact />
      </PanelSection>
      <div className="mt-4">
        <CompactRelationPaths context={context} />
      </div>
    </PanelShell>
  )
}

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto rounded-lg border border-divider bg-surface-primary p-4">
      {children}
    </aside>
  )
}

function PanelHeader({
  context,
  hideAddress,
}: {
  context: PanelContext
  hideAddress?: boolean
}) {
  return (
    <header>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-heading-18">
            {context.first?.symbol ?? context.token.symbol}
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
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-heading-20 text-secondary hover:bg-surface-secondary hover:text-primary"
        >
          ×
        </button>
      </div>
      {!hideAddress && !context.isGroup && context.first && (
        <p className="mt-2 text-label-value-13">
          {context.first.explorerUrl ? (
            <CustomLink href={context.first.explorerUrl}>
              {formatAddress(context.first.address)}
            </CustomLink>
          ) : (
            <span className="text-secondary">
              {formatAddress(context.first.address)}
            </span>
          )}
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
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-bold text-label-value-12 text-secondary">{children}</p>
  )
}

function TransferActivityBlock({
  context,
  compact,
  emphasis,
}: {
  context: PanelContext
  compact?: boolean
  emphasis?: boolean
}) {
  return (
    <div>
      <div
        className={cn(
          'grid grid-cols-3 divide-x divide-divider',
          compact && 'border-divider border-y py-2.5',
        )}
      >
        <ActivityStat
          label="Volume"
          value={transferVolume(context)}
          emphasis={emphasis}
        />
        <ActivityStat label="Transfers" value={transferCount(context)} />
        <ActivityStat label="Avg. time" value={transferTime(context)} />
      </div>
      {context.isGroup && (
        <p className="mt-1.5 text-label-value-12 text-secondary">
          Volume sums the cluster; count and time are for its busiest member.
        </p>
      )}
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

function BackingOverview({ context }: { context: PanelContext }) {
  return (
    <div className="space-y-4">
      <div>
        <RelationHeading>Backed by</RelationHeading>
        <div className="mt-2">
          <BackingAncestry context={context} />
        </div>
      </div>
      <div>
        <RelationHeading>Backs</RelationHeading>
        <div className="mt-2">
          <BackingDescendants context={context} />
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

function BackingAncestry({ context }: { context: PanelContext }) {
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
}: {
  path: BackingPath
  pathNumber?: number
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
                <p className="font-medium text-label-value-12">
                  {describeNode(node)}
                </p>
                {node.bridges.length > 0 && (
                  <InlineBridgeList
                    bridges={node.bridges}
                    prefix="Burn & mint via"
                  />
                )}
              </div>
            </div>
            <div className="ml-2.5 min-h-7 border-divider border-l py-1 pl-4">
              {edge && edge.bridges.length > 0 ? (
                <InlineBridgeList bridges={edge.bridges} prefix="via" />
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

function BackingDescendants({ context }: { context: PanelContext }) {
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
        <DirectBackedGroup key={group.key} group={group} />
      ))}
      {shownNested.map((path) => (
        <DownstreamPath key={pathKey(path)} path={path} />
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

function DirectBackedGroup({ group }: { group: DirectBackedPathGroup }) {
  const shown = group.nodes.slice(0, 4)
  return (
    <div>
      <InlineBridgeList bridges={group.bridges} prefix="via" />
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
        {shown.map((node) => (
          <span
            key={node.id}
            className="flex min-w-0 items-center gap-1.5 text-label-value-12"
          >
            <NodeIcon node={node} small />
            <span>{describeNode(node)}</span>
          </span>
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

function DownstreamPath({ path }: { path: BackingPath }) {
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
            <span className="flex items-center gap-1.5">
              <NodeIcon node={node} small />
              {describeNode(node)}
            </span>
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

function RelationshipJourney({ context }: { context: PanelContext }) {
  const upstreamNodes = context.primaryBackingPath.nodes
  const downstreamNodes = context.primaryBackedPath.nodes.slice(1)
  const nodes = [...upstreamNodes, ...downstreamNodes]
  const edges = [
    ...context.primaryBackingPath.edges,
    ...context.primaryBackedPath.edges,
  ]
  const selectedIndex = upstreamNodes.length - 1

  return (
    <div>
      {nodes.map((node, index) => (
        <div key={`${node.id}-${index}`}>
          <div className="flex items-start gap-2">
            <NodeIcon node={node} />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-label-value-12 text-secondary',
                  index === selectedIndex && 'font-bold text-brand',
                )}
              >
                {index === selectedIndex
                  ? 'This deployment'
                  : index < selectedIndex
                    ? index === 0
                      ? 'Source'
                      : 'Upstream'
                    : 'Backed deployment'}
              </p>
              <p className="font-medium text-label-value-12">
                {index === selectedIndex
                  ? 'Selected above'
                  : describeNode(node)}
              </p>
              {node.bridges.length > 0 && (
                <InlineBridgeList
                  bridges={node.bridges}
                  prefix="Burn & mint via"
                />
              )}
            </div>
          </div>
          {index < nodes.length - 1 && (
            <div className="ml-2.5 min-h-7 border-divider border-l py-1 pl-4">
              {edges[index]?.bridges.length ? (
                <InlineBridgeList
                  bridges={edges[index]?.bridges ?? []}
                  prefix="via"
                />
              ) : (
                <span className="text-label-value-12 text-secondary">
                  observed relation
                </span>
              )}
            </div>
          )}
        </div>
      ))}
      {(context.backingPaths.length > 1 || context.backedPaths.length > 1) && (
        <p className="mt-2 text-label-value-12 text-secondary">
          Main path shown · {context.backingPaths.length} upstream ·{' '}
          {context.backedPaths.length} downstream
        </p>
      )}
    </div>
  )
}

function CompactRelationPaths({ context }: { context: PanelContext }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="font-bold text-label-value-12 text-secondary">
          Backed by
        </p>
        <p className="mt-1 text-label-value-13">
          {compactBackingSummary(context)}
        </p>
        <div className="mt-1.5">
          <BridgePills
            bridges={[
              ...context.primaryBackingPath.nodes
                .slice(0, -1)
                .flatMap((node) => node.bridges),
              ...context.primaryBackingPath.edges.flatMap(
                (edge) => edge.bridges,
              ),
            ]}
          />
        </div>
      </div>
      <div>
        <p className="font-bold text-label-value-12 text-secondary">Backing</p>
        <p className="mt-1 text-label-value-13">
          {compactBackedSummary(context)}
        </p>
        <div className="mt-1.5">
          <BridgePills
            bridges={[
              ...context.primaryBackedPath.edges.flatMap(
                (edge) => edge.bridges,
              ),
              ...context.primaryBackedPath.nodes
                .slice(1)
                .flatMap((node) => node.bridges),
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function BridgePills({ bridges }: { bridges: UsedInProjectWithIcon[] }) {
  return <InlineBridgeList bridges={bridges} />
}

function InlineBridgeList({
  bridges,
  prefix,
}: {
  bridges: UsedInProjectWithIcon[]
  prefix?: string
}) {
  const unique = uniqueBridges(bridges)
  if (unique.length === 0) return null
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-label-value-12">
      {prefix && <span className="text-secondary">{prefix}</span>}
      {unique.map((bridge, index) => (
        <span key={bridge.id} className="contents">
          {index > 0 && <span className="text-secondary">·</span>}
          <a
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
        </span>
      ))}
    </div>
  )
}

function SameChainComparisons({
  context,
  detailed,
  compact,
}: {
  context: PanelContext
  detailed?: boolean
  compact?: boolean
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

  const topCount = comparisons.filter(
    (comparison) => comparison.selectedRank === 1,
  ).length
  const shown = comparisons.slice(0, detailed ? 3 : compact ? 1 : 2)

  return (
    <div>
      {context.isGroup && (
        <p className="mb-2 font-medium text-label-value-13">
          {topCount} of {comparisons.length} member{' '}
          {comparisons.length === 1 ? 'chain' : 'chains'} with alternatives{' '}
          {topCount === 1 ? 'has' : 'have'} this cluster at #1.
        </p>
      )}
      <div className="space-y-3">
        {shown.map((comparison) => (
          <SameChainComparisonView
            key={`${comparison.chain}|${deploymentKey(comparison.selected.deployment)}`}
            comparison={comparison}
            detailed={detailed && !context.isGroup}
          />
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
  detailed: _detailed,
}: {
  comparison: SameChainComparison
  detailed?: boolean
}) {
  const visible = comparison.ranked
  const maxVolume = Math.max(
    0,
    ...visible.map((item) => item.deployment.volume ?? 0),
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
      <div className="mt-2 space-y-2.5">
        {visible.map((item) => (
          <div
            key={`${item.nodeId}|${deploymentKey(item.deployment)}`}
            className={cn(
              'text-label-value-12',
              item.selected &&
                '-mx-2 rounded-r-md border-brand border-l-2 bg-brand/5 py-2 pr-2 pl-1.5',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">
                <span
                  className={cn(
                    'font-medium',
                    item.selected && 'font-bold text-brand',
                  )}
                >
                  {item.selected ? 'This deployment' : item.deployment.symbol}
                </span>{' '}
                <span className="text-secondary">
                  {shortDeploymentAddress(item.deployment.address)}
                </span>
              </span>{' '}
              <span
                className={cn(
                  'shrink-0 tabular-nums text-secondary',
                  item.selected && 'font-bold text-brand',
                )}
              >
                {formatDeploymentVolume(item.deployment.volume)}
              </span>
            </div>
            <DirectMinterLine minters={item.directMinters} />
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-secondary">
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
        ))}
      </div>
    </div>
  )
}

function DirectMinterLine({ minters }: { minters: UsedInProjectWithIcon[] }) {
  const shown = minters.slice(0, 2)
  if (shown.length === 0) return null
  return (
    <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 text-label-value-12 text-secondary">
      <span>{minters.length === 1 ? 'Direct minter' : 'Direct minters'}</span>
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

function activityBarWidth(volume: number | null, maxVolume: number): number {
  if (volume === null || maxVolume <= 0) return 0
  return Math.max(2, Math.min(100, (volume / maxVolume) * 100))
}

function AnswerBlock({
  question,
  children,
}: {
  question: string
  children: ReactNode
}) {
  return (
    <section>
      <p className="font-bold text-label-value-12 text-secondary">{question}</p>
      <div className="mt-1 text-label-value-13">{children}</div>
    </section>
  )
}

function FactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <span className="shrink-0 text-label-value-12 text-secondary">
        {label}
      </span>
      <span className="min-w-0 text-right font-medium text-label-value-13">
        {children}
      </span>
    </div>
  )
}

function buildPanelContext(
  token: TokenLayoutLabToken,
  node: InteropTokenRelationsNode,
): PanelContext {
  const incoming = getRelations(token.graph, node.id, 'incoming')
  const outgoing = getRelations(token.graph, node.id, 'outgoing')
  const backingPaths = getBackingPaths(token.graph, node)
  const primaryBackingPath = backingPaths[0] ?? {
    nodes: [node],
    edges: [],
    complete: true,
  }
  const primarySource = primaryBackingPath.nodes[0] ?? node
  const backedPaths = getBackedPaths(token.graph, node)
  const primaryBackedPath = backedPaths[0] ?? {
    nodes: [node],
    edges: [],
    complete: true,
  }
  const first = node.deployments[0]
  const memberActivity = node.deployments
    .map((deployment) => ({
      deployment,
      stats: findDeploymentStats(token, deployment),
    }))
    .toSorted(
      (a, b) =>
        (b.stats?.transferCount ?? -1) - (a.stats?.transferCount ?? -1) ||
        a.deployment.chainName.localeCompare(b.deployment.chainName),
    )
  const stats =
    node.deployments.length === 1 ? memberActivity[0]?.stats : undefined

  return {
    token,
    node,
    first,
    isGroup: node.deployments.length > 1,
    role: getNodeRole(token.graph, node),
    incoming,
    outgoing,
    backingPaths,
    primaryBackingPath,
    primarySource,
    backedPaths,
    primaryBackedPath,
    stats,
    memberActivity,
    sameChainComparisons: getSameChainComparisons(token, node),
  }
}

function getSameChainComparisons(
  token: TokenLayoutLabToken,
  selectedNode: InteropTokenRelationsNode,
): SameChainComparison[] {
  const allDeployments = token.graph.nodes.flatMap((node) => {
    const directMinters = getDirectMinters(token.graph, node)
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

function getRelations(
  graph: InteropTokenRelationsGraph,
  nodeId: string,
  direction: 'incoming' | 'outgoing',
): RelationWithNode[] {
  return graph.edges.flatMap((edge) => {
    const matches =
      direction === 'incoming' ? edge.to === nodeId : edge.from === nodeId
    if (!matches) return []
    const otherId = direction === 'incoming' ? edge.from : edge.to
    const node = graph.nodes.find((candidate) => candidate.id === otherId)
    return node ? [{ edge, node }] : []
  })
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

function findDeploymentStats(
  token: TokenLayoutLabToken,
  deployment: InteropTokenRelationsDeployment,
) {
  return token.deployments.find(
    (candidate) =>
      candidate.chain === deployment.chain &&
      candidate.address.toLowerCase() === deployment.address.toLowerCase(),
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
      a.nodes
        .map((node) => node.id)
        .join('>')
        .localeCompare(b.nodes.map((node) => node.id).join('>')),
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
      a.nodes
        .map((node) => node.id)
        .join('>')
        .localeCompare(b.nodes.map((node) => node.id).join('>')),
  )
}

function getNodeRole(
  graph: InteropTokenRelationsGraph,
  node: InteropTokenRelationsNode,
): NodeRole {
  const hasIncoming = graph.edges.some((edge) => edge.to === node.id)
  const hasOutgoing = graph.edges.some((edge) => edge.from === node.id)
  if (hasIncoming && hasOutgoing) return 'transit'
  if (node.deployments.length > 1) return 'cluster'
  if (hasIncoming) return 'destination'
  if (hasOutgoing) return 'source'
  return 'unconnected'
}

function pickInitialNode(
  graph: InteropTokenRelationsGraph,
): InteropTokenRelationsNode | undefined {
  const deploymentsPerChain = new Map<string, number>()
  for (const deployment of graph.nodes.flatMap((node) => node.deployments)) {
    deploymentsPerChain.set(
      deployment.chain,
      (deploymentsPerChain.get(deployment.chain) ?? 0) + 1,
    )
  }
  const contestedDestination = graph.nodes
    .filter(
      (node) =>
        node.deployments.length === 1 &&
        graph.edges.some((edge) => edge.to === node.id) &&
        (deploymentsPerChain.get(node.deployments[0]?.chain ?? '') ?? 0) > 1,
    )
    .toSorted(
      (a, b) =>
        (getBackingPaths(graph, b)[0]?.edges.length ?? 0) -
          (getBackingPaths(graph, a)[0]?.edges.length ?? 0) ||
        (b.deployments[0]?.volume ?? -1) - (a.deployments[0]?.volume ?? -1) ||
        describeNode(a).localeCompare(describeNode(b)),
    )[0]
  return (
    contestedDestination ??
    graph.nodes.find(
      (node) =>
        node.deployments.length === 1 &&
        (deploymentsPerChain.get(node.deployments[0]?.chain ?? '') ?? 0) > 1,
    ) ??
    sortNodes(graph)[0]
  )
}

function sortNodes(
  graph: InteropTokenRelationsGraph,
): InteropTokenRelationsNode[] {
  const priority: Record<NodeRole, number> = {
    destination: 0,
    transit: 1,
    source: 2,
    cluster: 3,
    unconnected: 4,
  }
  return graph.nodes.toSorted(
    (a, b) =>
      priority[getNodeRole(graph, a)] - priority[getNodeRole(graph, b)] ||
      (b.volume ?? -1) - (a.volume ?? -1) ||
      describeNode(a).localeCompare(describeNode(b)),
  )
}

function roleLabel(role: NodeRole): string {
  if (role === 'destination') return 'Bridged deployment'
  if (role === 'source') return 'Backing deployment'
  if (role === 'transit') return 'Transit deployment'
  if (role === 'cluster') return 'Burn-mint cluster'
  return 'No observed relations'
}

function describeNode(node: InteropTokenRelationsNode): string {
  const first = node.deployments[0]
  if (!first) return 'Unknown deployment'
  if (node.deployments.length > 1) {
    return `${first.symbol} across ${node.deployments.length} chains`
  }
  return `${first.symbol} on ${first.chainName}`
}

function describeNodeChoice(node: InteropTokenRelationsNode): string {
  const first = node.deployments[0]
  if (!first || node.deployments.length > 1) return describeNode(node)
  return `${describeNode(node)} · ${formatAddress(first.address)}`
}

function transferVolume(context: PanelContext): string {
  const volume = context.isGroup ? context.node.volume : context.first?.volume
  return volume === null || volume === undefined
    ? '—'
    : formatCurrency(volume, 'usd')
}

function transferCount(context: PanelContext): string {
  return context.isGroup
    ? clusterTransferCount(context)
    : formatTransferCount(context.stats?.transferCount)
}

function transferTime(context: PanelContext): string {
  return context.isGroup
    ? clusterTransferTime(context)
    : formatDuration(context.stats?.avgDuration)
}

function transferSummary(context: PanelContext): string {
  if (context.isGroup) {
    return `${transferVolume(context)} summed across cluster members. The busiest measured member has ${transferCount(context)} transfers with an average transfer time of ${transferTime(context)}.`
  }
  return `${transferVolume(context)} across ${transferCount(context)} transfers, averaging ${transferTime(context)}.`
}

function compactBackingSummary(context: PanelContext): string {
  if (context.primaryBackingPath.edges.length === 0) return 'Source node'
  return context.primaryBackingPath.nodes
    .slice(0, -1)
    .toReversed()
    .map(describeNode)
    .join(' ← ')
}

function compactBackedSummary(context: PanelContext): string {
  if (context.primaryBackedPath.edges.length === 0) return 'None visible'
  return context.primaryBackedPath.nodes.slice(1).map(describeNode).join(' → ')
}

function pathKey(path: BackingPath): string {
  return path.nodes.map((node) => node.id).join('>')
}

function sameChainSummary(context: PanelContext, compact = false): string {
  const comparisons = context.sameChainComparisons
  if (comparisons.length === 0) {
    return context.isGroup
      ? 'No member chain has another visible instance'
      : `Only visible instance on ${context.first?.chainName ?? 'this chain'}`
  }

  if (context.isGroup) {
    const ranked = comparisons.filter(
      (comparison) => comparison.selectedRank !== undefined,
    )
    if (ranked.length === 0) return 'No comparable activity snapshot'
    const topCount = ranked.filter(
      (comparison) => comparison.selectedRank === 1,
    ).length
    return compact
      ? `#1 on ${topCount}/${ranked.length} contested chains`
      : `This cluster is most active on ${topCount} of ${ranked.length} member chains with alternatives.`
  }

  const comparison = comparisons[0]
  if (!comparison) return 'No same-chain comparison'
  const status = sameChainRankLabel(comparison)
  const leader = comparison.ranked[0]
  if (comparison.selectedRank === 1 || !leader) {
    return compact ? status : `${status} by past 24h crosschain volume.`
  }
  return compact
    ? `${status}; ${leader.deployment.symbol} leads`
    : `${status}; ${deploymentIdentity(leader.deployment)} is most active by past 24h crosschain volume.`
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

function deploymentIdentity(
  deployment: InteropTokenRelationsDeployment,
): string {
  return `${deployment.symbol} ${shortDeploymentAddress(deployment.address)}`
}

function shortDeploymentAddress(address: string): string {
  if (address === 'native' || address.length <= 12) return address
  return formatAddress(address)
}

function formatDeploymentVolume(volume: number | null): string {
  return volume === null ? '—' : formatCurrency(volume, 'usd')
}

function clusterTransferCount(context: PanelContext): string {
  const busiest = context.memberActivity.find(
    (member) => member.stats?.transferCount !== null && member.stats,
  )
  if (!busiest?.stats || busiest.stats.transferCount === null) return '—'
  return `${formatInteger(busiest.stats.transferCount)} on ${busiest.deployment.chainName}`
}

function clusterTransferTime(context: PanelContext): string {
  const member = context.memberActivity.find(
    (candidate) =>
      candidate.stats?.avgDuration !== null && candidate.stats !== undefined,
  )
  if (!member?.stats || member.stats.avgDuration === null) return '—'
  return `${formatSeconds(member.stats.avgDuration)} on ${member.deployment.chainName}`
}

function formatTransferCount(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : formatInteger(value)
}

function formatDuration(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : formatSeconds(value)
}

function deploymentKey(
  deployment: Pick<InteropTokenRelationsDeployment, 'chain' | 'address'>,
): string {
  return `${deployment.chain}|${deployment.address.toLowerCase()}`
}

function uniqueBridges(
  bridges: UsedInProjectWithIcon[],
): UsedInProjectWithIcon[] {
  return [
    ...new Map(bridges.map((bridge) => [bridge.id, bridge])).values(),
  ].toSorted((a, b) => a.name.localeCompare(b.name))
}
