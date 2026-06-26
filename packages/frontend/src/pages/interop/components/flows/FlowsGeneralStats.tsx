import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { getInteropTokenUrl } from '../../utils/getInteropTokenUrl'
import { TokensDialog } from '../tokens/TokensDialog'
import { InteropTopItems } from '../top-items/TopItems'
import { FlowsParticleLegend } from './FlowsParticleLegend'
import { useScaledParticleCounts } from './graph/utils/useScaledParticleCounts'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsGeneralStats({
  title = 'General stats',
  description = 'For past 24h between the selected chains and protocols',
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  const trpc = useTRPC()
  const [isTokensDialogOpen, setIsTokensDialogOpen] = useState(false)
  const {
    selectedChains,
    allChains,
    selectedProtocols,
    setHighlightedChainPair,
  } = useInteropFlows()

  const queryInput = {
    chains: selectedChains,
    protocolIds: selectedProtocols,
  }
  const tokensQueryInput = {
    from: selectedChains,
    to: selectedChains,
    protocolIds: selectedProtocols,
    id: undefined,
  }

  const { data, isLoading } = useQuery(
    trpc.interop.flows.queryOptions(queryInput),
  )

  const { dollarsPerParticle } = useScaledParticleCounts(
    selectedChains,
    data?.chainData,
    data?.flows,
  )

  const topRoute = data?.stats.topRoute
  const srcChain = topRoute
    ? allChains.find((c) => c.id === topRoute.srcChain)
    : undefined
  const dstChain = topRoute
    ? allChains.find((c) => c.id === topRoute.dstChain)
    : undefined
  const topChain = data?.stats.topChain
  const topChainData = topChain
    ? allChains.find((c) => c.id === topChain.chainId)
    : undefined
  const topChainVolumeShare =
    topChain && data?.stats.totalVolume
      ? topChain.totalVolume / data.stats.totalVolume
      : 0
  const topToken = data?.stats.topToken
  const topProtocol = data?.stats.topProtocol

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary',
        className,
      )}
    >
      <div className="font-bold text-heading-20">{title}</div>
      <div className="mt-1 font-medium text-label-value-14 text-secondary">
        {description}
      </div>
      <div className="mt-1.5 space-y-2">
        <div className="grid grid-cols-1 gap-2 md:max-lg:grid-cols-3">
          <Card
            title="Volume"
            value={formatCurrency(data?.stats.totalVolume ?? 0, 'usd')}
            isLoading={isLoading}
          />
          <Card
            title="Active routes"
            value={formatInteger(data?.stats.activeFlows ?? 0)}
            isLoading={isLoading}
          />
          <Card
            title="Transfers"
            value={formatInteger(data?.stats.totalTransferCount ?? 0)}
            isLoading={isLoading}
          />
          <Card
            title="Unique tokens"
            value={formatInteger(data?.stats.tokenCount ?? 0)}
            isLoading={isLoading}
            footer={
              <UniqueTokensFooter
                isLoading={isLoading}
                tokenCount={data?.stats.tokenCount}
                topTokens={data?.stats.topTokens}
                selectedChains={selectedChains}
                setIsOpen={setIsTokensDialogOpen}
              />
            }
          />
        </div>
        <HorizontalSeparator className="my-4" />
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-divider bg-surface-primary p-4">
          <Card
            title="Top route"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              srcChain && dstChain ? (
                <button
                  type="button"
                  onClick={() =>
                    setHighlightedChainPair(srcChain.id, dstChain.id)
                  }
                  className="flex items-center gap-1.5 rounded p-1 transition-opacity hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
                >
                  <img
                    src={srcChain.iconUrl}
                    alt={srcChain.id}
                    className="size-5"
                  />
                  <ArrowRightIcon className="size-4 fill-brand" />
                  <img
                    src={dstChain.iconUrl}
                    alt={dstChain.id}
                    className="size-5"
                  />
                </button>
              ) : (
                '-'
              )
            }
          />
          <HorizontalSeparator />
          <Card
            title="Top chain"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              topChain && topChainData ? (
                <div className="flex flex-col items-center gap-0.5 text-heading-18">
                  {topChainData.href ? (
                    <a
                      href={topChainData.href}
                      className="text-brand hover:underline"
                    >
                      {topChainData.name}
                    </a>
                  ) : (
                    <span className="text-brand">{topChainData.name}</span>
                  )}
                  <span className="text-center font-medium text-label-value-13 text-secondary leading-tight">
                    {formatPercent(topChainVolumeShare)} of volume (
                    {formatCurrency(topChain.totalVolume, 'usd')})
                  </span>
                </div>
              ) : (
                '-'
              )
            }
          />
          <HorizontalSeparator />
          <Card
            title="Top protocol"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              topProtocol ? (
                <div className="flex flex-col items-center gap-0.5 text-heading-18">
                  <a
                    href={`/interop/protocols/${topProtocol.slug}`}
                    className="text-brand hover:underline"
                  >
                    {topProtocol.name}
                  </a>
                  <span className="text-center font-medium text-label-value-13 text-secondary leading-tight">
                    {formatCurrency(topProtocol.volume, 'usd')}
                  </span>
                </div>
              ) : (
                '-'
              )
            }
          />
          <HorizontalSeparator />
          <Card
            title="Top token"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              topToken ? (
                <TopTokenValue
                  topToken={topToken}
                  selectedChains={selectedChains}
                />
              ) : (
                '-'
              )
            }
          />
        </div>
      </div>
      <FlowsParticleLegend
        className="mt-auto pt-4"
        totalVolume={data?.stats.totalVolume ?? 0}
        dollarsPerParticle={dollarsPerParticle}
        isLoading={isLoading}
      />
      <TokensDialog
        isOpen={isTokensDialogOpen}
        setIsOpen={setIsTokensDialogOpen}
        queryInput={tokensQueryInput}
        title="All tokens & pairs by volume"
        showFlowsColumn={false}
      />
    </div>
  )
}

function TopTokenValue({
  topToken,
  selectedChains,
}: {
  topToken: {
    id: string
    symbol: string
    issuer: string | null
    iconUrl: string
    volume: number
  }
  selectedChains: string[]
}) {
  const content = (
    <>
      <img src={topToken.iconUrl} alt={topToken.symbol} className="size-5" />
      <span className="font-bold text-heading-20">{topToken.symbol}</span>
      <span className="font-medium text-label-value-14 text-secondary">
        {formatCurrency(topToken.volume, 'usd')}
      </span>
    </>
  )
  const href = getInteropTokenUrl(topToken, {
    from: selectedChains,
    to: selectedChains,
  })

  if (!href) {
    return <div className="flex items-center gap-1.5">{content}</div>
  }

  return (
    <a href={href} className="flex items-center gap-1.5 hover:underline">
      {content}
    </a>
  )
}

function UniqueTokensFooter({
  isLoading,
  tokenCount,
  topTokens,
  selectedChains,
  setIsOpen,
}: {
  isLoading: boolean
  tokenCount: number | undefined
  topTokens:
    | {
        items: {
          id: string
          symbol: string
          issuer: string | null
          iconUrl: string
          volume: number | null
        }[]
        remainingCount: number
      }
    | undefined
  selectedChains: string[]
  setIsOpen: (isOpen: boolean) => void
}) {
  const hasTokens =
    (tokenCount ?? 0) > 0 && !!topTokens && topTokens.items.length > 0

  if (isLoading) {
    return (
      <div className="flex items-center">
        {[0, 1, 2].map((index) => (
          <Skeleton
            key={index}
            className="-mr-1.5 size-5 rounded-full last:mr-0"
          />
        ))}
      </div>
    )
  }

  if (!hasTokens || !topTokens) {
    return null
  }

  return (
    <InteropTopItems
      topItems={{
        items: topTokens.items.map((token) => ({
          id: token.id,
          displayName: token.symbol,
          issuer: token.issuer,
          iconUrl: token.iconUrl,
          volume: token.volume,
          href: getInteropTokenUrl(token, {
            from: selectedChains,
            to: selectedChains,
          }),
        })),
        remainingCount: topTokens.remainingCount,
      }}
      className="mt-0.5"
      type="cell"
      setIsOpen={setIsOpen}
    />
  )
}

function Card({
  title,
  value,
  isLoading,
  className,
  footer,
}: {
  title: string
  value: ReactNode
  isLoading: boolean
  className?: string
  footer?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-lg border border-divider bg-surface-primary px-4 py-2',
        className,
      )}
    >
      <span className="font-medium text-label-value-14 text-secondary">
        {title}
      </span>
      {isLoading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <div className="font-bold text-heading-20">{value}</div>
      )}
      {footer}
    </div>
  )
}
