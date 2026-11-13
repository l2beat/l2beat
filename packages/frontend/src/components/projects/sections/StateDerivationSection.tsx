import type { ProjectScalingStateDerivation } from '@l2beat/config'
import { DefinitionList } from './DefinitionList'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface StateDerivationSectionProps
  extends ProjectScalingStateDerivation,
    ProjectSectionProps {}

export function StateDerivationSection({
  nodeSoftware,
  compressionScheme,
  genesisState,
  dataFormat,
  ...sectionProps
}: StateDerivationSectionProps) {
  const entries: [string, string][] = [
    ['Node software', nodeSoftware],
    ...(compressionScheme
      ? [['Compression scheme', compressionScheme] as [string, string]]
      : []),
    ['Genesis state', genesisState],
    ['Data format', dataFormat],
  ]
  return (
    <ProjectSection {...sectionProps}>
      <DefinitionList entries={entries} />
    </ProjectSection>
  )
}
