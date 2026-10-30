import type { ProjectGovernanceInfo } from '@l2beat/config'
import { DiagramImage } from '~/components/DiagramImage'
import { cn } from '~/utils/cn'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { Markdown } from '../../markdown/Markdown'
import { GOVERNANCE_INFO_SECTIONS } from './governanceInfoSections'
import {
  type PastUpgradesData,
  PastUpgradesDialog,
  PastUpgradesStats,
} from './PastUpgradesDialog'
import { ProjectSection } from './ProjectSection'
import { PAST_UPGRADES_DESCRIPTION } from './sectionCopy'
import type { ProjectSectionProps } from './types'
import {
  isWaitingStep,
  parseUpgradePath,
  type UpgradePath,
} from './upgradePath'

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
        <div className="mt-8">
          <h3 className="font-bold text-heading-20">Past upgrades</h3>
          <p className="mt-2 text-paragraph-14 md:text-paragraph-15">
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
  const sections = GOVERNANCE_INFO_SECTIONS.map((section) => ({
    ...section,
    entries: Object.entries(governanceInfo[section.key] ?? {}),
  })).filter((section) => section.entries.length > 0)

  return sections.map((section) => (
    <div key={section.key} className="mt-6 md:mt-8">
      <h3 className="mb-3 text-heading-18">{section.title}</h3>
      {section.key === 'upgrades' ? (
        <UpgradesInfo entries={section.entries} />
      ) : (
        <GovernanceInfoList entries={section.entries} />
      )}
    </div>
  ))
}

function GovernanceInfoList({ entries }: { entries: [string, string][] }) {
  return (
    <dl className="border-divider border-t">
      {entries.map(([name, description]) => (
        <div
          key={name}
          className="grid gap-1 border-divider border-b py-3 md:grid-cols-[180px_1fr] md:gap-4"
        >
          <dt className="font-medium text-label-value-14 text-secondary md:pt-1">
            {name}
          </dt>
          <dd>
            <Markdown className="text-paragraph-14 md:text-paragraph-15">
              {description}
            </Markdown>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function UpgradesInfo({ entries }: { entries: [string, string][] }) {
  return (
    <div className="space-y-4">
      {entries.map(([name, description]) => {
        const path = parseUpgradePath(description)
        return path ? (
          <UpgradePathTimeline key={name} name={name} path={path} />
        ) : (
          <UpgradeCallout key={name} name={name} description={description} />
        )
      })}
    </div>
  )
}

function UpgradePathTimeline({
  name,
  path,
}: {
  name: string
  path: UpgradePath
}) {
  return (
    <div>
      <p className="mb-2.5 font-medium text-label-value-14 text-secondary">
        {name}
      </p>
      <ol>
        {path.steps.map((step, i) => {
          const isWaiting = isWaitingStep(step)
          return (
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
                    isWaiting
                      ? 'border-2 border-secondary bg-surface-primary'
                      : 'bg-brand',
                  )}
                />
              </span>
              <Markdown inline className={cn(isWaiting && 'text-secondary')}>
                {step}
              </Markdown>
            </li>
          )
        })}
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
  // Emergency paths skip the exit window, so they get the risk color.
  const isEmergency = /emergency/i.test(name)
  return (
    <div
      className={cn(
        'border-l-[3px] py-1 pl-3.5',
        isEmergency ? 'border-negative' : 'border-brand',
      )}
    >
      <p className="mb-0.5 font-medium text-label-value-14 text-secondary">
        {name}
      </p>
      <Markdown className="text-paragraph-14 md:text-paragraph-15">
        {description}
      </Markdown>
    </div>
  )
}
