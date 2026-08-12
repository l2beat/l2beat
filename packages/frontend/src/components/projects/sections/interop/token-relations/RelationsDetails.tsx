import { formatAddress } from '@l2beat/shared-pure'
import { CustomLink } from '~/components/link/CustomLink'
import type {
  InteropTokenRelationsEdge,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'

interface Props {
  graph: InteropTokenRelationsGraph
  nodeId: string
  onClose: () => void
}

export function RelationsDetails({ graph, nodeId, onClose }: Props) {
  const node = graph.nodes.find((n) => n.id === nodeId)
  if (!node) return null

  const backedBy = graph.edges.filter(
    (edge) => edge.kind === 'backs' && edge.to === node.id,
  )
  const backs = graph.edges.filter(
    (edge) => edge.kind === 'backs' && edge.from === node.id,
  )
  const related = graph.edges.filter(
    (edge) =>
      edge.kind === 'related' && (edge.from === node.id || edge.to === node.id),
  )
  const first = node.deployments[0]
  const isGroup = node.deployments.length > 1

  return (
    <aside className="flex h-full flex-col overflow-y-auto rounded-lg border border-divider bg-surface-primary p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-bold text-label-value-15">
            {first?.symbol}
          </p>
          {isGroup ? (
            <p className="text-label-value-13 text-secondary">
              Burn-mint relation · {node.deployments.length} deployments
            </p>
          ) : (
            first && (
              <p className="flex items-center gap-1.5 text-label-value-13 text-secondary">
                On
                {first.iconUrl && (
                  <img
                    src={first.iconUrl}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 shrink-0 rounded-full"
                  />
                )}
                <span className="min-w-0 truncate">{first.chainName}</span>
              </p>
            )
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 font-medium text-label-value-13 text-secondary hover:text-primary"
        >
          Close
        </button>
      </div>

      {/* A single deployment's chain is already in the heading, so only the
          address is left to show. A group has to list its members. */}
      {isGroup ? (
        <ul className="mt-3 space-y-1">
          {node.deployments.map((deployment) => (
            <li
              key={`${deployment.chain}-${deployment.address}`}
              className="flex items-center gap-2 text-label-value-13"
            >
              {deployment.iconUrl && (
                <img
                  src={deployment.iconUrl}
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 shrink-0 rounded-full"
                />
              )}
              <span className="min-w-0 flex-1 truncate font-medium">
                {deployment.chainName}
              </span>
              {deployment.explorerUrl ? (
                <CustomLink
                  href={deployment.explorerUrl}
                  className="shrink-0 whitespace-nowrap"
                >
                  {formatAddress(deployment.address)}
                </CustomLink>
              ) : (
                <span className="shrink-0 whitespace-nowrap text-secondary">
                  {formatAddress(deployment.address)}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        first && (
          <p className="mt-2 text-label-value-13">
            {first.explorerUrl ? (
              <CustomLink href={first.explorerUrl}>
                {formatAddress(first.address)}
              </CustomLink>
            ) : (
              <span className="text-secondary">
                {formatAddress(first.address)}
              </span>
            )}
          </p>
        )
      )}

      {isGroup && (
        <>
          <p className="mt-2 text-label-value-12 text-secondary">
            Moving between these burns on one side and mints on the other, so
            none of them is the original.
          </p>
          <BridgeList bridges={node.bridges} label="Burn-mint via" />
        </>
      )}

      <EdgeList
        title="Backed by"
        edges={backedBy}
        otherId={(edge) => edge.from}
        graph={graph}
      />
      <EdgeList
        title="Backs"
        edges={backs}
        otherId={(edge) => edge.to}
        graph={graph}
      />
      <EdgeList
        title="Related, direction not observed"
        edges={related}
        otherId={(edge) => (edge.from === node.id ? edge.to : edge.from)}
        graph={graph}
      />
    </aside>
  )
}

function BridgeList({
  bridges,
  label,
}: {
  bridges: InteropTokenRelationsEdge['bridges']
  label: string
}) {
  if (bridges.length === 0) return null
  return (
    <div className="mt-3">
      <p className="font-bold text-label-value-13 text-secondary">{label}</p>
      <ul className="mt-1 space-y-1">
        {bridges.map((bridge) => (
          <li key={bridge.id}>
            <a
              href={bridge.url}
              className="flex items-center gap-2 text-label-value-13 hover:underline"
            >
              <img
                src={bridge.icon}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full"
              />
              <span className="min-w-0 truncate font-medium">
                {bridge.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EdgeList({
  title,
  edges,
  otherId,
  graph,
}: {
  title: string
  edges: InteropTokenRelationsEdge[]
  otherId: (edge: InteropTokenRelationsEdge) => string
  graph: InteropTokenRelationsGraph
}) {
  if (edges.length === 0) return null

  return (
    <div className="mt-4">
      <p className="font-bold text-label-value-13 text-secondary">{title}</p>
      <ul className="mt-1 space-y-2">
        {edges.map((edge) => {
          const other = graph.nodes.find((n) => n.id === otherId(edge))
          if (!other) return null
          return (
            <li key={`${edge.from}->${edge.to}-${edge.kind}`}>
              {/* Name on its own line and bridges beneath it: inline, the two
                  wrap into each other once a row carries several bridges. */}
              <p className="font-medium text-label-value-13">
                {describeNode(other)}
              </p>
              {edge.bridges.length > 0 && (
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-label-value-12 text-secondary">
                  <span className="shrink-0">via</span>
                  {edge.bridges.map((bridge) => (
                    <a
                      key={bridge.id}
                      href={bridge.url}
                      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap hover:underline"
                    >
                      <img
                        src={bridge.icon}
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5 shrink-0 rounded-full"
                      />
                      {bridge.name}
                    </a>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function describeNode(node: InteropTokenRelationsNode): string {
  const first = node.deployments[0]
  if (!first) return 'Unknown'
  if (node.deployments.length > 1) {
    return `${first.symbol} across ${node.deployments.length} chains`
  }
  return `${first.symbol} on ${first.chainName}`
}
