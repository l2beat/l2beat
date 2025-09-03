import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'

export function BridgeUsedByCell({ bridge }: { bridge: DaBridgeSummaryEntry }) {
  return (
    <ProjectsUsedIn usedIn={bridge.usedIn} className="font-medium text-sm" />
  )
}
