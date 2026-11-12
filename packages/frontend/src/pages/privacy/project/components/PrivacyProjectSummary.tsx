import { formatCurrency } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { ProjectIconList } from '~/components/ProjectIconList'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import { getPrivacyAdversariesSummary } from '~/server/features/privacy/utils/toPrivacyAdversariesSummary'
import { cn } from '~/utils/cn'
import {
  getPrivacyAdversaryRosetteValues,
  PRIVACY_ADVERSARIES_SECTION_ID,
} from '../../adversaries/privacyAdversaryUi'
import { PrivacyChainTabs } from './PrivacyChainTabs'
import { PrivacyProjectRiskProfile } from './PrivacyProjectRiskProfile'
import { MOBILE_SUMMARY_ROWS, PrivacyProjectStats } from './PrivacyProjectStats'
import { PrivacyReferenceAppStat } from './PrivacyReferenceAppStat'

const CARD_CLASS_NAME =
  'scroll-mt-[100vh] border-divider max-md:rounded-none max-md:border-b max-md:pt-0'

interface Props {
  entry: ProjectPrivacyEntry
}

/**
 * The top of a privacy project page. A project with a page per tracked chain
 * gets a card for what is the same on every chain, then the chain tabs on the
 * card of the page's chain. Any other project gets it all in one card.
 */
export function PrivacyProjectSummary({ entry }: Props) {
  const { chainView } = entry
  if (!chainView) {
    return (
      <PrimaryCard
        id="summary"
        data-role="nav-section"
        className={CARD_CLASS_NAME}
      >
        <StatsAndRisks entry={entry}>
          <HorizontalSeparator className="max-md:my-2 md:mt-4" />
          <div
            className={cn(
              'flex flex-col md:mt-4 md:flex-row md:gap-8',
              MOBILE_SUMMARY_ROWS,
            )}
          >
            <ProjectSummaryStat
              title="Tracked on"
              tooltip="Chains on which the protocol deployment is tracked by ETHBEAT."
              value={
                <ProjectIconList
                  projects={entry.trackedOn}
                  title="Tracked on"
                />
              }
            />
            <RunsOnStat entry={entry} />
            <AttributesStat entry={entry} />
            <ReferenceAppStat entry={entry} />
          </div>
        </StatsAndRisks>
        <HorizontalSeparator className="my-4 max-md:hidden" />
        <About entry={entry} />
      </PrimaryCard>
    )
  }

  return (
    <>
      <PrimaryCard className={CARD_CLASS_NAME}>
        <div className="max-w-[80ch]">
          <About entry={entry} />
        </div>
        <HorizontalSeparator className="my-4 max-md:hidden" />
        <ul
          className={cn(
            'flex flex-col md:flex-row md:gap-12',
            MOBILE_SUMMARY_ROWS,
          )}
        >
          <AttributesStat entry={entry} />
          <ReferenceAppStat entry={entry} />
          <RunsOnStat entry={entry} />
        </ul>
      </PrimaryCard>
      {/* On phones the label and the total sit above the tabs. From md up the
          row is one line, and the tabs start past the card's rounded corner. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-md:pt-3 md:mt-4 md:flex-nowrap md:items-end md:px-4">
        <span className="font-medium text-paragraph-12 text-secondary max-md:pl-4 md:self-center">
          Tracked on
        </span>
        <div className="min-w-0 max-md:order-last max-md:w-full">
          <PrivacyChainTabs
            chains={chainView.chains}
            selectedId={chainView.selected.id}
          />
        </div>
        {chainView.allChainsValueLockedUsd !== undefined && (
          <div className="ml-auto flex shrink-0 items-baseline gap-2 whitespace-nowrap max-md:pr-4 md:self-center">
            <span className="font-medium text-paragraph-12 text-secondary">
              Value locked on {chainView.chains.length} chains
            </span>
            <span className="font-bold text-label-value-16">
              {formatCurrency(chainView.allChainsValueLockedUsd, 'usd')}
            </span>
          </div>
        )}
      </div>
      <PrimaryCard
        id="summary"
        data-role="nav-section"
        className={CARD_CLASS_NAME}
      >
        <StatsAndRisks entry={entry} />
      </PrimaryCard>
    </>
  )
}

/** The stats and the risk profile, with the rosette beside them on wide screens. */
function StatsAndRisks({ entry, children }: Props & { children?: ReactNode }) {
  const adversaries = getPrivacyAdversariesSummary(entry.sections)
  return (
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
        <HorizontalSeparator className="max-md:my-2 md:mt-4" />
        <PrivacyProjectRiskProfile
          trustedSetup={entry.trustedSetup}
          exitWindow={entry.exitWindow}
          adversaries={adversaries}
          href={entry.href}
          isUnderReview={entry.isUnderReview}
          reproducibility={entry.reproducibility}
          className="md:mt-4"
        />
        {children}
      </div>
      <VerticalSeparator className="mr-8 ml-12 h-[unset] self-stretch max-xl:hidden" />
      <BigPizzaRosette
        values={getPrivacyAdversaryRosetteValues(adversaries)}
        isUnderReview={entry.isUnderReview}
        size="small"
        className="my-auto max-xl:hidden"
      />
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

function ReferenceAppStat({ entry }: Props) {
  if (!entry.referenceApp) return null
  return (
    <PrivacyReferenceAppStat
      app={entry.referenceApp}
      href={`#${PRIVACY_ADVERSARIES_SECTION_ID}`}
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
