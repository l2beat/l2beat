import type { ProjectRiskCategory } from '@l2beat/config'
import type { HostChainRisksWarningProps } from '~/components/HostChainRisksWarning'
import { HostChainRisksWarning } from '~/components/HostChainRisksWarning'
import { WarningBar } from '~/components/WarningBar'
import { ShieldIcon } from '~/icons/Shield'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface RiskSummarySectionProps extends ProjectSectionProps {
  riskGroups: RiskGroup[]
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
  hostChainWarning?: HostChainRisksWarningProps
}

export interface RiskGroup {
  start: number
  name: ProjectRiskCategory
  items: RiskItem[]
}

interface RiskItem {
  text: string
  referencedId: string
  isCritical: boolean
}

export function RiskSummarySection({
  riskGroups,
  isVerified,
  redWarning,
  warning,
  hostChainWarning,
  ...sectionProps
}: RiskSummarySectionProps) {
  if (riskGroups.length === 0) {
    return null
  }
  return (
    <ProjectSection {...sectionProps}>
      {hostChainWarning && <HostChainRisksWarning {...hostChainWarning} />}
      {isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4 text-paragraph-15 md:text-paragraph-16"
          icon={UnverifiedIcon}
        />
      )}
      {redWarning && (
        <WarningBar
          text={redWarning}
          color="red"
          className="mt-4 text-paragraph-15 md:text-paragraph-16"
          icon={ShieldIcon}
        />
      )}
      {warning && (
        <WarningBar
          text={warning}
          color="yellow"
          isCritical={false}
          className="mt-4 text-paragraph-15 md:text-paragraph-16"
        />
      )}
      <div className="mt-4 md:mt-6">
        <EnumeratedRisks risks={riskGroups} />
      </div>
    </ProjectSection>
  )
}

export function EnumeratedRisks({ risks }: { risks: RiskGroup[] }) {
  return risks.map((group, i) => (
    <div
      className={cn(
        'text-paragraph-15 md:text-paragraph-16',
        i !== 0 && 'mt-4',
      )}
      key={i}
    >
      <h3 className="font-bold text-red-300">{group.name}</h3>
      <ol className="list-inside list-decimal px-1.5" start={group.start}>
        {group.items.map((item, i) => (
          <li key={i}>
            <a href={`#${item.referencedId}`} className="underline">
              {item.isCritical ? (
                <>
                  {item.text.slice(0, -1)}{' '}
                  <span className="text-red-300 underline"> (CRITICAL)</span>
                  {item.text.slice(-1)}
                </>
              ) : (
                item.text
              )}
            </a>
          </li>
        ))}
      </ol>
    </div>
  ))
}
