import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
import { VERIFIER_STATUS_ORDER } from './VerifiedCountWithDetails'

interface Props {
  data: ZkCatalogEntry['trustedSetupsByProofSystem'][string]['projectsUsedInByStatus']
}

export function ProjectsUsedInByStatus({ data }: Props) {
  const statuses = VERIFIER_STATUS_ORDER.filter((status) => data[status])

  if (statuses.length === 0) {
    return <NotApplicableBadge />
  }

  return (
    <div className="flex flex-col items-start gap-1.5 py-2">
      {statuses.map((status) => (
        <ProjectsUsedIn
          key={status}
          usedIn={data[status] ?? []}
          noL2ClassName="font-medium text-label-value-12 text-secondary"
        />
      ))}
    </div>
  )
}
