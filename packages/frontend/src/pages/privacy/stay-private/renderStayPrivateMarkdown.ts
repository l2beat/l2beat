import { formatInteger } from '@l2beat/shared-pure'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type {
  PrivacyAdviceData,
  PrivacyAdviceProtocol,
} from '~/server/features/privacy/advice/getPrivacyAdviceData'
import {
  absolutizeLinks,
  bulletList,
  heading,
  joinBlocks,
  link,
  table,
  warning,
} from '~/server/markdown/markdown'
import { renderPrivacyAdviceSteps } from '~/server/markdown/renderPrivacySections'
import { ADVICE } from '../adviceUi'
import { PRIVACY_STAY_PRIVATE_PATH } from '../methodology/paths'
import {
  ADVICE_GOAL_IDS,
  ADVICE_GOALS,
  compareAdviceGoals,
} from './advicePaths'
import { STAY_PRIVATE } from './stayPrivateCopy'

/**
 * The guide as one document: an agent cannot click, so every protocol's full
 * path is listed, with a table of what each goal leaves out of it.
 */
export function renderStayPrivateMarkdown(data: PrivacyAdviceData): string {
  const pageUrl = PRODUCTION_ORIGIN + PRIVACY_STAY_PRIVATE_PATH
  const markdown = joinBlocks([
    heading(1, STAY_PRIVATE.title),
    `Markdown version of ${pageUrl}`,
    `${STAY_PRIVATE.description} ${STAY_PRIVATE.ratingsNote} ${link(ADVICE.methodologyLink, ADVICE.methodologyHref)}`,
    STAY_PRIVATE.notAnAudit,
    heading(2, 'Goals'),
    bulletList(
      ADVICE_GOAL_IDS.map((id) => {
        const goal = ADVICE_GOALS[id]
        return `**${goal.label}** (\`?${STAY_PRIVATE.goalParam}=${id}\`): ${goal.description}`
      }),
    ),
    ...data.protocols.map((protocol) => renderProtocol(protocol, data)),
  ])
  return `${absolutizeLinks(markdown, pageUrl)}\n`
}

function renderProtocol(
  protocol: PrivacyAdviceProtocol,
  data: PrivacyAdviceData,
) {
  const comparison = compareAdviceGoals(
    protocol.steps,
    data.adversaries,
    protocol.sentiments,
  )
  return joinBlocks([
    heading(2, protocol.name),
    protocol.isUnderReview ? warning(STAY_PRIVATE.underReview) : '',
    protocol.redWarning ? warning(protocol.redWarning) : '',
    bulletList([
      `Category: ${protocol.category}`,
      ...(protocol.referenceApp
        ? [
            `${STAY_PRIVATE.referenceAppLabel}: ${link(protocol.referenceApp.label, protocol.referenceApp.url)}, since ${protocol.referenceApp.since}`,
          ]
        : []),
      `${STAY_PRIVATE.anonymitySetLabel}: ${formatAnonymitySet(protocol)}`,
      `${STAY_PRIVATE.exitWindowLabel}: ${protocol.exitWindow.value}`,
      `${STAY_PRIVATE.operatorTitle}: ${protocol.insider}`,
      link(STAY_PRIVATE.fullReview, protocol.href),
    ]),
    renderPrivacyAdviceSteps({
      steps: protocol.steps,
      adversaries: data.adversaries,
      sentiments: protocol.sentiments,
      waitWindowDays: data.waitWindowDays,
    }),
    table(
      [...STAY_PRIVATE.compareHeaders],
      comparison.map((row) => [
        row.goal.label,
        String(row.stepCount),
        row.skipped.join(', ') || '-',
        row.unrated.map((a) => a.label.toLowerCase()).join(', ') || '-',
      ]),
    ),
  ])
}

function formatAnonymitySet({ anonymitySet }: PrivacyAdviceProtocol) {
  if (anonymitySet.status === 'missing') return anonymitySet.text
  return [
    formatInteger(anonymitySet.value),
    anonymitySet.label ? `(${anonymitySet.label})` : '',
    `- ${anonymitySet.description}`,
    ...anonymitySet.notes,
  ]
    .filter(Boolean)
    .join(' ')
}
