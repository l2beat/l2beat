import { ShieldIcon } from '~/icons/Shield'
import { UnverifiedIcon } from '~/icons/Unverified'
import { BigPizzaRosette } from '../../rosette/pizza/BigPizzaRosette'
import type { RosetteValue } from '../../rosette/types'
import { WarningBar } from '../../WarningBar'
import { RiskBanner } from '../RiskBanner'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

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

      {!shouldHideRosette && (
        <div className="flex justify-center">
          <BigPizzaRosette values={rosetteValues} className="mx-auto my-6" />
        </div>
      )}
      <div className="space-y-6">
        {Object.values(rosetteValues).map((value) => (
          <RiskBanner key={value.name} {...value} size="large" />
        ))}
      </div>
    </ProjectSection>
  )
}
