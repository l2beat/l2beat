import type { PrivacyNeed } from '@l2beat/config'
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
import { PRIVACY_ADVERSARY_VERDICT } from '../adversaries/privacyAdversaryUi'
import { ADVICE } from '../adviceUi'
import { PRIVACY_STAY_PRIVATE_PATH } from '../methodology/paths'
import { ACCEPT_ALL, getAdviceEffortCosts } from './advicePaths'
import {
  getDefaultFrom,
  MATCH_GROUP_IDS,
  matchProtocols,
} from './matchProtocols'
import { getOutsideNames, getPathTools } from './setupTools'
import { STAY_PRIVATE } from './stayPrivateCopy'

/**
 * The guide as one document: an agent cannot click, so it gives the rule that
 * groups protocols, every need's protocols with all ratings, and every
 * protocol's setup with what each effort left out costs.
 */
export function renderStayPrivateMarkdown(data: PrivacyAdviceData): string {
  const pageUrl = PRODUCTION_ORIGIN + PRIVACY_STAY_PRIVATE_PATH
  const markdown = joinBlocks([
    heading(1, STAY_PRIVATE.title),
    `Markdown version of ${pageUrl}`,
    `${STAY_PRIVATE.description} ${STAY_PRIVATE.effortNote} ${link(ADVICE.methodologyLink, ADVICE.methodologyHref)}`,
    STAY_PRIVATE.notAnAudit,
    heading(2, 'How protocols are grouped'),
    bulletList([
      "Protocols are compared within one need, since each rating grades the protocol's own promise.",
      `For the adversaries a user chooses: "${STAY_PRIVATE.groups.private.title}" when every rating is ${PRIVACY_ADVERSARY_VERDICT.good}, "${STAY_PRIVATE.groups.exposed.title}" when one is ${PRIVACY_ADVERSARY_VERDICT.bad}, "${STAY_PRIVATE.groups.atRisk.title}" otherwise.`,
      'A user who rules out an effort leaves steps out. A rating that assumes such a step is not counted as private. Each setup below says which ratings that affects.',
      'The tables list protocols as the page first shows them: every adversary but the future adversary chosen, no effort ruled out. Nothing is ranked beyond that.',
    ]),
    ...data.needs.map((need) => renderNeed(need, data)),
    ...data.protocols.map((protocol) => renderProtocol(protocol, data)),
  ])
  return `${absolutizeLinks(markdown, pageUrl)}\n`
}

/** One need's protocols with every published rating, as the page lists them by default. */
function renderNeed(need: PrivacyNeed, data: PrivacyAdviceData) {
  const { groups } = matchProtocols(data.protocols, data.adversaries, {
    need: need.id,
    from: getDefaultFrom(data.adversaries),
    accepts: ACCEPT_ALL,
  })
  return joinBlocks([
    heading(2, `${need.label} (\`?need=${need.id}\`)`),
    need.description,
    table(
      [
        'Protocol',
        'Kind',
        ...data.adversaries.map((a) => a.label),
        STAY_PRIVATE.anonymitySetLabel,
        STAY_PRIVATE.outsideLabel,
        'Random wait',
      ],
      MATCH_GROUP_IDS.flatMap((id) => groups[id]).map(({ protocol }) => [
        protocol.name,
        protocol.categoryLabel,
        ...data.adversaries.map(
          (a) => PRIVACY_ADVERSARY_VERDICT[protocol.sentiments[a.id]],
        ),
        protocol.anonymitySetSize === undefined
          ? 'no count'
          : formatInteger(protocol.anonymitySetSize),
        getOutsideNames(protocol.steps).join(', ') ||
          STAY_PRIVATE.nothingOutside,
        protocol.steps.some((step) => step.randomWait) ? 'yes' : 'no',
      ]),
    ),
  ])
}

function renderProtocol(
  protocol: PrivacyAdviceProtocol,
  data: PrivacyAdviceData,
) {
  const costs = getAdviceEffortCosts(
    protocol.steps,
    data.adversaries,
    protocol.sentiments,
  )
  const tools = getPathTools(protocol.steps)
  return joinBlocks([
    heading(2, `${STAY_PRIVATE.setupTitle}: ${protocol.name}`),
    protocol.isUnderReview ? warning(STAY_PRIVATE.underReview) : '',
    protocol.redWarning ? warning(protocol.redWarning) : '',
    bulletList([
      `Kind: ${protocol.categoryLabel}`,
      `Promise: ${protocol.promise}`,
      ...(protocol.referenceApp
        ? [
            `${STAY_PRIVATE.referenceAppLabel}: ${link(protocol.referenceApp.label, protocol.referenceApp.url)}, since ${protocol.referenceApp.since}`,
          ]
        : []),
      `${STAY_PRIVATE.anonymitySetLabel}: ${formatAnonymitySet(protocol)}`,
      `${STAY_PRIVATE.exitWindowLabel}: ${protocol.exitWindow.value}`,
      `${STAY_PRIVATE.operatorTitle}: ${protocol.insider}`,
      ...(tools.length > 0
        ? [
            `${STAY_PRIVATE.toolsTitle}: ${tools.map((tool) => `${link(tool.name, tool.href)}${tool.effort ? ` (${tool.effort})` : ''}`).join(', ')}`,
          ]
        : []),
      link(STAY_PRIVATE.fullReview, protocol.href),
    ]),
    protocol.steps.length === 0
      ? STAY_PRIVATE.noSteps
      : renderPrivacyAdviceSteps({
          steps: protocol.steps,
          adversaries: data.adversaries,
          sentiments: protocol.sentiments,
          waitWindowDays: data.waitWindowDays,
        }),
    costs.length > 0
      ? table(
          [...STAY_PRIVATE.costsHeaders],
          costs.map((row) => [
            row.effort.label(data.waitWindowDays),
            row.skipped.join(', '),
            row.unrated.map((a) => a.label.toLowerCase()).join(', ') || '-',
          ]),
        )
      : '',
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
