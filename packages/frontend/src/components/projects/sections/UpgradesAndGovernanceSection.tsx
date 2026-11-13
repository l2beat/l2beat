import type { ProjectGovernanceInfo, ProjectUpgradePath } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { Markdown } from '../../markdown/Markdown'
import { DefinitionList } from './DefinitionList'
import { GOVERNANCE_INFO_SECTIONS } from './governanceInfoSections'
import {
  type PastUpgradesData,
  PastUpgradesDialog,
  PastUpgradesStats,
} from './PastUpgradesDialog'
import { ProjectSection } from './ProjectSection'
import { PAST_UPGRADES_DESCRIPTION } from './sectionCopy'
import type { ProjectSectionProps } from './types'

export interface UpgradesAndGovernanceSectionProps extends ProjectSectionProps {
  diagram?: DiagramParams
  content?: string
  mdClassName?: string
  governanceInfo?: ProjectGovernanceInfo
  pastUpgrades?: PastUpgradesData
}

export function UpgradesAndGovernanceSection({
  diagram,
  content,
  mdClassName,
  governanceInfo,
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
      {governanceInfo && <GovernanceInfo governanceInfo={governanceInfo} />}
      {pastUpgrades && (
        <div className={cn((diagram || content || governanceInfo) && 'mt-8')}>
          <h3 className="font-semibold text-heading-16 leading-6 md:text-heading-18">
            Past upgrades
          </h3>
          <p className="mt-2 text-paragraph-15 md:text-paragraph-16">
            {PAST_UPGRADES_DESCRIPTION}
          </p>
          <PastUpgradesDialog
            pastUpgrades={pastUpgrades}
            showProxyContract={true}
          />
          <PastUpgradesStats pastUpgrades={pastUpgrades} className="mt-2" />
        </div>
      )}
    </ProjectSection>
  )
}

function GovernanceInfo({
  governanceInfo,
}: {
  governanceInfo: ProjectGovernanceInfo
}) {
  const sections = GOVERNANCE_INFO_SECTIONS.filter(
    (section) => Object.keys(governanceInfo[section.key] ?? {}).length > 0,
  )

  return sections.map((section) => (
    <div key={section.key} className="mt-6 md:mt-8">
      <h3 className="mb-3 font-semibold text-heading-16 leading-6 md:text-heading-18">
        {section.title}
      </h3>
      {section.key === 'upgrades' ? (
        <UpgradesInfo upgrades={governanceInfo.upgrades ?? {}} />
      ) : (
        <DefinitionList
          entries={Object.entries(governanceInfo[section.key] ?? {})}
        />
      )}
    </div>
  ))
}

function UpgradesInfo({
  upgrades,
}: {
  upgrades: NonNullable<ProjectGovernanceInfo['upgrades']>
}) {
  return (
    <div className="space-y-4">
      {Object.entries(upgrades).map(([name, value]) =>
        typeof value === 'string' ? (
          <UpgradeCallout key={name} name={name} description={value} />
        ) : (
          <UpgradePathTimeline key={name} name={name} path={value} />
        ),
      )}
    </div>
  )
}

function UpgradePathTimeline({
  name,
  path,
}: {
  name: string
  path: ProjectUpgradePath
}) {
  return (
    <div>
      <p className="mb-2.5 font-semibold text-label-value-14">{name}</p>
      <ol>
        {path.steps.map((step, i) => (
          <li
            key={i}
            className="relative flex gap-2 pb-3.5 text-paragraph-14 last:pb-0 md:text-paragraph-15"
          >
            {/* Runs from this dot's center to the next one's, behind both dots, so it never leaves a gap. */}
            {i < path.steps.length - 1 && (
              <span className="-bottom-[0.5lh] absolute top-[0.5lh] left-[9px] w-0.5 bg-divider" />
            )}
            {/* One line tall, so the dot sits on the first line's center at any font size. */}
            <span className="relative flex h-[1lh] w-5 shrink-0 items-center justify-center">
              <span
                className={cn(
                  'size-2.5 rounded-full',
                  step.isWait
                    ? 'border-2 border-secondary bg-surface-primary'
                    : 'bg-primary',
                )}
              />
            </span>
            <Markdown inline>{step.description}</Markdown>
          </li>
        ))}
      </ol>
      {path.note && (
        <Markdown className="mt-1 pl-7 text-paragraph-14 text-secondary">
          {path.note}
        </Markdown>
      )}
    </div>
  )
}

function UpgradeCallout({
  name,
  description,
}: {
  name: string
  description: string
}) {
  // Neutral for every path: the description states the risk, and a colour
  // picked from the name ("emergency") contradicted paths it didn't match.
  return (
    <div className="border-divider border-l-[3px] py-1 pl-3.5">
      <p className="mb-0.5 font-semibold text-label-value-14">{name}</p>
      <Markdown className="text-paragraph-14 md:text-paragraph-15">
        {description}
      </Markdown>
    </div>
  )
}
