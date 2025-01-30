import type { Sentiment } from '@l2beat/config'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { BigIndividualRosette } from '~/components/rosette/individual/big-individual-rosette'
import type { RosetteValueTuple } from '~/components/rosette/individual/individual-rosette-icon'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import { SentimentText } from '~/components/sentiment-text'
import { EM_DASH } from '~/consts/characters'
import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { cn } from '~/utils/cn'
import { sentimentToTransparentBgColor } from '~/utils/sentiment'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import { SingleRisk } from './risk-analysis-section'
import type { ProjectSectionProps } from './types'

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
  isVerified: boolean | undefined
  redWarning: string | undefined
}

export function L3RiskAnalysisSection({
  l2,
  l3,
  combined,
  warning,
  isVerified,
  redWarning,
  ...sectionProps
}: L3RiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    l2.risks
      .concat(l3.risks)
      .some(({ sentiment }) => sentiment === 'UnderReview')

  return (
    <ProjectSection {...sectionProps} isUnderReview={isUnderReview}>
      <div className="font-normal dark:text-white/80 md:text-lg md:leading-7">
        The L3 risks depend on the individual properties of L3 and those of the
        host chain combined.
      </div>
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

      <CombinedRiskTable l2={l2} l3={l3} combined={combined} />
      <div className="mt-8 flex flex-col gap-6 md:flex-row">
        <RosetteTile>
          <span className="w-full text-xs font-medium text-primary">
            L2 & L3 individual risks
          </span>
          <div className="flex items-center justify-between">
            <BigIndividualRosette className="mx-auto my-6" l2={l2} l3={l3} />
          </div>
        </RosetteTile>
        <RosetteTile>
          <span className="w-full text-xs font-medium text-primary">
            L3 combined risks
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
      <HorizontalSeparator className="mb-7 mt-6" />
      <div className="mb-4 text-xl font-bold text-zinc-800 dark:text-white md:text-[28px]">
        L3 {combined ? 'combined' : 'individual'} risks
      </div>
      <div className="mb-4 text-black/80 dark:text-white/80 md:text-lg">
        The information below reflects{' '}
        {combined ? 'combined L2 & L3' : 'individual L3'} risks.
      </div>
      {(combined ?? l3.risks).map((value) => (
        <SingleRisk key={value.name} value={value} />
      ))}
    </ProjectSection>
  )
}

function RosetteTile({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col items-center gap-1 rounded-lg bg-surface-secondary p-6">
      {children}
    </div>
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
    // Wrapper to override mobile nav x-clipping
    <div className=" overflow-x-auto overflow-y-hidden whitespace-nowrap">
      <table className="mt-5 min-w-full border-separate border-spacing-0 overflow-x-scroll text-left text-xs ">
        <thead>
          <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
            {/* Empty top-left header cell */}
            <th></th>
            <HeaderCell className="rounded-tl">
              SEQUENCER
              <br />
              FAILURE
            </HeaderCell>
            <HeaderCell>
              STATE
              <br />
              VALIDATION
            </HeaderCell>
            <HeaderCell>
              DATA
              <br /> AVAILABILITY
            </HeaderCell>
            <HeaderCell>EXIT WINDOW</HeaderCell>
            <HeaderCell className="rounded-tr">
              PROPOSER
              <br /> FAILURE
            </HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
            <HeaderCell className="rounded-tl">
              <span className="text-sm font-medium">{props.l2.name}</span>
              <div className="text-[13px] font-normal leading-none text-secondary">
                L2
              </div>
            </HeaderCell>
            {props.l2.risks.map((risk) => (
              <RiskCell key={risk.name} {...risk} />
            ))}
          </tr>
          <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
            <HeaderCell>
              <span className="text-xs font-medium">{props.l3.name}</span>
              <div className="text-[13px] font-normal leading-none text-secondary">
                L3 • Individual
              </div>
            </HeaderCell>
            {props.l3.risks.map((risk) => (
              <RiskCell key={risk.name} {...risk} />
            ))}
          </tr>
          <tr className="border-zinc-700 dark:border-zinc-300 [&>td:not(:last-child)]:border-r-0 [&>td]:border-t-2">
            <HeaderCell className="rounded-bl border-t-zinc-700 dark:border-t-zinc-300">
              <span className="text-xs font-medium">{props.l3.name}</span>
              <div className="whitespace-nowrap text-[13px] font-normal leading-none text-secondary">
                L3 • Combined
              </div>
            </HeaderCell>
            {props.combined
              ? props.combined.map((risk) => (
                  <RiskCell
                    key={risk.name}
                    {...risk}
                    backgroundFill
                    className="border-t-zinc-700 dark:border-t-zinc-300"
                  />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <RiskCell
                    key={i}
                    value={EM_DASH}
                    sentiment="UnderReview"
                    className="border-t-zinc-700 dark:border-t-zinc-300"
                  />
                ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function HeaderCell({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  return (
    <td
      className={cn(
        'border border-divider bg-surface-secondary px-3 py-2 text-[13px] font-bold',
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
        'border border-gray-50 px-3 py-2 dark:border-gray-750',
        props.backgroundFill && bg,
        props.className,
      )}
    >
      <SentimentText sentiment={props.sentiment ?? 'neutral'} vibrant>
        {props.value}
      </SentimentText>
    </td>
  )
}
