import { assertUnreachable } from '@l2beat/shared-pure'
import { ActivitySection } from './sections/ActivitySection'
import { BridgesTvsSection } from './sections/BridgesTvsSection'
import { ContractsSection } from './sections/contracts/ContractsSection'
import { CostsSection } from './sections/costs/CostsSection'
import { DaRiskSummarySection } from './sections/DaRiskSummarySection'
import { DetailedDescriptionSection } from './sections/DetailedDescriptionSection'
import { DataPostedSection } from './sections/data-posted/DataPostedSection'
import { GrissiniRiskAnalysisSection } from './sections/GrissiniRiskAnalysisSection'
import { GroupSection } from './sections/GroupSection'
import { L3RiskAnalysisSection } from './sections/L3RiskAnalysisSection'
import { LivenessSection } from './sections/LivenessSection'
import { MarkdownSection } from './sections/MarkdownSection'
import { MilestonesAndIncidentsSection } from './sections/MilestonesAndIncidentsSection'
import { PermissionsSection } from './sections/permissions/PermissionsSection'
import { ProgramHashesSection } from './sections/program-hashes/ProgramHashesSection'
import { RiskAnalysisSection } from './sections/RiskAnalysisSection'
import { RiskSummarySection } from './sections/RiskSummarySection'
import { SequencingSection } from './sections/SequencingSection'
import { StageSection } from './sections/StageSection'
import { StateDerivationSection } from './sections/StateDerivationSection'
import { StateValidationSection } from './sections/state-validation/StateValidationSection'
import { TechnologyChoicesSection } from './sections/TechnologyChoicesSection'
import { TrustedSetupSection } from './sections/TrustedSetupsSection'
import { ThroughputSection } from './sections/throughput/ThroughputSection'
import { ScalingTvsSection } from './sections/tvs/ScalingTvsSection'
import type { ProjectDetailsSection } from './sections/types'
import { UpcomingDisclaimer } from './sections/UpcomingDisclaimer'
import { VerifiersSection } from './sections/VerifiersSection'

interface ProjectDetailsProps {
  nested?: boolean
  parentSection?: string
  items: ProjectDetailsSection[]
  isUpcoming?: boolean
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div>
      {props.items.map((item, index) => {
        const { nested } = props
        const sectionOrder = props.parentSection
          ? `${props.parentSection}.${index + 1}`
          : `${index + 1}`

        switch (item.type) {
          case 'ScalingTvsSection':
            return (
              <ScalingTvsSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'BridgesTvsSection':
            return (
              <BridgesTvsSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'ActivitySection':
            return (
              <ActivitySection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'CostsSection':
            return (
              <CostsSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'DataPostedSection':
            return (
              <DataPostedSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'LivenessSection':
            return (
              <LivenessSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'ThroughputSection':
            return (
              <ThroughputSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'DetailedDescriptionSection':
            return (
              <DetailedDescriptionSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'MilestonesAndIncidentsSection':
            return (
              <MilestonesAndIncidentsSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'RiskSummarySection':
            return (
              <RiskSummarySection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'DaRiskSummarySection':
            return (
              <DaRiskSummarySection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'RiskAnalysisSection':
            return (
              <RiskAnalysisSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'L3RiskAnalysisSection':
            return (
              <L3RiskAnalysisSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'StageSection':
            return (
              <StageSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'TechnologyChoicesSection':
            return (
              <TechnologyChoicesSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'StateDerivationSection':
            return (
              <StateDerivationSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'StateValidationSection':
            return (
              <StateValidationSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'ProgramHashesSection':
            return (
              <ProgramHashesSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'TrustedSetupSection':
            return (
              <TrustedSetupSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'VerifiersSection':
            return (
              <VerifiersSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'MarkdownSection':
            return (
              <MarkdownSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'SequencingSection':
            return (
              <SequencingSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'PermissionsSection':
            return (
              <PermissionsSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'ContractsSection':
            return (
              <ContractsSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'UpcomingDisclaimer':
            return <UpcomingDisclaimer key={`${item.type}${index}`} />
          case 'Group':
            return (
              <GroupSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          case 'GrissiniRiskAnalysisSection':
            return (
              <GrissiniRiskAnalysisSection
                key={item.props.id}
                {...{ nested, sectionOrder }}
                {...item.props}
              />
            )
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
