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
import type { ProjectSectionProps } from './types'

type GovernanceInfoSectionKey =
  | 'securityCouncil'
  | 'upgrades'
  | 'tokenGovernance'

type GovernanceInfoSection = Record<string, string>

export type GovernanceInfo = Partial<
  Record<GovernanceInfoSectionKey, GovernanceInfoSection>
>

export interface UpgradesAndGovernanceSectionProps extends ProjectSectionProps {
  diagram?: DiagramParams
  content?: string
  mdClassName?: string
  governanceInfo?: GovernanceInfo
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
      {governanceInfo && (
        <GovernanceInfoTable governanceInfo={governanceInfo} />
      )}
      {pastUpgrades && (
        <div className="mt-8">
          <h3 className="font-bold text-heading-20">Past upgrades</h3>
          <p className="mt-2 text-paragraph-14 md:text-paragraph-15">
            The metrics include upgrades on the currently used proxy contracts.
            Historical proxy contracts and changes of such are not included.
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

const GOVERNANCE_INFO_SECTIONS: {
  key: GovernanceInfoSectionKey
  title: string
}[] = [
  { key: 'securityCouncil', title: 'Security Council' },
  { key: 'upgrades', title: 'Upgrades' },
  { key: 'tokenGovernance', title: 'Token governance' },
]

function GovernanceInfoTable({
  governanceInfo,
}: {
  governanceInfo: GovernanceInfo
}) {
  const sections = GOVERNANCE_INFO_SECTIONS.map((section) => ({
    ...section,
    entries: Object.entries(governanceInfo[section.key] ?? {}),
  })).filter((section) => section.entries.length > 0)

  if (sections.length === 0) {
    return null
  }

  return (
    <div className="mt-8 space-y-6">
      <GovernanceInfoHeading>Governance profile</GovernanceInfoHeading>
      {sections.map((section) => (
        <div key={section.key} className="space-y-3">
          <GovernanceInfoHeading small>{section.title}</GovernanceInfoHeading>
          <div className="overflow-x-auto rounded-lg border border-divider">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <tbody>
                {section.entries.map(([name, description]) => (
                  <tr
                    key={name}
                    className="border-divider border-t first:border-t-0"
                  >
                    <th className="w-1/3 bg-surface-secondary px-4 py-3 font-medium text-label-value-14 text-primary">
                      {name}
                    </th>
                    <td className="px-4 py-3 align-top">
                      <Markdown className="text-paragraph-14 md:text-paragraph-15">
                        {description}
                      </Markdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function GovernanceInfoHeading({
  children,
  small = false,
}: {
  children: string
  small?: boolean
}) {
  return (
    <div className="flex items-baseline gap-3">
      {small ? (
        <h4 className="whitespace-pre text-heading-18">{children}</h4>
      ) : (
        <h3 className="whitespace-pre text-heading-20">{children}</h3>
      )}
      <div className="w-full border-divider border-b-2" />
    </div>
  )
}
