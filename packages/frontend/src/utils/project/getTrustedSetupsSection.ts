import type { Project } from '@l2beat/config'
import type { TrustedSetupSectionProps } from '~/components/projects/sections/TrustedSetupsSection'
import type { ProjectSectionProps } from '../../components/projects/sections/types'

export function getTrustedSetupsSection(
  project: Project<'zkCatalogInfo'>,
): Omit<TrustedSetupSectionProps, keyof ProjectSectionProps> {
  const byTrustedSetupId: Record<
    string,
    TrustedSetupSectionProps['trustedSetups'][number]
  > = {}

  for (const ts of project.zkCatalogInfo.trustedSetups) {
    const trustedSetup = byTrustedSetupId[ts.id]
    if (!trustedSetup) {
      byTrustedSetupId[ts.id] = {
        name: ts.name,
        risk: ts.risk,
        description: ts.longDescription,
        proofSystems: [ts.proofSystem],
      }
    } else {
      trustedSetup.proofSystems.push(ts.proofSystem)
    }
  }

  return {
    trustedSetups: Object.values(byTrustedSetupId),
  }
}
