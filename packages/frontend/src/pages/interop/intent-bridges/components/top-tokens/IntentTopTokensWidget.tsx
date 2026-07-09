import type { TokenData } from '~/server/features/scaling/interop/types'
import type { InteropTokenRowData } from '../../../components/InteropTokenRow'
import {
  InteropTopTokensWidget,
  type TopTokensTab,
} from '../../../components/InteropTopTokensWidget'
import { useInteropOverview } from '../../../components/useInteropOverview'
import { getInteropTokenUrl } from '../../../utils/getInteropTokenUrl'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'

export function IntentTopTokensWidget({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const { data, isLoading } = useInteropOverview()
  const intentData = data && 'activity' in data ? data : undefined
  const bridgesBySlug = new Map(intentBridges.map((b) => [b.slug, b]))

  const tabs: TopTokensTab[] = intentBridges.map((bridge) => ({
    id: bridge.id,
    iconUrl: bridge.iconUrl,
    label: bridge.name,
  }))

  const toRow = (
    token: TokenData,
    bridge: InteropIntentBridge | undefined,
    showBadge: boolean,
  ): InteropTokenRowData => {
    const flow = token.flows[0]
    return {
      tokenId: token.id,
      iconUrl: token.iconUrl,
      symbol: token.symbol,
      href: getInteropTokenUrl(token),
      volume: token.volume,
      transferCount: token.transferCount,
      badge:
        showBadge && bridge
          ? { color: bridge.color, iconUrl: bridge.iconUrl, label: bridge.name }
          : undefined,
      topRoute: flow ? { src: flow.srcChain, dst: flow.dstChain } : undefined,
      protocol: bridge
        ? {
            id: bridge.id,
            name: bridge.name,
            slug: bridge.slug,
            iconUrl: bridge.iconUrl,
          }
        : undefined,
    }
  }

  return (
    <InteropTopTokensWidget
      tabsName="topTokensIntentBridge"
      tabs={tabs}
      isLoading={isLoading}
      tabsListClassName="h-auto w-full flex-wrap justify-start"
      tabLabelClassName="@max-[420px]:hidden"
      getTabData={(activeTab) => {
        const activeBridge = intentBridges.find((b) => b.id === activeTab)
        const tokens =
          activeTab === 'all'
            ? intentData?.topTokens
            : intentData?.table.entries.find((e) => e.id === activeTab)?.tokens
        const value = activeBridge
          ? (tokens?.items.length ?? 0) + (tokens?.remainingCount ?? 0)
          : undefined
        const rows = (tokens?.items ?? []).map((token) => {
          const bridge =
            activeBridge ??
            (token.topProtocol
              ? bridgesBySlug.get(token.topProtocol.slug)
              : undefined)
          return toRow(token, bridge, activeTab === 'all')
        })
        return { activeCount: { value, label: 'active tokens' }, rows }
      }}
    />
  )
}
