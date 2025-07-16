import type { ProjectScalingStateDerivation } from '@l2beat/config'
import { Markdown } from '../../markdown/Markdown'
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
  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col gap-6">
        <Item title="Node software">{nodeSoftware}</Item>
        {compressionScheme && (
          <Item title="Compression scheme">{compressionScheme}</Item>
        )}
        <Item title="Genesis state">{genesisState}</Item>
        <Item title="Data format">{dataFormat}</Item>
      </div>
    </ProjectSection>
  )
}

function Item(props: { title: string; children: string }) {
  return (
    <div>
      <span className="text-heading-20">{props.title}</span>
      <Markdown className="mt-2 text-paragraph-15 md:text-paragraph-16">
        {props.children}
      </Markdown>
    </div>
  )
}
