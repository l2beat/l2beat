import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CompiledReview } from '../../../../types'
import { Modal } from '../../../../components/Modal'
import { HeroSection } from './HeroSection'
import { KeyFindingsCarousel } from './KeyFindingsCarousel'
import { TVSSection } from './TVSSection'
import { CodeQualitySection } from './CodeQualitySection'
import { AdminsSection } from './AdminsSection'
import { GovernanceSection } from './GovernanceSection'
import { DependenciesSection } from './DependenciesSection'
import { FrontendsSection } from './FrontendsSection'
import { ActivitySection } from './ActivitySection'
import { FundsTab } from '../explorer/FundsTab'
import { AdminsTab } from '../explorer/AdminsTab'
import { GovernanceTab } from '../explorer/GovernanceTab'
import { DepsTab } from '../explorer/DepsTab'

type ModalType = 'funds' | 'admins' | 'governance' | 'dependencies' | null

const MODAL_TITLES: Record<Exclude<ModalType, null>, string> = {
  funds: 'TVS Breakdown',
  admins: 'Active Admins',
  governance: 'Governance',
  dependencies: 'Dependencies',
}

interface ReportViewProps {
  review: CompiledReview
  onExportPdf: () => void
}

export function ReportView({ review, onExportPdf }: ReportViewProps) {
  const [, setSearchParams] = useSearchParams()
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  function goToActivity() {
    setSearchParams({ view: 'activity' }, { replace: true })
    window.scrollTo(0, 0)
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
        <TVSSection review={review} onShowMore={() => setActiveModal('funds')} />
      </section>

      {/* Code Quality */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <CodeQualitySection review={review} />
      </section>

      {/* Active Admins */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <AdminsSection review={review} onShowMore={() => setActiveModal('admins')} />
      </section>

      {/* Governance */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <GovernanceSection review={review} onShowMore={() => setActiveModal('governance')} />
      </section>

      {/* Dependencies */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <DependenciesSection review={review} onShowMore={() => setActiveModal('dependencies')} />
      </section>

      {/* Frontends */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <FrontendsSection review={review} />
      </section>

      {/* Protocol Activity */}
      <section className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <ActivitySection review={review} onShowMore={goToActivity} />
      </section>

      {/* Show More modals */}
      {activeModal && (
        <Modal
          title={MODAL_TITLES[activeModal]}
          onClose={() => setActiveModal(null)}
        >
          {activeModal === 'funds' && <FundsTab review={review} />}
          {activeModal === 'admins' && <AdminsTab review={review} />}
          {activeModal === 'governance' && <GovernanceTab review={review} />}
          {activeModal === 'dependencies' && <DepsTab review={review} />}
        </Modal>
      )}
    </div>
  )
}
