import type { RouterOutputs } from '@l2beat/token-backend'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  MinusIcon,
  XIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { Separator } from '~/components/core/Separator'
import { ExplorerLink } from '~/components/ExplorerLink'
import { LoadingState } from '~/components/LoadingState'
import { useTRPC } from '~/react-query/trpc'
import {
  connectionHasDirection,
  nodeLabel,
  RELATION_COLORS,
  type RelationGraph,
  type RelationGraphConnection,
  type RelationGraphNode,
  type RelationGraphRoute,
  type RelationGraphSelection,
  relationColor,
  relationId,
  relationPrimaryKey,
  relationRouteId,
  relationTypeLabel,
  sourceId,
  targetId,
} from './relationGraphModel'

type Chain = RouterOutputs['chains']['getAll'][number]
type RelationDetails =
  RouterOutputs['deployedTokens']['getRelationsGraphRelationDetails']

export function TokenRelationsGraphDetailsPanel({
  graph,
  chains,
  selection,
  highlightAnomalies,
  onSelectionChange,
  onClose,
}: {
  graph: RelationGraph
  chains: Chain[]
  selection: RelationGraphSelection
  highlightAnomalies: boolean
  onSelectionChange: (selection: RelationGraphSelection) => void
  onClose: () => void
}) {
  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-label="Graph selection details"
      className="slide-in-from-right absolute inset-y-0 right-0 z-20 flex w-[min(92%,440px)] animate-in flex-col border-l bg-background shadow-xl duration-200"
    >
      <div className="flex items-start justify-between gap-4 border-b p-4">
        <div>
          <div className="font-semibold">
            {selection.type === 'node' ? 'Token details' : 'Connection details'}
          </div>
          <div className="text-muted-foreground text-xs">
            Click another node or connection to inspect it.
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 -mt-2"
          aria-label="Close details"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {selection.type === 'node' ? (
          <GraphNodeDetails
            node={findNode(graph, selection.id)}
            graph={graph}
            chains={chains}
            highlightAnomalies={highlightAnomalies}
            onRelationClick={(relation) =>
              onSelectionChange({
                type: 'relation',
                id: relationId(relation),
              })
            }
          />
        ) : (
          <GraphRelationDetails
            relation={findRelation(graph, selection.id)}
            graph={graph}
            chains={chains}
            highlightAnomalies={highlightAnomalies}
          />
        )}
      </div>
    </aside>
  )
}

function GraphNodeDetails({
  node,
  graph,
  chains,
  highlightAnomalies,
  onRelationClick,
}: {
  node: RelationGraphNode
  graph: RelationGraph
  chains: Chain[]
  highlightAnomalies: boolean
  onRelationClick: (relation: RelationGraphConnection) => void
}) {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(
    trpc.deployedTokens.getRelationsGraphNodeDetails.queryOptions({
      chain: node.chain,
      address: node.address,
    }),
  )
  const outgoing = graph.relations.filter(
    (relation) =>
      connectionHasDirection(relation) && sourceId(relation) === node.id,
  )
  const incoming = graph.relations.filter(
    (relation) =>
      connectionHasDirection(relation) && targetId(relation) === node.id,
  )
  const nonDirectional = graph.relations.filter(
    (relation) =>
      relation.bridgeType === 'burnAndMint' &&
      (sourceId(relation) === node.id || targetId(relation) === node.id),
  )
  const unknownDirection = graph.relations.filter(
    (relation) =>
      relation.bridgeType === 'lockAndMint' &&
      !connectionHasDirection(relation) &&
      (sourceId(relation) === node.id || targetId(relation) === node.id),
  )

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="break-all font-semibold text-lg">
            {nodeLabel(node)} on {node.chain}
          </h2>
          <DeploymentBadge
            deployed={
              data === undefined ? node.isDeployed : data.deployedToken !== null
            }
          />
        </div>
        <div className="break-all text-muted-foreground text-xs">
          {node.address}
        </div>
      </div>

      {isLoading ? (
        <LoadingState className="h-32" />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : data?.deployedToken === null || data === undefined ? (
        <MissingTokenDetails node={node} chains={chains} />
      ) : (
        <DeployedTokenDetails
          token={data.deployedToken}
          abstractToken={data.abstractToken}
          chains={chains}
        />
      )}

      <Separator />
      <div className="space-y-4">
        <h3 className="font-medium">Relations visible on this graph</h3>
        <GraphRelationList
          title="Outgoing Lock & Mint"
          emptyText="No outgoing Lock & Mint connections."
          relations={outgoing}
          node={node}
          graph={graph}
          highlightAnomalies={highlightAnomalies}
          onRelationClick={onRelationClick}
        />
        <GraphRelationList
          title="Incoming Lock & Mint"
          emptyText="No incoming Lock & Mint connections."
          relations={incoming}
          node={node}
          graph={graph}
          highlightAnomalies={highlightAnomalies}
          onRelationClick={onRelationClick}
        />
        <GraphRelationList
          title="Burn & Mint"
          emptyText="No Burn & Mint connections."
          relations={nonDirectional}
          node={node}
          graph={graph}
          highlightAnomalies={highlightAnomalies}
          onRelationClick={onRelationClick}
        />
        {unknownDirection.length > 0 && (
          <GraphRelationList
            title="Lock & Mint (direction unknown)"
            emptyText="No connections with an unknown direction."
            relations={unknownDirection}
            node={node}
            graph={graph}
            highlightAnomalies={highlightAnomalies}
            onRelationClick={onRelationClick}
          />
        )}
      </div>
    </div>
  )
}

function MissingTokenDetails({
  node,
  chains,
}: {
  node: RelationGraphNode
  chains: Chain[]
}) {
  const explorerUrl = findExplorerUrl(chains, node.chain)
  return (
    <DetailsSection title="Observed endpoint">
      <p className="text-muted-foreground text-sm">
        This address appears in an observed relation but is not currently in the
        deployed token catalogue.
      </p>
      <DetailRows>
        <DetailRow label="Chain">{node.chain}</DetailRow>
        <DetailRow label="Address">
          <AddressValue
            chain={node.chain}
            address={node.address}
            explorerUrl={explorerUrl}
          />
        </DetailRow>
      </DetailRows>
    </DetailsSection>
  )
}

function DeployedTokenDetails({
  token,
  abstractToken,
  chains,
}: {
  token: NonNullable<
    RouterOutputs['deployedTokens']['getRelationsGraphNodeDetails']['deployedToken']
  >
  abstractToken: RouterOutputs['deployedTokens']['getRelationsGraphNodeDetails']['abstractToken']
  chains: Chain[]
}) {
  const explorerUrl = findExplorerUrl(chains, token.chain)

  return (
    <div className="space-y-5">
      <DetailsSection title="Deployed token">
        <div className="flex flex-wrap gap-3 text-sm">
          <NewTabLink to={`/tokens/${token.chain}/${token.address}`}>
            Open deployed token page
          </NewTabLink>
          {explorerUrl && token.address !== 'native' && (
            <ExplorerLink
              explorerUrl={explorerUrl}
              value={token.address}
              type="address"
            >
              Open in explorer
            </ExplorerLink>
          )}
        </div>
        <DetailRows>
          <DetailRow label="Symbol">{token.symbol}</DetailRow>
          <DetailRow label="Chain">{token.chain}</DetailRow>
          <DetailRow label="Address">
            <AddressValue
              chain={token.chain}
              address={token.address}
              explorerUrl={explorerUrl}
            />
          </DetailRow>
          <DetailRow label="Decimals">{token.decimals}</DetailRow>
          <DetailRow label="Deployed">
            {formatUnixTimestamp(token.deploymentTimestamp)}
          </DetailRow>
          {token.comment && (
            <DetailRow label="Comment">{token.comment}</DetailRow>
          )}
        </DetailRows>
        {token.metadata !== null && (
          <JsonDetails label="Metadata" value={token.metadata} />
        )}
        {token.abstractTokenAssignmentProof != null && (
          <JsonDetails
            label="Abstract assignment proof"
            value={token.abstractTokenAssignmentProof}
          />
        )}
      </DetailsSection>

      <DetailsSection title="Abstract token">
        {abstractToken === null ? (
          <div className="text-muted-foreground text-sm">
            No abstract token assigned.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {abstractToken.iconUrl && (
                <img
                  src={abstractToken.iconUrl}
                  alt=""
                  className="size-9 rounded-full bg-muted object-cover"
                />
              )}
              <div>
                <div className="font-medium">{abstractToken.symbol}</div>
                <NewTabLink to={`/tokens/${abstractToken.id}`}>
                  Open abstract token page
                </NewTabLink>
              </div>
            </div>
            <DetailRows>
              <DetailRow label="ID">{abstractToken.id}</DetailRow>
              <DetailRow label="Issuer">
                {abstractToken.issuer ?? '—'}
              </DetailRow>
              <DetailRow label="Category">
                {abstractToken.category ?? '—'}
              </DetailRow>
              <DetailRow label="Reviewed">
                {abstractToken.reviewed ? 'Yes' : 'No'}
              </DetailRow>
              <DetailRow label="Price unreliable">
                {abstractToken.isPriceUnreliable ? 'Yes' : 'No'}
              </DetailRow>
              {abstractToken.comment && (
                <DetailRow label="Comment">{abstractToken.comment}</DetailRow>
              )}
            </DetailRows>
          </>
        )}
      </DetailsSection>
    </div>
  )
}

function GraphRelationList({
  title,
  emptyText,
  relations,
  node,
  graph,
  highlightAnomalies,
  onRelationClick,
}: {
  title: string
  emptyText: string
  relations: RelationGraphConnection[]
  node: RelationGraphNode
  graph: RelationGraph
  highlightAnomalies: boolean
  onRelationClick: (relation: RelationGraphConnection) => void
}) {
  return (
    <div className="space-y-2">
      <div className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {title} ({relations.length})
      </div>
      {relations.length === 0 ? (
        <div className="text-muted-foreground text-sm">{emptyText}</div>
      ) : (
        <div className="space-y-1.5">
          {relations.map((relation) => {
            const otherId =
              sourceId(relation) === node.id
                ? targetId(relation)
                : sourceId(relation)
            const otherNode = findNode(graph, otherId)
            return (
              <button
                key={relationId(relation)}
                type="button"
                onClick={() => onRelationClick(relation)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md border p-2 text-left text-sm hover:bg-muted"
              >
                <span
                  className="h-0.5 w-7 shrink-0 rounded-full"
                  style={{
                    background: displayedRelationColor(
                      relation,
                      highlightAnomalies,
                    ),
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {nodeLabel(otherNode)} on {otherNode.chain}
                  </span>
                  <span className="block truncate text-muted-foreground text-xs">
                    {relationTypeLabel(relation)} · {relation.plugin}
                  </span>
                </span>
                {connectionHasDirection(relation) ? (
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                ) : relation.bridgeType === 'burnAndMint' ? (
                  <ArrowLeftRightIcon className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <MinusIcon className="size-4 shrink-0 text-muted-foreground" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GraphRelationDetails({
  relation,
  graph,
  chains,
  highlightAnomalies,
}: {
  relation: RelationGraphConnection
  graph: RelationGraph
  chains: Chain[]
  highlightAnomalies: boolean
}) {
  const source = findNode(graph, sourceId(relation))
  const target = findNode(graph, targetId(relation))
  const color = displayedRelationColor(relation, highlightAnomalies)
  const directional = connectionHasDirection(relation)
  const directionUnknown = relation.bridgeType === 'lockAndMint' && !directional

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" style={{ borderColor: color, color }}>
            {relationTypeLabel(relation)}
          </Badge>
          {relation.isConflict && (
            <Badge variant="destructive">Assignment anomaly</Badge>
          )}
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <EndpointCard node={source} chains={chains} />
          {directional ? (
            <ArrowRightIcon className="size-5 text-muted-foreground" />
          ) : directionUnknown ? (
            <MinusIcon className="size-5 text-muted-foreground" />
          ) : (
            <ArrowLeftRightIcon className="size-5 text-muted-foreground" />
          )}
          <EndpointCard node={target} chains={chains} />
        </div>
        <div className="text-center text-muted-foreground text-xs">
          {directional
            ? 'Lock → Mint'
            : directionUnknown
              ? 'Direction unavailable'
              : 'Non-directional'}
        </div>
      </div>

      <DetailsSection title="Connection">
        <DetailRows>
          <DetailRow
            label={
              directional
                ? 'Locked token'
                : directionUnknown
                  ? 'Observed from'
                  : 'Token 1'
            }
          >
            {source.chain}:{source.address}
          </DetailRow>
          <DetailRow
            label={
              directional
                ? 'Minted token'
                : directionUnknown
                  ? 'Observed to'
                  : 'Token 2'
            }
          >
            {target.chain}:{target.address}
          </DetailRow>
          <DetailRow label="Bridge type">
            {relationTypeLabel(relation)}
          </DetailRow>
          <DetailRow label="Plugin">{relation.plugin}</DetailRow>
          <DetailRow label="Evidence records">
            {relation.routes.length}
          </DetailRow>
        </DetailRows>
        {relation.isConflict && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            Both deployed endpoints are assigned to different abstract tokens.
          </p>
        )}
      </DetailsSection>

      <div className="space-y-5">
        {relation.routes.map((route) => (
          <GraphRelationEvidence
            key={relationRouteId(route)}
            route={route}
            chains={chains}
          />
        ))}
      </div>
    </div>
  )
}

function GraphRelationEvidence({
  route,
  chains,
}: {
  route: RelationGraphRoute
  chains: Chain[]
}) {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(
    trpc.deployedTokens.getRelationsGraphRelationDetails.queryOptions(
      relationPrimaryKey(route),
    ),
  )

  if (isLoading) return <LoadingState className="h-24" />
  if (error) return <ErrorState message={error.message} />
  if (data === undefined) return null

  return (
    <RelationEvidence
      title={relationEvidenceTitle(route)}
      relation={data}
      chains={chains}
    />
  )
}

function EndpointCard({
  node,
  chains,
}: {
  node: RelationGraphNode
  chains: Chain[]
}) {
  const explorerUrl = findExplorerUrl(chains, node.chain)
  return (
    <div className="min-w-0 rounded-md border p-2 text-center">
      <div className="truncate font-medium text-sm">{nodeLabel(node)}</div>
      <div className="truncate text-muted-foreground text-xs">{node.chain}</div>
      <div className="mt-1 flex justify-center gap-2 text-xs">
        {node.isDeployed && (
          <NewTabLink to={`/tokens/${node.chain}/${node.address}`}>
            Token
          </NewTabLink>
        )}
        {explorerUrl && node.address !== 'native' && (
          <ExplorerLink
            explorerUrl={explorerUrl}
            value={node.address}
            type="address"
          >
            Explorer
          </ExplorerLink>
        )}
      </div>
    </div>
  )
}

function RelationEvidence({
  title,
  relation,
  chains,
}: {
  title: string
  relation: RelationDetails
  chains: Chain[]
}) {
  const evidence = readTransferEvidence(relation.transfer)

  return (
    <DetailsSection title={title}>
      <DetailRows>
        {evidence.transferId && (
          <DetailRow label="Transfer ID">{evidence.transferId}</DetailRow>
        )}
        {evidence.type && <DetailRow label="Type">{evidence.type}</DetailRow>}
        {evidence.timestamp !== undefined && (
          <DetailRow label="Timestamp">
            {formatUnixTimestamp(evidence.timestamp)}
          </DetailRow>
        )}
        <DetailRow label={`${relation.tokenFromChain} tx`}>
          <TransactionValue
            chain={relation.tokenFromChain}
            txHash={evidence.srcTxHash}
            chains={chains}
          />
        </DetailRow>
        <DetailRow label={`${relation.tokenToChain} tx`}>
          <TransactionValue
            chain={relation.tokenToChain}
            txHash={evidence.dstTxHash}
            chains={chains}
          />
        </DetailRow>
      </DetailRows>
      <JsonDetails label="Raw transfer evidence" value={relation.transfer} />
    </DetailsSection>
  )
}

function relationEvidenceTitle(route: RelationGraphRoute) {
  if (route.bridgeType === 'burnAndMint') {
    return `${route.tokenFromChain} → ${route.tokenToChain} evidence`
  }

  switch (route.lockAndMintDirection) {
    case 'lockToMint':
      return 'Lock → Mint evidence'
    case 'burnToUnlock':
      return 'Burn → Unlock evidence'
    case 'unknown':
      return 'Observed transfer evidence'
    case null:
      throw new Error('Lock & Mint route is missing its direction')
  }
}

function TransactionValue({
  chain,
  txHash,
  chains,
}: {
  chain: string
  txHash: string | undefined
  chains: Chain[]
}) {
  if (txHash === undefined) {
    return <span className="text-muted-foreground">Not present</span>
  }
  const explorerUrl = findExplorerUrl(chains, chain)
  if (explorerUrl === undefined) {
    return <span className="break-all">{txHash}</span>
  }
  return (
    <ExplorerLink explorerUrl={explorerUrl} value={txHash} type="tx">
      <span className="break-all">{txHash}</span>
    </ExplorerLink>
  )
}

function AddressValue({
  chain,
  address,
  explorerUrl,
}: {
  chain: string
  address: string
  explorerUrl: string | undefined
}) {
  if (explorerUrl === undefined || address === 'native') {
    return <span className="break-all">{address}</span>
  }
  return (
    <ExplorerLink explorerUrl={explorerUrl} value={address} type="address">
      <span className="break-all">
        {chain}:{address}
      </span>
    </ExplorerLink>
  )
}

function DeploymentBadge({ deployed }: { deployed: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        deployed
          ? 'border-green-500/60 text-green-600 dark:text-green-400'
          : 'border-orange-500/60 text-orange-600 dark:text-orange-400'
      }
    >
      {deployed ? 'Deployed' : 'Missing'}
    </Badge>
  )
}

function DetailsSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </section>
  )
}

function DetailRows({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      {children}
    </dl>
  )
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-right">{children}</dd>
    </>
  )
}

function JsonDetails({ label, value }: { label: string; value: unknown }) {
  const json = JSON.stringify(value, null, 2)
  if (json === undefined) {
    throw new Error(`Cannot serialize ${label}`)
  }
  return (
    <details className="rounded-md border p-2">
      <summary className="cursor-pointer text-muted-foreground text-xs">
        {label}
      </summary>
      <pre className="mt-2 max-h-64 overflow-auto rounded bg-muted p-2 text-xs">
        {json}
      </pre>
    </details>
  )
}

function NewTabLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-500 underline hover:text-blue-600"
    >
      {children}
      <ExternalLinkIcon className="size-3" />
    </Link>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="grid h-full min-h-24 place-items-center p-4 text-center text-destructive text-sm">
      {message}
    </div>
  )
}

function findNode(graph: RelationGraph, id: string) {
  const node = graph.nodes.find((node) => node.id === id)
  if (node === undefined) {
    throw new Error(`Graph node ${id} does not exist`)
  }
  return node
}

function findRelation(graph: RelationGraph, id: string) {
  const relation = graph.relations.find(
    (relation) => relationId(relation) === id,
  )
  if (relation === undefined) {
    throw new Error(`Graph relation ${id} does not exist`)
  }
  return relation
}

function displayedRelationColor(
  relation: RelationGraphConnection,
  highlightAnomalies: boolean,
) {
  if (!highlightAnomalies) return relationColor(relation)
  return relation.isConflict ? RELATION_COLORS.conflict : RELATION_COLORS.muted
}

function findExplorerUrl(chains: Chain[], chainName: string) {
  return (
    chains.find((chain) => chain.name === chainName)?.explorerUrl ?? undefined
  )
}

function formatUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1_000).toLocaleString()
}

function readTransferEvidence(transfer: RelationDetails['transfer']) {
  if (
    transfer === null ||
    Array.isArray(transfer) ||
    typeof transfer !== 'object'
  ) {
    throw new Error('Token relation transfer evidence must be an object')
  }

  return {
    transferId: optionalString(transfer, 'transferId'),
    type: optionalString(transfer, 'type'),
    timestamp: optionalNumber(transfer, 'timestamp'),
    srcTxHash: optionalString(transfer, 'srcTxHash'),
    dstTxHash: optionalString(transfer, 'dstTxHash'),
  }
}

function optionalString(value: Record<string, unknown>, key: string) {
  const field = value[key]
  if (field === undefined) return undefined
  if (typeof field !== 'string') {
    throw new Error(`Token relation transfer evidence ${key} must be a string`)
  }
  return field
}

function optionalNumber(value: Record<string, unknown>, key: string) {
  const field = value[key]
  if (field === undefined) return undefined
  if (typeof field !== 'number') {
    throw new Error(`Token relation transfer evidence ${key} must be a number`)
  }
  return field
}
