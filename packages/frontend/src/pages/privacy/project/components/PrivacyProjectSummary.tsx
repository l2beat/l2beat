import compact from 'lodash/compact'
import { type ReactNode, useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { ProjectIconList } from '~/components/ProjectIconList'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import {
  PrivacyChainFilter,
  PrivacyChainLinks,
} from '~/components/projects/sections/privacy/PrivacyChainFilter'
import { ChainIcon } from '~/components/projects/sections/SectionChainBadge'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import type { PrivacyDeployments } from '~/server/features/privacy/getPrivacyProjectDetails'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import { cn } from '~/utils/cn'
import {
  getPrivacyAdversaryRosetteValues,
  PRIVACY_ADVERSARIES_SECTION_ID,
} from '../../adversaries/privacyAdversaryUi'
import { PrivacyProjectRiskProfile } from './PrivacyProjectRiskProfile'
import { MOBILE_SUMMARY_ROWS, PrivacyProjectStats } from './PrivacyProjectStats'

interface Props {
  entry: ProjectPrivacyEntry
}

/**
 * The top of a privacy project page. A project deployed on several chains
 * reads from the protocol down: what is the same on every chain, then the
 * metrics of all of them, which a switch narrows to one chain, then the risk
 * research of one deployment, which the switch leaves alone.
 */
export function PrivacyProjectSummary({ entry }: Props) {
  return (
    <PrimaryCard
      id="summary"
      data-role="nav-section"
      className="scroll-mt-[100vh] border-divider max-md:rounded-none max-md:border-b max-md:pt-0"
    >
      {entry.deployments ? (
        <>
          <About entry={entry} />
          <HorizontalSeparator className="my-4 max-md:hidden" />
          <ProtocolFacts entry={entry} withoutTrackedOn />
          <HorizontalSeparator className="max-md:my-2 md:my-4" />
          <StatsAndRisks entry={entry} />
        </>
      ) : (
        <>
          <StatsAndRisks entry={entry}>
            <HorizontalSeparator className="max-md:my-2 md:mt-4" />
            <ProtocolFacts entry={entry} className="md:mt-4" />
          </StatsAndRisks>
          <HorizontalSeparator className="my-4 max-md:hidden" />
          <About entry={entry} />
        </>
      )}
    </PrimaryCard>
  )
}

/**
 * What is the same on every chain the protocol is deployed on. A project on
 * several chains leaves out Tracked on, since its switches name the chains.
 */
function ProtocolFacts({
  entry,
  withoutTrackedOn,
  className,
}: Props & { withoutTrackedOn?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:gap-8',
        MOBILE_SUMMARY_ROWS,
        className,
      )}
    >
      {!withoutTrackedOn && (
        <ProjectSummaryStat
          title="Tracked on"
          tooltip="Chains on which the protocol deployment is tracked by ETHBEAT."
          value={
            <ProjectIconList projects={entry.trackedOn} title="Tracked on" />
          }
        />
      )}
      <RunsOnStat entry={entry} />
      <AttributesStat entry={entry} />
    </div>
  )
}

/**
 * The stats, then the risk profile with the rosette beside it on wide
 * screens: the rosette is the privacy grade drawn, so it sits with the risks.
 */
function StatsAndRisks({ entry, children }: Props & { children?: ReactNode }) {
  const adversaries = getPrivacyAdversariesSummary(entry.sections)
  const { deployments } = entry
  const [chainId, setChainId] = useState<string>()
  const chain = deployments?.chains.find((c) => c.id === chainId)
  return (
    <div>
      {deployments && (
        <MetricsCaption
          deployments={deployments}
          chainId={chainId}
          onChainChange={setChainId}
        />
      )}
      {chain ? (
        // Relayers are counted for the project as a whole.
        <PrivacyProjectStats
          totalValueLockedUsd={chain.valueLocked?.usd}
          totalValueLockedChange7d={chain.valueLocked?.change7d}
          hasTvl={chain.valueLocked !== undefined}
          assetsCount={chain.assets.length}
          bucketsCount={chain.bucketCount}
          deposits={chain.deposits}
        />
      ) : (
        <PrivacyProjectStats
          totalValueLockedUsd={entry.summary.totalValueLockedUsd}
          totalValueLockedChange7d={entry.summary.totalValueLockedChange7d}
          hasTvl={entry.hasTvl}
          assetsCount={entry.assetsCount}
          bucketsCount={entry.bucketCount}
          deposits={entry.summary.deposits}
          relayerStat={entry.summary.relayerStat}
        />
      )}
      <HorizontalSeparator className="max-md:my-2 md:my-4" />
      <div className="flex items-center">
        <div className="w-full min-w-0">
          {deployments && <ResearchCaption deployments={deployments} />}
          <PrivacyProjectRiskProfile
            trustedSetup={entry.trustedSetup}
            exitWindow={entry.exitWindow}
            adversaries={adversaries}
            href={entry.href}
            isUnderReview={entry.isUnderReview}
            reproducibility={entry.reproducibility}
            referenceApp={
              entry.referenceApp && {
                app: entry.referenceApp,
                href: `#${PRIVACY_ADVERSARIES_SECTION_ID}`,
              }
            }
          />
        </div>
        <VerticalSeparator className="mr-8 ml-12 h-[unset] self-stretch max-xl:hidden" />
        <BigPizzaRosette
          values={getPrivacyAdversaryRosetteValues(adversaries)}
          isUnderReview={entry.isUnderReview}
          size="small"
          className="shrink-0 max-xl:hidden"
        />
      </div>
      {children}
    </div>
  )
}

/**
 * Picks the chains the summary metrics are of: all of them by default, which
 * the stats add up, or one.
 */
function MetricsCaption({
  deployments,
  chainId,
  onChainChange,
}: {
  deployments: PrivacyDeployments
  chainId: string | undefined
  onChainChange: (chain: string | undefined) => void
}) {
  return (
    <Caption label="Metrics">
      <PrivacyChainFilter
        name="privacySummaryChain"
        chains={deployments.chains}
        value={chainId}
        onChange={onChainChange}
        size="small"
      />
    </Caption>
  )
}

/**
 * Names the deployment the risks are of, and the chains that are tracked
 * only. With several researched, it links their pages, the shown one picked.
 */
function ResearchCaption({ deployments }: { deployments: PrivacyDeployments }) {
  const { research } = deployments
  const researched = deployments.chains.filter(
    (chain) => chain.research !== 'none' && chain.href,
  )
  const trackedOnly = deployments.chains.filter(
    (chain) => chain.research === 'none',
  )
  const trackedOnlyNote =
    trackedOnly.length > 0 &&
    `${trackedOnly.map((chain) => chain.name).join(', ')} ${trackedOnly.length === 1 ? 'is' : 'are'} tracked only, not researched`
  if (researched.length < 2) {
    return (
      <Caption label="Risk research">
        <ChainIcon chain={research} className="ring-surface-primary" />
        <span>
          {research.name} deployment
          <span className="text-secondary">
            {' '}
            · the reference one{trackedOnlyNote && `; ${trackedOnlyNote}`}
          </span>
        </span>
      </Caption>
    )
  }
  const reference = deployments.chains.find(
    (chain) => chain.research === 'reference',
  )
  return (
    <Caption label="Risk research">
      <PrivacyChainLinks
        label="Researched deployments"
        chains={researched.flatMap((chain) =>
          chain.href ? [{ ...chain, href: chain.href }] : [],
        )}
        current={research.id}
      />
      <span className="text-secondary">
        {compact([
          reference && `${reference.name} is the reference deployment`,
          trackedOnlyNote,
        ]).join('; ')}
      </span>
    </Caption>
  )
}

function Caption({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-paragraph-12 max-md:py-2 md:mb-3">
      <span className="text-secondary text-subtitle-12 uppercase">{label}</span>
      {children}
    </div>
  )
}

function RunsOnStat({ entry }: Props) {
  if (entry.scalingProjects.length === 0) return null
  return (
    <ProjectSummaryStat
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
}

function AttributesStat({ entry }: Props) {
  if (entry.attributes.length === 0) return null
  return (
    <ProjectSummaryStat
      title="Attributes"
      tooltip="Protocol attributes and capabilities."
      valueClassName="flex flex-wrap justify-end gap-1 md:justify-start"
      value={entry.attributes.map((attribute) => (
        <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
      ))}
    />
  )
}

function About({ entry }: Props) {
  return (
    <div className="max-md:hidden">
      <div className="flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
        {entry.badges && entry.badges.length > 0 && (
          <BadgesSection badges={entry.badges} withDialog />
        )}
        {entry.description && <AboutSection description={entry.description} />}
      </div>
    </div>
  )
}
