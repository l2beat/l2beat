import type { ProjectRedWarning, Sentiment } from '@l2beat/config'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { BigIndividualRosette } from '~/components/rosette/individual/BigIndividualRosette'
import type { RosetteValueTuple } from '~/components/rosette/individual/IndividualRosetteIcon'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import { SentimentText } from '~/components/SentimentText'
import { EM_DASH } from '~/consts/characters'
import { ShieldIcon } from '~/icons/Shield'
import { cn } from '~/utils/cn'
import type { UnverifiedContractEntry } from '~/utils/project/contracts-and-permissions/getUnverifiedContractEntries'
import { sentimentToTransparentBgColor } from '~/utils/sentiment'
import { WarningBar } from '../../WarningBar'
import { RiskBanner } from '../RiskBanner'
import { ProjectSection } from './ProjectSection'
import { L3_RISKS_DESCRIPTION, l3RisksShownText } from './sectionCopy'
import type { ProjectSectionProps } from './types'
import { UnverifiedContractsWarning } from './UnverifiedContractsWarning'

export interface L3RiskAnalysisSectionProps extends ProjectSectionProps {
  l2: {
    name: string
    risks: RosetteValueTuple
  }
  l3: {
    name: string
    risks: RosetteValueTuple
  }
  combined?: RosetteValueTuple
  warning: string | undefined
  redWarning: ProjectRedWarning | undefined
  unverifiedContracts: UnverifiedContractEntry[]
}

export function L3RiskAnalysisSection({
  l2,
  l3,
  combined,
  warning,
  redWarning,
  unverifiedContracts,
  ...sectionProps
}: L3RiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    l2.risks
      .concat(l3.risks)
      .some(({ sentiment }) => sentiment === 'UnderReview')

  return (
    <ProjectSection {...sectionProps} isUnderReview={isUnderReview}>
      {/* Status signals lead the section, like the L2 risk analysis. */}
      <div className="space-y-4">
        {unverifiedContracts.length > 0 && (
          <UnverifiedContractsWarning
            entries={unverifiedContracts}
            className="text-paragraph-15 md:text-paragraph-16"
          />
        )}
        {redWarning && (
          <WarningBar
            text={redWarning.text}
            color="red"
            className="text-paragraph-15 md:text-paragraph-16"
            icon={ShieldIcon}
          />
        )}
        {warning && (
          <WarningBar
            text={warning}
            color="yellow"
            isCritical={false}
            className="text-paragraph-15 md:text-paragraph-16"
          />
        )}
      </div>
      <div
        className={cn(
          'font-normal text-paragraph-15 md:text-paragraph-16',
          (unverifiedContracts.length > 0 || redWarning || warning) && 'mt-4',
        )}
      >
        {L3_RISKS_DESCRIPTION}
      </div>

      <CombinedRiskTable l2={l2} l3={l3} combined={combined} />
      <div className="mt-8 flex flex-col gap-6 md:flex-row">
        <RosetteTile>
          <span className="font-medium text-label-value-15 text-primary">
            L2 & L3 individual risks
          </span>
          <div className="flex items-center justify-between">
            <BigIndividualRosette className="mx-auto my-6" l2={l2} l3={l3} />
          </div>
          <span className="text-center text-label-value-13 text-secondary">
            Inner ring: {l2.name} (L2) • Outer ring: {l3.name} (L3)
          </span>
        </RosetteTile>
        <RosetteTile>
          <span className="font-medium text-label-value-15 text-primary">
            L3 {combined ? 'combined' : 'individual'} risks
          </span>
          <div className="flex items-center justify-between">
            <BigPizzaRosette
              values={combined ? combined : l3.risks}
              className="mx-auto my-6"
              isUnderReview={isUnderReview || !combined}
            />
          </div>
        </RosetteTile>
      </div>
      <HorizontalSeparator className="mt-6 mb-7" />
      <h3 className="mb-2 font-semibold text-heading-16 leading-6 md:text-heading-18">
        L3 {combined ? 'combined' : 'individual'} risks
      </h3>
      <div className="mb-4 text-paragraph-15 md:text-paragraph-16">
        {l3RisksShownText(!!combined)}
      </div>
      <div className="space-y-6">
        {(combined ?? l3.risks).map((value) => (
          <RiskBanner key={value.name} {...value} size="large" />
        ))}
      </div>
    </ProjectSection>
  )
}

function RosetteTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-1">{children}</div>
  )
}

function CombinedRiskTable(props: {
  l2: {
    name: string
    risks: RosetteValueTuple
  }
  l3: {
    name: string
    risks: RosetteValueTuple
  }
  combined?: RosetteValueTuple
}) {
  return (
    <>
      <p className="mt-6 text-label-value-13 text-secondary md:hidden">
        Scroll sideways to see all five risks.
      </p>
      {/* Runs to the screen edge on phones, like the scrolling diagrams. */}
      <div className="max-md:-mx-4 overflow-x-auto overflow-y-hidden whitespace-nowrap max-md:px-4">
        <table className="mt-2 min-w-full border-separate border-spacing-0 overflow-x-scroll text-left text-label-value-13 md:mt-6">
          <thead>
            <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
              {/* Empty top-left header cell */}
              <th />
              <HeaderCell className="rounded-tl">Sequencer failure</HeaderCell>
              <HeaderCell>State validation</HeaderCell>
              <HeaderCell>Data availability</HeaderCell>
              <HeaderCell>Exit window</HeaderCell>
              <HeaderCell className="rounded-tr">Proposer failure</HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
              <HeaderCell className="rounded-tl">
                <span>{props.l2.name}</span>
                <div className="font-normal text-label-value-13 text-secondary leading-none">
                  L2
                </div>
              </HeaderCell>
              {props.l2.risks.map((risk) => (
                <RiskCell key={risk.name} {...risk} />
              ))}
            </tr>
            <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
              <HeaderCell>
                <span>{props.l3.name}</span>
                <div className="font-normal text-label-value-13 text-secondary leading-none">
                  L3 • Individual
                </div>
              </HeaderCell>
              {props.l3.risks.map((risk) => (
                <RiskCell key={risk.name} {...risk} />
              ))}
            </tr>
            <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-t-2">
              <HeaderCell className="rounded-bl border-t-divider">
                <span>{props.l3.name}</span>
                <div className="whitespace-nowrap font-normal text-label-value-13 text-secondary leading-none">
                  L3 • Combined
                </div>
              </HeaderCell>
              {props.combined
                ? props.combined.map((risk) => (
                    <RiskCell
                      key={risk.name}
                      {...risk}
                      backgroundFill
                      className="border-t-divider"
                    />
                  ))
                : Array.from({ length: 5 }).map((_, i) => (
                    <RiskCell
                      key={i}
                      value={EM_DASH}
                      sentiment="UnderReview"
                      className="border-t-divider"
                    />
                  ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

function HeaderCell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td
      className={cn(
        'border border-divider bg-surface-secondary px-3 py-2 font-medium text-label-value-13 text-primary',
        className,
      )}
    >
      {children}
    </td>
  )
}

function RiskCell(props: {
  sentiment?: Sentiment
  value: string
  backgroundFill?: boolean
  className?: string
}) {
  const bg = sentimentToTransparentBgColor(props.sentiment ?? 'neutral')

  return (
    <td
      className={cn(
        'border border-divider px-3 py-2',
        props.backgroundFill && bg,
        props.className,
      )}
    >
      <SentimentText
        sentiment={props.sentiment ?? 'neutral'}
        vibrant
        className="font-medium"
      >
        {props.value}
      </SentimentText>
    </td>
  )
}
