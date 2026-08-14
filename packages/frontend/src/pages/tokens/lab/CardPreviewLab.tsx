import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import {
  getRelationsNodeHeight,
  getRelationsNodeWidth,
} from '~/components/projects/sections/interop/token-relations/RelationsNode'
import type {
  InteropTokenRelationsDeployment,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { TokenLayoutLabToken } from './getTokenLayoutLabPageData'

const PADDING = 12

type ClusterVariant =
  | 'named-grid'
  | 'open-ledger'
  | 'minter-rail'
  | 'minter-masthead'
  | 'leaders'
  | 'chain-chips'
  | 'volume-bars'
  | 'balanced'

interface ClusterOptionDefinition {
  number: string
  title: string
  goal: string
  strength: string
  tradeoff: string
  variant: ClusterVariant
}

const OPTIONS: ClusterOptionDefinition[] = [
  {
    number: '1',
    title: 'Named baseline',
    goal: 'Make the smallest useful change to the current node',
    strength: 'Keeps the familiar grid while naming one minter.',
    tradeoff: 'Retains the gray deployment tiles.',
    variant: 'named-grid',
  },
  {
    number: '2',
    title: 'Open ledger',
    goal: 'Scan full chain names without a field of boxes',
    strength: 'Two wide columns give names and volumes more room.',
    tradeoff: 'The cluster becomes taller in visual rhythm.',
    variant: 'open-ledger',
  },
  {
    number: '3',
    title: 'Minter rail',
    goal: 'Keep the risk-bearing system visible while scanning',
    strength: 'A persistent left rail separates minter and member roles.',
    tradeoff: 'Leaves less horizontal room for each chain.',
    variant: 'minter-rail',
  },
  {
    number: '4',
    title: 'Minter masthead',
    goal: 'Lead with who manages minting, then show destinations',
    strength: 'The named minter is the clearest element after the symbol.',
    tradeoff: 'Chain volumes become more compact.',
    variant: 'minter-masthead',
  },
  {
    number: '5',
    title: 'Leaders and rest',
    goal: 'Distinguish the most active destinations from the long tail',
    strength: 'The three busiest chains are easy to compare.',
    tradeoff: 'Introduces two visual classes of cluster member.',
    variant: 'leaders',
  },
  {
    number: '6',
    title: 'Chain chips',
    goal: 'Optimize for fast logo and chain-name recognition',
    strength: 'Very little chrome surrounds each member.',
    tradeoff: 'Per-chain volume is intentionally omitted.',
    variant: 'chain-chips',
  },
  {
    number: '7',
    title: 'Volume bars',
    goal: 'Make deployment activity comparable at a glance',
    strength: 'Popularity is readable without inspecting every number.',
    tradeoff: 'The extra encoding may compete with minter risk.',
    variant: 'volume-bars',
  },
  {
    number: '8',
    title: 'Balanced open grid',
    goal: 'Combine set meaning, a named minter, and compact scanning',
    strength: 'Retains three-column density without gray tiles.',
    tradeoff: 'Long chain names still need shortening.',
    variant: 'balanced',
  },
]

export function CardPreviewLab({ token }: { token: TokenLayoutLabToken }) {
  const clusters = useMemo(
    () =>
      token.graph.nodes
        .filter((node) => node.deployments.length > 1)
        .toSorted(
          (a, b) =>
            b.deployments.length - a.deployments.length ||
            (b.volume ?? -1) - (a.volume ?? -1) ||
            a.id.localeCompare(b.id),
        ),
    [token.graph.nodes],
  )
  const [selectedNodeId, setSelectedNodeId] = useState(clusters[0]?.id)
  const node =
    clusters.find((candidate) => candidate.id === selectedNodeId) ?? clusters[0]
  const incomingIds = useMemo(
    () => new Set(token.graph.edges.map((edge) => edge.to)),
    [token.graph.edges],
  )

  if (!node) {
    return (
      <p className="text-label-value-14 text-secondary">
        This token has no observed burn-mint clusters.
      </p>
    )
  }

  return (
    <section>
      <header className="mb-4">
        <h2 className="font-bold text-heading-20">
          Burn-mint cluster experiments
        </h2>
        <p className="max-w-4xl text-label-value-13 text-secondary">
          Eight structurally different treatments of the same production cluster
          at its real modal dimensions. Values are past 24h crosschain volume.
        </p>
      </header>

      {clusters.length > 1 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-medium text-label-value-13 text-secondary">
            Cluster
          </span>
          {clusters.map((candidate) => {
            const symbol = candidate.deployments[0]?.symbol ?? token.symbol
            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => setSelectedNodeId(candidate.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 font-bold text-label-value-13 transition-colors',
                  candidate.id === node.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-divider bg-surface-secondary hover:border-brand',
                )}
              >
                {symbol} · {candidate.deployments.length} chains
              </button>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-5 gap-y-7 xl:grid-cols-2">
        {OPTIONS.map((option) => (
          <ClusterOption key={option.number} option={option}>
            <ClusterPreview
              node={node}
              variant={option.variant}
              isSource={!incomingIds.has(node.id)}
            />
          </ClusterOption>
        ))}
      </div>
    </section>
  )
}

function ClusterOption({
  option,
  children,
}: {
  option: ClusterOptionDefinition
  children: React.ReactNode
}) {
  return (
    <article className="min-w-0">
      <div className="mb-3 min-h-[104px]">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand font-bold text-label-value-12 text-white">
            {option.number}
          </span>
          <h3 className="font-bold text-label-value-15">{option.title}</h3>
        </div>
        <p className="mt-1.5 text-label-value-12 text-secondary">
          <span className="font-medium text-primary">Goal:</span> {option.goal}
        </p>
        <p className="text-label-value-12">
          <span className="font-medium">Strength:</span> {option.strength}
        </p>
        <p className="text-label-value-12 text-secondary">
          <span className="font-medium">Tradeoff:</span> {option.tradeoff}
        </p>
      </div>
      {children}
    </article>
  )
}

function ClusterPreview({
  node,
  variant,
  isSource,
}: {
  node: InteropTokenRelationsNode
  variant: ClusterVariant
  isSource: boolean
}) {
  const width = getRelationsNodeWidth(node)
  const height = getRelationsNodeHeight(node)

  return (
    <div className="flex min-h-[270px] items-center justify-center overflow-hidden rounded-lg border border-divider bg-surface-secondary p-4">
      <svg
        viewBox={`-6 -6 ${width + 12} ${height + 12}`}
        width={width + 12}
        height={height + 12}
        className="block h-auto max-w-full"
        role="img"
        aria-label={`${variant} design for ${node.deployments[0]?.symbol ?? 'burn-mint'} across ${node.deployments.length} chains`}
      >
        <VariantNode
          node={node}
          width={width}
          height={height}
          isSource={isSource}
          variant={variant}
        />
      </svg>
    </div>
  )
}

function VariantNode({
  node,
  width,
  height,
  isSource,
  variant,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
  isSource: boolean
  variant: ClusterVariant
}) {
  return (
    <g>
      <ClusterFrame width={width} height={height} isSource={isSource} />
      {variant === 'named-grid' && (
        <NamedGrid node={node} width={width} height={height} />
      )}
      {variant === 'open-ledger' && (
        <OpenLedger node={node} width={width} height={height} />
      )}
      {variant === 'minter-rail' && (
        <MinterRail node={node} width={width} height={height} />
      )}
      {variant === 'minter-masthead' && (
        <MinterMasthead node={node} width={width} height={height} />
      )}
      {variant === 'leaders' && (
        <LeadersAndRest node={node} width={width} height={height} />
      )}
      {variant === 'chain-chips' && (
        <ChainChips node={node} width={width} height={height} />
      )}
      {variant === 'volume-bars' && (
        <VolumeBars node={node} width={width} height={height} />
      )}
      {variant === 'balanced' && (
        <BalancedOpenGrid node={node} width={width} height={height} />
      )}
    </g>
  )
}

function ClusterFrame({
  width,
  height,
  isSource,
}: {
  width: number
  height: number
  isSource: boolean
}) {
  return (
    <>
      {isSource && (
        <rect
          x={-5}
          y={-5}
          width={width + 10}
          height={height + 10}
          rx={15}
          fill="none"
          className="stroke-brand"
          strokeOpacity={0.3}
          strokeWidth={1.5}
        />
      )}
      <rect
        width={width}
        height={height}
        rx={10}
        className="fill-surface-primary stroke-divider"
        strokeWidth={1}
      />
    </>
  )
}

function NamedGrid({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  return (
    <>
      <TitleLine node={node} width={width} />
      <MinterLine node={node} x={PADDING} y={42} maxX={width - PADDING} />
      <CardGrid node={node} width={width} height={height} startY={56} />
    </>
  )
}

function OpenLedger({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  return (
    <>
      <TitleLine node={node} width={width} />
      <MinterLine node={node} x={PADDING} y={42} maxX={width - PADDING} />
      <TwoColumnRows
        node={node}
        x={PADDING}
        y={54}
        width={width - PADDING * 2}
        height={height - 66}
      />
    </>
  )
}

function MinterRail({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  const railWidth = width > 400 ? 130 : 108
  const symbol = node.deployments[0]?.symbol ?? 'Token'
  const bridge = node.bridges[0]
  const extra = Math.max(0, node.bridges.length - 1)

  return (
    <>
      <rect
        x={0}
        y={0}
        width={railWidth}
        height={height}
        rx={10}
        className="fill-brand"
        fillOpacity={0.055}
      />
      <line
        x1={railWidth}
        x2={railWidth}
        y1={0}
        y2={height}
        className="stroke-brand"
        strokeOpacity={0.35}
      />
      <text
        x={PADDING}
        y={24}
        className="fill-primary font-bold text-label-value-13"
      >
        {symbol}
      </text>
      {node.volume !== null && (
        <text x={PADDING} y={44} className="fill-secondary text-label-value-12">
          {formatCurrency(node.volume, 'usd')}
        </text>
      )}
      <text x={PADDING} y={72} className="fill-secondary text-label-value-12">
        Burn &amp; mint
      </text>
      <text x={PADDING} y={87} className="fill-secondary text-label-value-12">
        cluster via
      </text>
      {bridge?.icon && (
        <image href={bridge.icon} x={PADDING} y={94} width={16} height={16} />
      )}
      <text
        x={bridge?.icon ? 34 : PADDING}
        y={107}
        className="fill-primary font-medium text-label-value-12"
      >
        {shorten(bridge?.name ?? 'Not identified', railWidth > 120 ? 13 : 9)}
      </text>
      {extra > 0 && (
        <text
          x={PADDING}
          y={126}
          className="fill-secondary text-label-value-12"
        >
          +{extra} more
        </text>
      )}
      <text
        x={PADDING}
        y={height - PADDING}
        className="fill-secondary text-label-value-12"
      >
        {node.deployments.length} chains
      </text>
      <TwoColumnRows
        node={node}
        x={railWidth + 12}
        y={10}
        width={width - railWidth - 24}
        height={height - 20}
        compact
      />
    </>
  )
}

function MinterMasthead({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  return (
    <>
      <TitleLine node={node} width={width} />
      <rect
        x={PADDING}
        y={28}
        width={width - PADDING * 2}
        height={27}
        rx={7}
        className="fill-brand stroke-brand"
        fillOpacity={0.07}
        strokeOpacity={0.45}
        strokeWidth={0.8}
      />
      <MinterLine
        node={node}
        x={PADDING + 8}
        y={46}
        maxX={width - PADDING - 8}
      />
      <LogoMatrix node={node} width={width} height={height} startY={64} />
    </>
  )
}

function LeadersAndRest({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  const deployments = sortedDeployments(node)
  const leaders = deployments.slice(0, 3)
  const rest = deployments.slice(3)
  const topY = 56
  const topHeight = Math.min(52, Math.max(38, (height - topY - 12) * 0.36))
  const gap = 6
  const leaderWidth = (width - PADDING * 2 - gap * 2) / 3

  return (
    <>
      <TitleLine node={node} width={width} />
      <MinterLine node={node} x={PADDING} y={42} maxX={width - PADDING} />
      {leaders.map((deployment, index) => (
        <LeaderCard
          key={`${deployment.chain}-${deployment.address}`}
          deployment={deployment}
          x={PADDING + index * (leaderWidth + gap)}
          y={topY}
          width={leaderWidth}
          height={topHeight}
        />
      ))}
      <RestMatrix
        deployments={rest}
        x={PADDING}
        y={topY + topHeight + 6}
        width={width - PADDING * 2}
        height={height - topY - topHeight - 18}
      />
    </>
  )
}

function ChainChips({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  const deployments = sortedDeployments(node)
  const columns = width > 400 ? 3 : 2
  const rows = Math.ceil(deployments.length / columns)
  const gapX = 8
  const gapY = 8
  const cellWidth = (width - PADDING * 2 - gapX * (columns - 1)) / columns
  const rowHeight = (height - 68 - gapY * (rows - 1)) / rows

  return (
    <>
      <TitleLine node={node} width={width} />
      <MinterLine node={node} x={PADDING} y={42} maxX={width - PADDING} />
      <text x={PADDING} y={59} className="fill-secondary text-label-value-12">
        {node.deployments.length} interchangeable deployments
      </text>
      {deployments.map((deployment, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const chipHeight = Math.min(25, rowHeight)
        const y = 68 + row * (rowHeight + gapY) + (rowHeight - chipHeight) / 2
        return (
          <ChainChip
            key={`${deployment.chain}-${deployment.address}`}
            deployment={deployment}
            x={PADDING + column * (cellWidth + gapX)}
            y={y}
            width={cellWidth}
            height={chipHeight}
          />
        )
      })}
    </>
  )
}

function VolumeBars({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  return (
    <>
      <TitleLine node={node} width={width} />
      <MinterLine node={node} x={PADDING} y={42} maxX={width - PADDING} />
      <TwoColumnRows
        node={node}
        x={PADDING}
        y={54}
        width={width - PADDING * 2}
        height={height - 66}
        bars
      />
    </>
  )
}

function BalancedOpenGrid({
  node,
  width,
  height,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
}) {
  return (
    <>
      <TitleLine node={node} width={width} />
      <text x={PADDING} y={40} className="fill-secondary text-label-value-12">
        One burn-mint set across {node.deployments.length} chains
      </text>
      <MinterLine node={node} x={PADDING} y={58} maxX={width - PADDING} />
      <OpenGrid node={node} width={width} height={height} startY={66} />
    </>
  )
}

function TitleLine({
  node,
  width,
}: {
  node: InteropTokenRelationsNode
  width: number
}) {
  return (
    <>
      <text
        x={PADDING}
        y={20}
        className="fill-primary font-bold text-label-value-13"
      >
        {node.deployments[0]?.symbol ?? 'Token'}
      </text>
      {node.volume !== null && (
        <text
          x={width - PADDING}
          y={20}
          textAnchor="end"
          className="fill-secondary font-medium text-label-value-12"
        >
          {formatCurrency(node.volume, 'usd')}
        </text>
      )}
    </>
  )
}

function MinterLine({
  node,
  x,
  y,
  maxX,
  label = 'Burn & mint cluster via',
}: {
  node: InteropTokenRelationsNode
  x: number
  y: number
  maxX: number
  label?: string
}) {
  const bridge = node.bridges[0]
  const labelWidth = label.length * 5.1
  const iconX = x + labelWidth + 6
  const nameX = iconX + (bridge?.icon ? 18 : 0)
  const maxCharacters = Math.max(4, Math.floor((maxX - nameX) / 5.8))
  const summary = formatBridgeNames(
    node.bridges.map((candidate) => candidate.name),
    maxCharacters,
  )

  return (
    <g>
      <title>
        {node.bridges.map((candidate) => candidate.name).join(', ')}
      </title>
      <text x={x} y={y} className="fill-secondary text-label-value-12">
        {label}
      </text>
      {bridge?.icon && (
        <image href={bridge.icon} x={iconX} y={y - 11} width={14} height={14} />
      )}
      <text
        x={nameX}
        y={y}
        className="fill-primary font-medium text-label-value-12"
      >
        {shorten(summary, maxCharacters)}
      </text>
    </g>
  )
}

function CardGrid({
  node,
  width,
  height,
  startY,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
  startY: number
}) {
  const deployments = sortedDeployments(node)
  const columns = deployments.length <= 4 ? 2 : 3
  const rows = Math.ceil(deployments.length / columns)
  const gap = 6
  const cellWidth = (width - PADDING * 2 - gap * (columns - 1)) / columns
  const cellHeight = (height - startY - PADDING - gap * (rows - 1)) / rows

  return (
    <g>
      {deployments.map((deployment, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        return (
          <MemberCard
            key={`${deployment.chain}-${deployment.address}`}
            deployment={deployment}
            x={PADDING + column * (cellWidth + gap)}
            y={startY + row * (cellHeight + gap)}
            width={cellWidth}
            height={cellHeight}
          />
        )
      })}
    </g>
  )
}

function MemberCard({
  deployment,
  x,
  y,
  width,
  height,
}: {
  deployment: InteropTokenRelationsDeployment
  x: number
  y: number
  width: number
  height: number
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx={6}
        className="fill-surface-secondary stroke-divider"
        strokeWidth={0.75}
      />
      <ChainIcon
        deployment={deployment}
        x={8}
        y={(height - 13) / 2 - 5}
        size={13}
      />
      <text
        x={27}
        y={Math.min(17, height / 2)}
        className="fill-primary font-medium text-label-value-12"
      >
        {shorten(deployment.chainName, 17)}
      </text>
      <text
        x={width - 8}
        y={height - 6}
        textAnchor="end"
        className="fill-secondary text-label-value-12"
      >
        {formatDeploymentVolume(deployment)}
      </text>
    </g>
  )
}

function TwoColumnRows({
  node,
  x,
  y,
  width,
  height,
  compact = false,
  bars = false,
}: {
  node: InteropTokenRelationsNode
  x: number
  y: number
  width: number
  height: number
  compact?: boolean
  bars?: boolean
}) {
  const deployments = sortedDeployments(node)
  const columns = node.deployments.length <= 3 ? 1 : 2
  const rows = Math.ceil(deployments.length / columns)
  const columnGap = columns === 1 ? 0 : compact ? 8 : 16
  const cellWidth = (width - columnGap * (columns - 1)) / columns
  const rowHeight = height / rows
  const measuredVolumes = deployments.flatMap((deployment) =>
    deployment.volume === null ? [] : [deployment.volume],
  )
  const maxVolume = Math.max(0, ...measuredVolumes)

  return (
    <g>
      {deployments.map((deployment, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        return (
          <OpenRow
            key={`${deployment.chain}-${deployment.address}`}
            deployment={deployment}
            x={x + column * (cellWidth + columnGap)}
            y={y + row * rowHeight}
            width={cellWidth}
            height={rowHeight}
            compact={compact}
            barRatio={
              bars && deployment.volume !== null && maxVolume > 0
                ? deployment.volume / maxVolume
                : undefined
            }
          />
        )
      })}
    </g>
  )
}

function OpenRow({
  deployment,
  x,
  y,
  width,
  height,
  compact,
  barRatio,
}: {
  deployment: InteropTokenRelationsDeployment
  x: number
  y: number
  width: number
  height: number
  compact: boolean
  barRatio?: number
}) {
  const iconSize = compact ? 11 : 13
  const volume =
    deployment.volume === null ? '—' : formatDeploymentVolume(deployment)

  return (
    <g transform={`translate(${x}, ${y})`}>
      {barRatio !== undefined && (
        <rect
          x={0}
          y={3}
          width={Math.max(2, width * barRatio)}
          height={Math.max(1, height - 6)}
          rx={4}
          className="fill-brand"
          fillOpacity={0.09}
        />
      )}
      <line
        x1={0}
        x2={width}
        y1={height}
        y2={height}
        className="stroke-divider"
        strokeWidth={0.75}
      />
      <ChainIcon
        deployment={deployment}
        x={0}
        y={(height - iconSize) / 2}
        size={iconSize}
      />
      <text
        x={iconSize + 6}
        y={height / 2 + 4}
        className="fill-primary font-medium text-label-value-12"
      >
        {shorten(deployment.chainName, compact ? 7 : 15)}
      </text>
      <text
        x={width}
        y={height / 2 + 4}
        textAnchor="end"
        className="fill-secondary text-label-value-12"
      >
        {volume}
      </text>
    </g>
  )
}

function LogoMatrix({
  node,
  width,
  height,
  startY,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
  startY: number
}) {
  const deployments = sortedDeployments(node)
  const columns = deployments.length <= 4 ? deployments.length : 4
  const rows = Math.ceil(deployments.length / columns)
  const cellWidth = (width - PADDING * 2) / columns
  const cellHeight = (height - startY - 8) / rows

  return (
    <g>
      {deployments.map((deployment, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const centerX = PADDING + column * cellWidth + cellWidth / 2
        const top = startY + row * cellHeight
        const iconSize = Math.min(18, Math.max(13, cellHeight * 0.34))
        return (
          <g key={`${deployment.chain}-${deployment.address}`}>
            <ChainIcon
              deployment={deployment}
              x={centerX - iconSize / 2}
              y={top + 3}
              size={iconSize}
            />
            <text
              x={centerX}
              y={top + iconSize + 15}
              textAnchor="middle"
              className="fill-primary font-medium text-label-value-12"
            >
              {shorten(deployment.chainName, 10)}
            </text>
            <text
              x={centerX}
              y={Math.min(top + cellHeight - 3, top + iconSize + 28)}
              textAnchor="middle"
              className="fill-secondary text-label-value-12"
            >
              {deployment.volume === null
                ? '—'
                : formatDeploymentVolume(deployment)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function LeaderCard({
  deployment,
  x,
  y,
  width,
  height,
}: {
  deployment: InteropTokenRelationsDeployment
  x: number
  y: number
  width: number
  height: number
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx={7}
        className="fill-brand stroke-brand"
        fillOpacity={0.055}
        strokeOpacity={0.4}
      />
      <ChainIcon deployment={deployment} x={8} y={8} size={15} />
      <text
        x={29}
        y={20}
        className="fill-primary font-medium text-label-value-12"
      >
        {shorten(deployment.chainName, 13)}
      </text>
      <text
        x={width - 8}
        y={height - 8}
        textAnchor="end"
        className="fill-brand font-medium text-label-value-12"
      >
        {formatDeploymentVolume(deployment)}
      </text>
    </g>
  )
}

function RestMatrix({
  deployments,
  x,
  y,
  width,
  height,
}: {
  deployments: InteropTokenRelationsDeployment[]
  x: number
  y: number
  width: number
  height: number
}) {
  if (deployments.length === 0) return null
  const columns = Math.min(4, deployments.length)
  const rows = Math.ceil(deployments.length / columns)
  const cellWidth = width / columns
  const cellHeight = height / rows
  return (
    <g>
      {deployments.map((deployment, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const cellX = x + column * cellWidth
        const cellY = y + row * cellHeight
        return (
          <g key={`${deployment.chain}-${deployment.address}`}>
            <ChainIcon
              deployment={deployment}
              x={cellX}
              y={cellY + (cellHeight - 12) / 2}
              size={12}
            />
            <text
              x={cellX + 17}
              y={cellY + cellHeight / 2 + 4}
              className="fill-primary text-label-value-12"
            >
              {shorten(deployment.chainName, 8)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function ChainChip({
  deployment,
  x,
  y,
  width,
  height,
}: {
  deployment: InteropTokenRelationsDeployment
  x: number
  y: number
  width: number
  height: number
}) {
  const iconSize = Math.min(14, height - 6)
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx={height / 2}
        className="fill-surface-primary stroke-divider"
        strokeWidth={0.9}
      />
      <ChainIcon
        deployment={deployment}
        x={7}
        y={(height - iconSize) / 2}
        size={iconSize}
      />
      <text
        x={iconSize + 12}
        y={height / 2 + 4}
        className="fill-primary font-medium text-label-value-12"
      >
        {shorten(deployment.chainName, 14)}
      </text>
    </g>
  )
}

function OpenGrid({
  node,
  width,
  height,
  startY,
}: {
  node: InteropTokenRelationsNode
  width: number
  height: number
  startY: number
}) {
  const deployments = sortedDeployments(node)
  const columns = deployments.length <= 4 ? 2 : 3
  const rows = Math.ceil(deployments.length / columns)
  const columnGap = 10
  const cellWidth = (width - PADDING * 2 - columnGap * (columns - 1)) / columns
  const cellHeight = (height - startY - PADDING) / rows

  return (
    <g>
      {deployments.map((deployment, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const x = PADDING + column * (cellWidth + columnGap)
        const y = startY + row * cellHeight
        return (
          <g key={`${deployment.chain}-${deployment.address}`}>
            <line
              x1={x}
              x2={x + cellWidth}
              y1={y + cellHeight}
              y2={y + cellHeight}
              className="stroke-divider"
              strokeWidth={0.75}
            />
            <ChainIcon
              deployment={deployment}
              x={x}
              y={y + Math.max(3, cellHeight / 2 - 11)}
              size={13}
            />
            <text
              x={x + 19}
              y={y + Math.max(14, cellHeight / 2 - 1)}
              className="fill-primary font-medium text-label-value-12"
            >
              {shorten(deployment.chainName, 11)}
            </text>
            <text
              x={x + cellWidth}
              y={y + cellHeight - 5}
              textAnchor="end"
              className="fill-secondary text-label-value-12"
            >
              {deployment.volume === null
                ? '—'
                : formatDeploymentVolume(deployment)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function ChainIcon({
  deployment,
  x,
  y,
  size,
}: {
  deployment: InteropTokenRelationsDeployment
  x: number
  y: number
  size: number
}) {
  if (!deployment.iconUrl) return null
  return (
    <image href={deployment.iconUrl} x={x} y={y} width={size} height={size} />
  )
}

function sortedDeployments(
  node: InteropTokenRelationsNode,
): InteropTokenRelationsDeployment[] {
  return node.deployments.toSorted(byDeploymentVolume)
}

function byDeploymentVolume(
  a: InteropTokenRelationsDeployment,
  b: InteropTokenRelationsDeployment,
): number {
  return (b.volume ?? -1) - (a.volume ?? -1) || a.chain.localeCompare(b.chain)
}

function formatDeploymentVolume(
  deployment: InteropTokenRelationsDeployment,
): string {
  return deployment.volume === null
    ? 'No volume data'
    : formatCurrency(deployment.volume, 'usd')
}

function shorten(value: string, length: number): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value
}

function formatBridgeNames(names: string[], maxCharacters: number): string {
  if (names.length === 0) return 'Not identified'
  const full = names.join(', ')
  if (full.length <= maxCharacters) return full

  for (let visible = names.length - 1; visible >= 1; visible--) {
    const summary = `${names.slice(0, visible).join(', ')} +${names.length - visible}`
    if (summary.length <= maxCharacters) return summary
  }

  return shorten(names[0] ?? 'Not identified', maxCharacters)
}
