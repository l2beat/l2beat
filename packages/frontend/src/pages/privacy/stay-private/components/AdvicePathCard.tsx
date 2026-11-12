import type { PrivacyAdversary, PrivacyAdversaryId } from '@l2beat/config'
import { formatInteger } from '@l2beat/shared-pure'
import { CustomLink } from '~/components/link/CustomLink'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  PrivacyAdversaryLink,
  PrivacyAdviceSteps,
} from '~/components/projects/sections/privacy/PrivacyAdviceSteps'
import { WarningBar } from '~/components/WarningBar'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { ADVICE } from '~/pages/privacy/adviceUi'
import { PrivacySentimentDot } from '~/pages/privacy/PrivacySentimentDot'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { formatDate } from '~/utils/dates'
import {
  ADVICE_GOALS,
  type AdviceGoalId,
  compareAdviceGoals,
  getAdvicePath,
} from '../advicePaths'
import {
  getAdversaryStatusText,
  getWaitWindowNote,
  STAY_PRIVATE,
} from '../stayPrivateCopy'

export function AdvicePathCard({
  protocol,
  goal: goalId,
  adversaries,
  waitWindowDays,
}: {
  protocol: PrivacyAdviceProtocol
  goal: AdviceGoalId
  adversaries: PrivacyAdversary[]
  waitWindowDays: number
}) {
  const goal = ADVICE_GOALS[goalId]
  const path = getAdvicePath(
    protocol.steps,
    goal,
    adversaries,
    protocol.sentiments,
  )
  const unrated = path.adversaries
    .filter((row) => row.status === 'unrated')
    .map((row) => row.adversary.id)
  const getAdversaryHref = (id: PrivacyAdversaryId) =>
    `${protocol.href}#${getPrivacyAdversaryBlockId(id)}`

  return (
    <PrimaryCard>
      {/* Announced on every pick, so a screen reader hears the path change. */}
      <h2
        aria-live="polite"
        className="flex items-center gap-2.5 font-bold text-heading-18 md:text-heading-20"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-label-12">
          3
        </span>
        {STAY_PRIVATE.pathTitle}: {protocol.name}, {goal.label.toLowerCase()}
      </h2>
      <div className="mt-3 flex flex-col gap-2">
        {protocol.isUnderReview && (
          <WarningBar color="yellow" text={STAY_PRIVATE.underReview} />
        )}
        {protocol.redWarning && (
          <WarningBar color="red" text={protocol.redWarning} />
        )}
      </div>
      <ProtocolFacts protocol={protocol} waitWindowDays={waitWindowDays} />
      {goal.focus === 'privilegedInsider' && (
        <div className="mt-4 flex flex-col gap-1 rounded-lg bg-surface-secondary px-4 py-3 text-paragraph-15">
          <span className="font-bold">{STAY_PRIVATE.operatorTitle}</span>
          <span>{protocol.insider}</span>
          <span className="text-paragraph-13 text-secondary">
            {STAY_PRIVATE.exitWindowLabel}: {protocol.exitWindow.value}.{' '}
            {protocol.exitWindow.description}
          </span>
        </div>
      )}
      {goal.shortcut && (
        <SkippedNote
          skipped={path.skipped.map((step) => step.name)}
          cost={goal.shortcut.cost}
        />
      )}
      <div className="mt-6">
        <PrivacyAdviceSteps
          steps={path.taken}
          adversaries={adversaries}
          sentiments={protocol.sentiments}
          waitWindowDays={waitWindowDays}
          getAdversaryHref={getAdversaryHref}
          unrated={unrated}
        />
      </div>

      <h3 className="mt-8 font-bold text-heading-18">
        {STAY_PRIVATE.defendsTitle}
      </h3>
      <p className="mt-1 text-paragraph-13 text-secondary">
        {STAY_PRIVATE.ratingsNote}
      </p>
      <ul className="mt-3 flex flex-col divide-y divide-divider">
        {path.adversaries.map((row) => (
          <li
            key={row.adversary.id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2 text-paragraph-15"
          >
            <PrivacyAdversaryLink
              adversary={row.adversary}
              href={getAdversaryHref(row.adversary.id)}
              sentiment={row.status === 'unrated' ? undefined : row.sentiment}
              className="font-medium first-letter:uppercase"
            />
            <span className="text-secondary">
              {getAdversaryStatusText(row)}
            </span>
          </li>
        ))}
      </ul>

      <GoalComparison
        protocol={protocol}
        adversaries={adversaries}
        selected={goalId}
      />

      <div className="mt-6 flex flex-col gap-1.5 border-divider border-t pt-4 text-paragraph-13">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <CustomLink href={protocol.href}>
            {STAY_PRIVATE.fullReview}: {protocol.name}
          </CustomLink>
          <CustomLink href={ADVICE.methodologyHref}>
            {ADVICE.methodologyLink}
          </CustomLink>
        </div>
        <p className="text-secondary">{STAY_PRIVATE.notAnAudit}</p>
      </div>
    </PrimaryCard>
  )
}

/** The context the steps assume: the app, how many you hide among, and how long you have to leave. */
function ProtocolFacts({
  protocol,
  waitWindowDays,
}: {
  protocol: PrivacyAdviceProtocol
  waitWindowDays: number
}) {
  const { anonymitySet, referenceApp, exitWindow } = protocol
  const hasWait = protocol.steps.some((step) => step.randomWait)
  return (
    <dl className="mt-4 grid gap-x-6 gap-y-3 text-paragraph-15 sm:grid-cols-3">
      <Fact label={STAY_PRIVATE.referenceAppLabel}>
        {referenceApp ? (
          <>
            <CustomLink
              href={referenceApp.url}
              className="inline-flex items-center gap-1.5"
            >
              <img
                src={referenceApp.iconUrl}
                alt=""
                width={16}
                height={16}
                className="size-4 rounded-full"
              />
              {referenceApp.label}
            </CustomLink>
            <span className="text-paragraph-13 text-secondary">
              since {formatDate(referenceApp.since)}
            </span>
          </>
        ) : (
          <span className="text-secondary">No reference app</span>
        )}
      </Fact>
      <Fact label={STAY_PRIVATE.anonymitySetLabel}>
        {anonymitySet.status === 'available' ? (
          <>
            <span className="font-bold">
              {formatInteger(anonymitySet.value)}
              {anonymitySet.label && (
                <span className="font-normal text-secondary">
                  {' '}
                  {anonymitySet.label}
                </span>
              )}
            </span>
            <span className="text-paragraph-13 text-secondary">
              {[
                anonymitySet.description,
                ...anonymitySet.notes,
                hasWait ? getWaitWindowNote(waitWindowDays) : '',
              ]
                .filter(Boolean)
                .join(' ')}
            </span>
          </>
        ) : (
          <span className="text-secondary">{anonymitySet.text}</span>
        )}
      </Fact>
      <Fact label={STAY_PRIVATE.exitWindowLabel}>
        <span className="inline-flex items-center gap-1.5 font-bold">
          {exitWindow.sentiment && exitWindow.sentiment !== 'neutral' && (
            <PrivacySentimentDot
              sentiment={exitWindow.sentiment}
              className="size-2.5!"
            />
          )}
          {exitWindow.value}
        </span>
      </Fact>
    </dl>
  )
}

function Fact({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-paragraph-13 text-secondary">{label}</dt>
      <dd className="flex flex-col gap-0.5">{children}</dd>
    </div>
  )
}

/** What the shortcut leaves out, or that it leaves out nothing here. */
function SkippedNote({ skipped, cost }: { skipped: string[]; cost: string }) {
  if (skipped.length === 0) {
    return (
      <p className="mt-4 text-paragraph-15 text-secondary">
        {STAY_PRIVATE.sameAsFull}
      </p>
    )
  }
  return (
    <p className="mt-4 text-paragraph-15">
      <span className="font-bold">{STAY_PRIVATE.skippedLabel}:</span>{' '}
      {skipped.join(', ')}. {cost}
    </p>
  )
}

/** Every goal side by side for this protocol, so the cost of a shortcut is visible before picking it. */
function GoalComparison({
  protocol,
  adversaries,
  selected,
}: {
  protocol: PrivacyAdviceProtocol
  adversaries: PrivacyAdversary[]
  selected: AdviceGoalId
}) {
  const rows = compareAdviceGoals(
    protocol.steps,
    adversaries,
    protocol.sentiments,
  )
  return (
    <>
      <h3 className="mt-8 font-bold text-heading-18">
        {STAY_PRIVATE.compareTitle}
      </h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-paragraph-14">
          <thead className="text-paragraph-13 text-secondary">
            <tr className="border-divider border-b">
              {STAY_PRIVATE.compareHeaders.map((header) => (
                <th key={header} className="py-2 pr-4 font-normal">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.goal.id}
                aria-current={row.goal.id === selected ? 'true' : undefined}
                className="border-divider border-b last:border-b-0 aria-[current]:bg-surface-secondary/60"
              >
                <td className="py-2 pr-4 pl-1 font-medium">{row.goal.label}</td>
                <td className="py-2 pr-4">{row.stepCount}</td>
                <td className="py-2 pr-4">{row.skipped.join(', ') || '–'}</td>
                <td className="py-2 pr-4">
                  {row.unrated.length > 0
                    ? row.unrated.map((a) => a.label.toLowerCase()).join(', ')
                    : '–'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
