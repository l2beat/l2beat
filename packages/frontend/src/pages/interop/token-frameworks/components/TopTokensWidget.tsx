import type { TopTokenItem } from '~/server/features/scaling/interop/getTokenFrameworksData'
import type { InteropTokenRowData } from '../../components/InteropTokenRow'
import {
  InteropTopTokensWidget,
  type TopTokensTab,
} from '../../components/InteropTopTokensWidget'
import { useInteropOverview } from '../../components/useInteropOverview'
import { getInteropTokenUrl } from '../../utils/getInteropTokenUrl'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'

export function TopTokensWidget({
  tokenFrameworks,
}: {
  tokenFrameworks: InteropTokenFramework[]
}) {
  const { data, isLoading } = useInteropOverview()
  const frameworkData = data && 'frameworkDominance' in data ? data : undefined
  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))

  const tabs: TopTokensTab[] = tokenFrameworks.map((framework) => ({
    id: framework.id,
    iconUrl: framework.iconUrl,
    label: framework.label,
  }))

  const toRow = (
    token: TopTokenItem,
    framework: InteropTokenFramework | undefined,
    showBadge: boolean,
  ): InteropTokenRowData => ({
    tokenId: token.id,
    iconUrl: token.iconUrl,
    symbol: token.symbol,
    href: getInteropTokenUrl(token),
    volume: token.volume,
    transferCount: token.transferCount,
    badge:
      showBadge && framework
        ? {
            color: framework.color,
            iconUrl: framework.iconUrl,
            label: framework.label,
          }
        : undefined,
    topRoute: token.topRoute
      ? { src: token.topRoute.src, dst: token.topRoute.dst }
      : undefined,
    protocol: framework
      ? {
          id: framework.projectId,
          name: framework.name,
          slug: framework.slug,
          iconUrl: framework.iconUrl,
        }
      : undefined,
  })

  return (
    <InteropTopTokensWidget
      tabsName="topTokensFramework"
      tabs={tabs}
      isLoading={isLoading}
      className="md:col-span-2 lg:row-span-5"
      tabsListClassName="h-6 w-fit"
      getTabData={(activeTab) => {
        const items =
          activeTab === 'all'
            ? frameworkData?.topTokens
            : frameworkData?.frameworkTable.find((e) => e.id === activeTab)
                ?.tokens
        const value = activeTab === 'all' ? undefined : items?.length
        const rows = (items ?? []).slice(0, 5).map((token) => {
          const framework =
            activeTab === 'all'
              ? token.frameworkId
                ? frameworksById.get(token.frameworkId)
                : undefined
              : frameworksById.get(activeTab)
          return toRow(token, framework, activeTab === 'all')
        })
        return { activeCount: { value, label: 'total tokens' }, rows }
      }}
    />
  )
}
