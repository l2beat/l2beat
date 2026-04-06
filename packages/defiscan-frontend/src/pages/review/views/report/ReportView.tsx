import { useNavigate, useSearchParams } from 'react-router-dom'
import type { CompiledReview } from '../../../../types'
import { HeroSection } from './HeroSection'
import { KeyFindingsCarousel } from './KeyFindingsCarousel'
import { TVSSection } from './TVSSection'
import { CodeQualitySection } from './CodeQualitySection'
import { AdminsSection } from './AdminsSection'
import { GovernanceSection } from './GovernanceSection'
import { DependenciesSection } from './DependenciesSection'
import { FrontendsSection } from './FrontendsSection'
import { ActivitySection } from './ActivitySection'

interface ReportViewProps {
  review: CompiledReview
  onExportPdf: () => void
}

export function ReportView({ review, onExportPdf }: ReportViewProps) {
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()

  function goToExplorerTab(tab: string) {
    setSearchParams({ view: 'explorer', tab }, { replace: true })
  }

  function goToActivity() {
    setSearchParams({ view: 'activity' }, { replace: true })
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-16 md:gap-[80px] pb-12 md:pb-24">
      {/* Hero */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
          <HeroSection review={review} onExportPdf={onExportPdf} />
        </div>
      </section>

      {/* Key Findings */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <KeyFindingsCarousel review={review} />
      </section>

      {/* TVS */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <TVSSection review={review} onShowMore={() => goToExplorerTab('funds')} />
      </section>

      {/* Code Quality */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <CodeQualitySection review={review} />
      </section>

      {/* Active Admins */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <AdminsSection review={review} onShowMore={() => goToExplorerTab('admins')} />
      </section>

      {/* Governance */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <GovernanceSection review={review} onShowMore={() => goToExplorerTab('governance')} />
      </section>

      {/* Dependencies */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <DependenciesSection review={review} onShowMore={() => goToExplorerTab('dependencies')} />
      </section>

      {/* Frontends */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <FrontendsSection review={review} />
      </section>

      {/* Protocol Activity */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <ActivitySection review={review} onShowMore={goToActivity} />
      </section>
    </div>
  )
}
