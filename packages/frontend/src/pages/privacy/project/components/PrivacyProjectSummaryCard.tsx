import compact from 'lodash/compact'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { ProjectIconList } from '~/components/ProjectIconList'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import {
  ProofSystemsWithVerifiers,
  TechStackTags,
  type ZkCatalogSummary,
} from '~/pages/zk-catalog/v2/project/components/header/ZkCatalogProjectSummary'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import { cn } from '~/utils/cn'
import {
  getPrivacyAdversaryRosetteValues,
  PRIVACY_ADVERSARIES_SECTION_ID,
} from '../../adversaries/privacyAdversaryUi'
import { PrivacyProjectRiskProfile } from './PrivacyProjectRiskProfile'
import { MOBILE_SUMMARY_ROWS, PrivacyProjectStats } from './PrivacyProjectStats'
import { PrivacyReferenceAppStat } from './PrivacyReferenceAppStat'

interface Props {
  entry: ProjectPrivacyEntry
  /** For a privacy protocol that is also in the ZK Catalog. */
  zkCatalog?: ZkCatalogSummary
}

/** Stats, risk profile and adversary rosette at the top of a privacy page. */
export function PrivacyProjectSummaryCard({ entry, zkCatalog }: Props) {
  return (
    <PrimaryCard
      id="summary"
      data-role="nav-section"
      className="scroll-mt-[100vh] border-divider max-md:rounded-none max-md:border-b max-md:pt-0"
    >
      <div className="flex">
        <div className="w-full min-w-0">
          <PrivacyProjectStats
            totalValueLockedUsd={entry.summary.totalValueLockedUsd}
            totalValueLockedChange7d={entry.summary.totalValueLockedChange7d}
            hasTvl={entry.hasTvl}
            assetsCount={entry.assetsCount}
            bucketsCount={entry.bucketCount}
            deposits={entry.summary.deposits}
            relayerStat={entry.summary.relayerStat}
          />

          <PrivacyProjectRiskProfileRow entry={entry} zkCatalog={zkCatalog} />
          <HorizontalSeparator className="max-md:my-2 md:mt-4" />
          <div
            className={cn(
              'flex flex-col md:mt-4 md:flex-row md:gap-8',
              MOBILE_SUMMARY_ROWS,
            )}
          >
            {getPrivacySummaryStats(entry, { techStack: zkCatalog?.techStack })}
          </div>
        </div>
        <VerticalSeparator className="mr-8 ml-12 h-[unset] self-stretch max-xl:hidden" />
        <PrivacyProjectRosette
          entry={entry}
          className="my-auto max-xl:hidden"
        />
      </div>

      <HorizontalSeparator className="my-4 max-md:hidden" />
      <div className="max-md:hidden">
        <div className="flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
          {entry.badges && entry.badges.length > 0 && (
            <BadgesSection badges={entry.badges} withDialog />
          )}
          {entry.description && (
            <AboutSection description={entry.description} />
          )}
        </div>
      </div>
    </PrimaryCard>
  )
}

/** Privacy, trusted setup, exit window and reproducibility, under a rule. */
export function PrivacyProjectRiskProfileRow({
  entry,
  zkCatalog,
}: {
  entry: ProjectPrivacyEntry
  zkCatalog?: ZkCatalogSummary
}) {
  return (
    <>
      <HorizontalSeparator className="max-md:my-2 md:mt-4" />
      <PrivacyProjectRiskProfile
        trustedSetup={entry.trustedSetup}
        exitWindow={entry.exitWindow}
        adversaries={getPrivacyAdversariesSummary(entry.sections)}
        href={entry.href}
        isUnderReview={entry.isUnderReview}
        reproducibility={entry.reproducibility}
        trustedSetupDetails={
          zkCatalog && (
            <ProofSystemsWithVerifiers
              trustedSetupsByProofSystem={zkCatalog.trustedSetupsByProofSystem}
            />
          )
        }
        className="md:mt-4"
      />
    </>
  )
}

/**
 * Where the protocol runs, its attributes, zkVM (from the ZK Catalog's tech
 * stack) and reference app.
 */
export function getPrivacySummaryStats(
  entry: ProjectPrivacyEntry,
  options: { techStack?: ZkCatalogSummary['techStack'] } = {},
) {
  const trackedOn = (
    <ProjectSummaryStat
      key="tracked-on"
      title="Tracked on"
      tooltip="Chains on which the protocol deployment is tracked by ETHBEAT."
      value={<ProjectIconList projects={entry.trackedOn} title="Tracked on" />}
    />
  )
  const runsOn = entry.scalingProjects.length > 0 && (
    <ProjectSummaryStat
      key="runs-on"
      title="Runs on"
      tooltip="Scaling projects the protocol runs on."
      value={
        <ProjectIconList
          projects={entry.scalingProjects}
          title={`${entry.name} runs on`}
        />
      }
    />
  )
  const attributes = entry.attributes.length > 0 && (
    <ProjectSummaryStat
      key="attributes"
      title="Attributes"
      tooltip="Protocol attributes and capabilities."
      valueClassName="flex flex-wrap justify-end gap-1 md:justify-start"
      value={entry.attributes.map((attribute) => (
        <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
      ))}
    />
  )
  const zkVm = options.techStack && (
    <ProjectSummaryStat
      key="zkvm"
      title="zkVM"
      tooltip="The proving stack the protocol's circuits run on."
      value={<TechStackTags techStack={options.techStack} />}
    />
  )
  const referenceApp = entry.referenceApp && (
    <PrivacyReferenceAppStat
      key="reference-app"
      app={entry.referenceApp}
      href={`#${PRIVACY_ADVERSARIES_SECTION_ID}`}
    />
  )
  return compact([trackedOn, runsOn, attributes, zkVm, referenceApp])
}

export function PrivacyProjectRosette({
  entry,
  className,
}: {
  entry: ProjectPrivacyEntry
  className?: string
}) {
  return (
    <BigPizzaRosette
      values={getPrivacyAdversaryRosetteValues(
        getPrivacyAdversariesSummary(entry.sections),
      )}
      isUnderReview={entry.isUnderReview}
      size="small"
      className={className}
    />
  )
}
