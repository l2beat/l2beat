import { useState } from 'react'
import type { CompiledReview } from '../../../../types'
import { computeEntityDependencyCount } from '../../../../utils/dependencies'
import { getHumanAdmins } from '../../../../utils/admins'
import { OverviewTab } from './OverviewTab'
import { AdminsTab } from './AdminsTab'
import { DepsTab } from './DepsTab'
import { FundsTab } from './FundsTab'
import { ContractsTab } from './ContractsTab'
import { GovernanceTab } from './GovernanceTab'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'funds', label: 'Funds' },
  { id: 'admins', label: 'Admins' },
  { id: 'governance', label: 'Governance' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'contracts', label: 'Contracts' },
] as const

type TabId = (typeof TABS)[number]['id']

interface ExplorerViewProps {
  review: CompiledReview
}

export function ExplorerView({ review }: ExplorerViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  return (
    <div>
      {/* Tab navigation */}
      <nav className="flex gap-0 border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const count = getTabCount(tab.id, review)
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'text-purple-600 border-purple-600'
                  : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border'
              }`}
            >
              {tab.label}
              {count !== null && (
                <span
                  className={`ml-1.5 text-xs ${isActive ? 'text-purple-400' : 'text-text-muted'}`}
                >
                  ({count})
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab review={review} />}
        {activeTab === 'funds' && <FundsTab review={review} />}
        {activeTab === 'admins' && <AdminsTab review={review} />}
        {activeTab === 'governance' && <GovernanceTab review={review} />}
        {activeTab === 'dependencies' && <DepsTab review={review} />}
        {activeTab === 'contracts' && <ContractsTab review={review} />}
      </div>
    </div>
  )
}

function getTabCount(
  tabId: TabId,
  review: CompiledReview,
): number | null {
  switch (tabId) {
    case 'admins':
      return getHumanAdmins(review.admins).filter((a) => !a.isGovernance)
        .length
    case 'governance':
      return review.admins.filter((a) => a.isGovernance).length
    case 'dependencies':
      return computeEntityDependencyCount(review.dependencies)
    case 'funds':
      return review.funds.length
    case 'contracts':
      return review.totals.contractCount
    default:
      return null
  }
}
