import type { Sentiment } from '@l2beat/config'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { BigIndividualRosette } from '~/components/rosette/individual/BigIndividualRosette'
import type { RosetteValueTuple } from '~/components/rosette/individual/IndividualRosetteIcon'
import { BigPizzaRosette } from '~/components/rosette/pizza/BigPizzaRosette'
import { SentimentText } from '~/components/SentimentText'
import { EM_DASH } from '~/consts/characters'
import { ShieldIcon } from '~/icons/Shield'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'
import { sentimentToTransparentBgColor } from '~/utils/sentiment'
import { WarningBar } from '../../WarningBar'
import { RiskBanner } from '../RiskBanner'
import { ProjectSection } from './ProjectSection'
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
      <div className="font-normal text-paragraph-15 md:text-paragraph-16 dark:text-white/80">
        The L3 risks depend on the individual properties of L3 and those of the
        host chain combined.
      </div>
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

      <CombinedRiskTable l2={l2} l3={l3} combined={combined} />
      <div className="mt-8 flex flex-col gap-6 md:flex-row">
        <RosetteTile>
          <span className="w-full font-medium text-primary text-xs">
            L2 & L3 individual risks
          </span>
          <div className="flex items-center justify-between">
            <BigIndividualRosette className="mx-auto my-6" l2={l2} l3={l3} />
          </div>
        </RosetteTile>
        <RosetteTile>
          <span className="w-full font-medium text-primary text-xs">
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
      <HorizontalSeparator className="mt-6 mb-7" />
      <div className="mb-4 text-heading-24">
        L3 {combined ? 'combined' : 'individual'} risks
      </div>
      <div className="mb-4 text-paragraph-15 md:text-paragraph-16">
        The information below reflects{' '}
        {combined ? 'combined L2 & L3' : 'individual L3'} risks.
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
            <th />
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
              <span className="font-medium text-sm">{props.l2.name}</span>
              <div className="font-normal text-[13px] text-secondary leading-none">
                L2
              </div>
            </HeaderCell>
            {props.l2.risks.map((risk) => (
              <RiskCell key={risk.name} {...risk} />
            ))}
          </tr>
          <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
            <HeaderCell>
              <span className="font-medium text-xs">{props.l3.name}</span>
              <div className="font-normal text-[13px] text-secondary leading-none">
                L3 • Individual
              </div>
            </HeaderCell>
            {props.l3.risks.map((risk) => (
              <RiskCell key={risk.name} {...risk} />
            ))}
          </tr>
          <tr className="border-zinc-700 dark:border-zinc-300 [&>td:not(:last-child)]:border-r-0 [&>td]:border-t-2">
            <HeaderCell className="rounded-bl border-t-zinc-700 dark:border-t-zinc-300">
              <span className="font-medium text-xs">{props.l3.name}</span>
              <div className="whitespace-nowrap font-normal text-[13px] text-secondary leading-none">
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
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <td
      className={cn(
        'border border-divider bg-surface-secondary px-3 py-2 font-bold text-[13px]',
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
