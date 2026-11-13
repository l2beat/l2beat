import type { PrivacyAdversary, PrivacyAdversaryId } from '@l2beat/config'
import { formatInteger } from '@l2beat/shared-pure'
import { CustomLink } from '~/components/link/CustomLink'
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
  ADVICE_EFFORT_IDS,
  ADVICE_EFFORTS,
  type AdviceAccepts,
  getAdviceEffortCosts,
  getAdvicePath,
} from '../advicePaths'
import { getPathTools } from '../setupTools'
import {
  getAdversaryStatusText,
  getWaitWindowNote,
  STAY_PRIVATE,
} from '../stayPrivateCopy'

/**
 * One protocol's setup: the app the steps assume, the tools to get, the steps
 * the user's efforts keep, and which ratings still hold on that path. Opens
 * under the protocol's row, which already names it.
 */
export function SetupDetails({
  protocol,
  accepts,
  from,
  adversaries,
  waitWindowDays,
}: {
  protocol: PrivacyAdviceProtocol
  accepts: AdviceAccepts
  from: PrivacyAdversaryId[]
  adversaries: PrivacyAdversary[]
  waitWindowDays: number
}) {
  const path = getAdvicePath(
    protocol.steps,
    accepts,
    adversaries,
    protocol.sentiments,
  )
  const unrated = path.adversaries
    .filter((row) => row.status === 'unrated')
    .map((row) => row.adversary.id)
  const tools = getPathTools(path.taken)
  const costs = getAdviceEffortCosts(
    protocol.steps,
    adversaries,
    protocol.sentiments,
  )
  const getAdversaryHref = (id: PrivacyAdversaryId) =>
    `${protocol.href}#${getPrivacyAdversaryBlockId(id)}`

  return (
    <div>
      {protocol.isUnderReview && (
        <WarningBar
          color="yellow"
          text={STAY_PRIVATE.underReview}
          className="mb-3"
        />
      )}
      <ProtocolFacts
        protocol={protocol}
        waits={path.taken.some((step) => step.randomWait)}
        waitWindowDays={waitWindowDays}
      />
      {from.includes('privilegedInsider') && (
        <div className="mt-4 flex flex-col gap-1 rounded-lg bg-surface-secondary px-4 py-3 text-paragraph-15">
          <span className="font-bold">{STAY_PRIVATE.operatorTitle}</span>
          <span>{protocol.insider}</span>
          <span className="text-paragraph-13 text-secondary">
            {STAY_PRIVATE.exitWindowLabel}: {protocol.exitWindow.value}.{' '}
            {protocol.exitWindow.description}
          </span>
        </div>
      )}

      {tools.length > 0 && (
        <>
          <h4 className="mt-6 font-bold text-heading-16">
            {STAY_PRIVATE.toolsTitle}
          </h4>
          <ul className="mt-2 flex flex-col gap-1 text-paragraph-15">
            {tools.map((tool) => (
              <li key={tool.name}>
                <CustomLink href={tool.href}>{tool.name}</CustomLink>
                {tool.effort && (
                  <span className="text-secondary">: {tool.effort}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h4 className="mt-6 font-bold text-heading-16">
        {STAY_PRIVATE.stepsTitle}
      </h4>
      {path.skipped.length > 0 && (
        <p className="mt-2 text-paragraph-15">
          <span className="font-bold">{STAY_PRIVATE.skippedLabel}:</span>{' '}
          {path.skipped.map((step) => step.name).join(', ')}.{' '}
          {ADVICE_EFFORT_IDS.filter(
            (id) => !accepts[id] && path.skipped.some(ADVICE_EFFORTS[id].skips),
          )
            .map((id) => ADVICE_EFFORTS[id].cost)
            .join(' ')}
        </p>
      )}
      {protocol.steps.length === 0 ? (
        <p className="mt-2 text-paragraph-15 text-secondary">
          {STAY_PRIVATE.noSteps}
        </p>
      ) : (
        <div className="mt-4">
          <PrivacyAdviceSteps
            steps={path.taken}
            adversaries={adversaries}
            sentiments={protocol.sentiments}
            waitWindowDays={waitWindowDays}
            getAdversaryHref={getAdversaryHref}
            unrated={unrated}
          />
        </div>
      )}

      <h4 className="mt-6 font-bold text-heading-16">
        {STAY_PRIVATE.defendsTitle}
      </h4>
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

      {costs.length > 0 && (
        <>
          <h4 className="mt-6 font-bold text-heading-16">
            {STAY_PRIVATE.costsTitle}
          </h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-paragraph-14">
              <thead className="text-paragraph-13 text-secondary">
                <tr className="border-divider border-b">
                  {STAY_PRIVATE.costsHeaders.map((header) => (
                    <th key={header} className="py-2 pr-4 font-normal">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {costs.map((row) => (
                  <tr
                    key={row.effort.id}
                    aria-current={accepts[row.effort.id] ? undefined : 'true'}
                    className="border-divider border-b last:border-b-0 aria-[current]:bg-surface-secondary/60"
                  >
                    <td className="py-2 pr-4 pl-1 font-medium">
                      {row.effort.label(waitWindowDays)}
                    </td>
                    <td className="py-2 pr-4">{row.skipped.join(', ')}</td>
                    <td className="py-2 pr-4">
                      {row.unrated.length > 0
                        ? row.unrated
                            .map((a) => a.label.toLowerCase())
                            .join(', ')
                        : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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
    </div>
  )
}

/** The context the steps assume: the app, how many you hide among, and how long you have to leave. */
function ProtocolFacts({
  protocol,
  waits,
  waitWindowDays,
}: {
  protocol: PrivacyAdviceProtocol
  waits: boolean
  waitWindowDays: number
}) {
  const { anonymitySet, referenceApp, exitWindow } = protocol
  return (
    <dl className="grid gap-x-6 gap-y-3 text-paragraph-15 sm:grid-cols-3">
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
                waits ? getWaitWindowNote(waitWindowDays) : '',
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
