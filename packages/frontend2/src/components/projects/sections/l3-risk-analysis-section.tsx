import { type Sentiment } from '@l2beat/shared-pure'
import { type ReactNode } from 'react'
import { UnderReviewBadge } from '~/components/badge/under-review-badge'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Markdown } from '~/components/markdown/markdown'
import { BigIndividualRosette } from '~/components/rosette/individual/big-individual-rosette'
import { type RosetteValueTuple } from '~/components/rosette/individual/individual-rosette-icon'
import { BigPizzaRosette } from '~/components/rosette/pizza/big-pizza-rosette'
import { type RosetteValue } from '~/components/rosette/types'
import { SentimentText } from '~/components/sentiment-text'
import { EM_DASH } from '~/consts/characters'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { cn } from '~/utils/cn'
import { sentimentToBgColor } from '~/utils/sentiment'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

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
      <div className="text-sm dark:text-white/80">
        The L3 risk rosette depends on the individual L3 properties and the
        risks of the host chain. The combined view shows the risk based on both
        the L2 and the L3.
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
          <span className="w-full text-sm dark:text-gray-600">
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
        <RosetteTile>
          <span className="w-full text-sm dark:text-gray-600">
            L2 & L3 individual risks
          </span>
          <div className="flex items-center justify-between">
            <BigIndividualRosette className="mx-auto my-6" l2={l2} l3={l3} />
          </div>
        </RosetteTile>
      </div>
      <HorizontalSeparator className="my-6" />
      <div className="mb-4 text-xs text-gray-600">
        L3 {combined ? 'combined' : 'individual'} risks
      </div>
      {(combined ?? l3.risks).map((value) => (
        <SingleRisk key={value.name} value={value} />
      ))}
    </ProjectSection>
  )
}

function SingleRisk({
  value,
}: {
  value: RosetteValue
}) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-semibold uppercase text-zinc-800 dark:text-white">
        {value.name}
      </h3>
      {value.sentiment === 'UnderReview' ? (
        <span className="mt-1 block">
          {value.name} risk is currently <UnderReviewBadge />
        </span>
      ) : (
        <>
          <SentimentText
            sentiment={value.sentiment}
            className="mt-1 block text-lg font-bold"
          >
            {value.value}
          </SentimentText>
          {value.warning && (
            <WarningBar
              className="my-1"
              icon={RoundedWarningIcon}
              text={value.warning.value}
              color={value.warning.sentiment === 'bad' ? 'red' : 'yellow'}
            />
          )}
          {value.description && (
            <Markdown className="mt-2 text-xs font-normal leading-snug dark:text-white/80">
              {value.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}

function RosetteTile({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col items-center gap-1 rounded-lg bg-gray-200 p-6 dark:bg-zinc-800">
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
              <span className="font-medium">{props.l2.name}</span>
              <div className="text-xs font-normal text-gray-500">L2</div>
            </HeaderCell>
            {props.l2.risks.map((risk) => (
              <RiskCell key={risk.name} {...risk} />
            ))}
          </tr>
          <tr className="[&>td:not(:last-child)]:border-r-0 [&>td]:border-b-0">
            <HeaderCell>
              <span className="font-medium">{props.l3.name}</span>
              <div className="text-xs font-normal text-gray-500">
                L3 • Individual
              </div>
            </HeaderCell>
            {props.l3.risks.map((risk) => (
              <RiskCell key={risk.name} {...risk} />
            ))}
          </tr>
          <tr className="[&>td:not(:last-child)]:border-r-0">
            <HeaderCell className="rounded-bl">
              <span className="font-medium">{props.l3.name}</span>
              <div className="whitespace-nowrap text-xs font-normal text-gray-500">
                L3 • Combined
              </div>
            </HeaderCell>
            {props.combined
              ? props.combined.map((risk) => (
                  <RiskCell key={risk.name} {...risk} backgroundFill />
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <RiskCell key={i} value={EM_DASH} sentiment="UnderReview" />
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
        'dark:border-gray-750 border border-gray-50 bg-zinc-300 px-3 py-2 font-bold dark:bg-zinc-800',
        className,
      )}
    >
      {children}
    </td>
  )
}

function RiskCell(props: {
  sentiment: Sentiment
  value: string
  backgroundFill?: boolean
}) {
  const bg = sentimentToBgColor(props.sentiment)

  return (
    <td
      className={cn(
        props.backgroundFill && bg,
        'dark:border-gray-750 border border-gray-50 px-3 py-2',
      )}
    >
      <SentimentText sentiment={props.sentiment}>{props.value}</SentimentText>
    </td>
  )
}
