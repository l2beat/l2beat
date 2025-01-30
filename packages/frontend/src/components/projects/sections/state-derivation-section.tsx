import type { ScalingProjectStateDerivation } from '@l2beat/config'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface StateDerivationSectionProps
  extends ScalingProjectStateDerivation,
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
      <span className="text-lg font-bold md:text-xl">{props.title}</span>
      <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400 md:text-lg">
        {props.children}
      </Markdown>
    </div>
  )
}
