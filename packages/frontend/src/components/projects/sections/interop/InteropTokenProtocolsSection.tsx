import { AllProtocolsTable } from '~/pages/interop/components/table/AllProtocolsTable'
import { useInteropTokenDashboard } from '~/pages/interop/token/InteropTokenDashboardContext'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export type InteropTokenProtocolsSectionProps = ProjectSectionProps

export function InteropTokenProtocolsSection({
  ...sectionProps
}: InteropTokenProtocolsSectionProps) {
  const { data, isLoading } = useInteropTokenDashboard()

  return (
    <ProjectSection {...sectionProps}>
      {data?.entries && data.entries.length > 0 && (
        <AllProtocolsTable
          type={undefined}
          entries={data.entries}
          hideTypeColumn
          hideTokensColumn
        />
      )}
      {!isLoading && (!data?.entries || data.entries.length === 0) && (
        <div className="rounded-lg bg-surface-secondary px-4 py-3 font-medium text-label-value-14 text-secondary">
          No protocol data for this token.
        </div>
      )}
    </ProjectSection>
  )
}
