import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { BigPizzaRosette } from '../../rosette/pizza/big-pizza-rosette'
import type { RosetteValue } from '../../rosette/types'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'
import { RiskBanner } from '../risk-banner'

export interface RiskAnalysisSectionProps extends ProjectSectionProps {
  rosetteValues: RosetteValue[]
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
  shouldHideRosette?: boolean | undefined
}

export function RiskAnalysisSection({
  rosetteValues,
  warning,
  isVerified,
  redWarning,
  shouldHideRosette,
  ...sectionProps
}: RiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    Object.values(rosetteValues).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection {...sectionProps} isUnderReview={isUnderReview}>
      {isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4"
          icon={UnverifiedIcon}
        />
      )}
      {redWarning && (
        <WarningBar
          text={redWarning}
          color="red"
          className="mt-4"
          icon={ShieldIcon}
        />
      )}
      {warning && (
        <WarningBar
          text={warning}
          color="yellow"
          isCritical={false}
          className="mt-4"
        />
      )}

      {!shouldHideRosette && (
        <BigPizzaRosette values={rosetteValues} className="mx-auto my-6" />
      )}
      <div className="space-y-6">
        {Object.values(rosetteValues).map((value) => (
          <RiskBanner key={value.name} {...value} />
        ))}
      </div>
    </ProjectSection>
  )
}
