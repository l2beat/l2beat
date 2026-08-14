import { useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { InteropTokenRelationsGraph } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import { CardPreviewLab } from './CardPreviewLab'
import type { TokenLayoutLabToken } from './getTokenLayoutLabPageData'

interface Props extends AppLayoutProps {
  tokens: TokenLayoutLabToken[]
}

export function TokenLayoutLabPage({ tokens, ...props }: Props) {
  const [selectedTokenId, setSelectedTokenId] = useState(tokens[0]?.id)
  const token =
    tokens.find((candidate) => candidate.id === selectedTokenId) ?? tokens[0]

  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader description="Compare catalogue-card previews for complex tokens using production relationship data.">
          Token card preview lab
        </MainPageHeader>

        <div className="sticky top-0 z-30 border-divider border-y bg-surface-primary/95 px-4 py-3 backdrop-blur md:rounded-lg md:border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-medium text-label-value-13 text-secondary">
              Production data
            </span>
            {tokens.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => setSelectedTokenId(candidate.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 font-bold text-label-value-14 transition-colors',
                  candidate.id === token?.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-divider bg-surface-secondary hover:border-brand',
                )}
              >
                {candidate.iconUrl && (
                  <img
                    src={candidate.iconUrl}
                    alt=""
                    className="size-5 rounded-full"
                  />
                )}
                {candidate.symbol}
              </button>
            ))}
            {token && <GraphStats graph={token.graph} />}
          </div>
        </div>

        {token && (
          <div key={token.id} className="mt-5 px-4 pb-10 md:px-0">
            <CardPreviewLab token={token} />
          </div>
        )}
      </SideNavLayout>
    </AppLayout>
  )
}

function GraphStats({ graph }: { graph: InteropTokenRelationsGraph }) {
  const deployments = graph.nodes.reduce(
    (sum, node) => sum + node.deployments.length,
    0,
  )
  const unconnected = new Set(graph.unconnectedNodeIds)
  const connectedDeployments = graph.nodes
    .filter((node) => !unconnected.has(node.id))
    .reduce((sum, node) => sum + node.deployments.length, 0)

  return (
    <span className="ml-auto text-label-value-12 text-secondary">
      {deployments} deployments · {connectedDeployments} connected ·{' '}
      {graph.edges.length} directed links
    </span>
  )
}
