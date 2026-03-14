import type { ReferenceLink } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { Markdown } from '../../markdown/Markdown'
import {
  type PastUpgradesData,
  PastUpgradesDialog,
  PastUpgradesStats,
} from './PastUpgradesDialog'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import type { TechnologyRisk } from './RiskList'
import { RiskList } from './RiskList'
import type { ProjectSectionProps } from './types'

export interface UpgradesAndGovernanceSectionProps extends ProjectSectionProps {
  diagram?: DiagramParams
  content?: string
  mdClassName?: string
  risks?: TechnologyRisk[]
  references?: ReferenceLink[]
  pastUpgrades?: PastUpgradesData
}

export function UpgradesAndGovernanceSection({
  diagram,
  content,
  mdClassName,
  risks,
  references,
  pastUpgrades,
  ...projectSectionProps
}: UpgradesAndGovernanceSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      {diagram ? (
        <figure className="mt-4 mb-8 text-center">
          <DiagramImage diagram={diagram} />
          <figcaption className="text-secondary text-xs">
            {diagram.caption}
          </figcaption>
        </figure>
      ) : null}
      {content && (
        <Markdown
          className={cn(mdClassName, 'text-paragraph-15 md:text-paragraph-16')}
        >
          {content}
        </Markdown>
      )}
      {pastUpgrades && (
        <div className="mt-8">
          <h3 className="font-bold text-heading-20">Past upgrades</h3>
          <p className="mt-2 text-paragraph-14 md:text-paragraph-15">
            The metrics include upgrades on the currently used proxy contracts.
            Historical proxy contracts and changes of such are not included.
          </p>
          <PastUpgradesDialog pastUpgrades={pastUpgrades} />
          <PastUpgradesStats pastUpgrades={pastUpgrades} className="mt-2" />
        </div>
      )}
      {risks && risks?.length > 0 && <RiskList risks={risks} />}
      {references && references?.length > 0 && (
        <ReferenceList references={references} />
      )}
    </ProjectSection>
  )
}
