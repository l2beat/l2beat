import {
  PRIVACY_ADVERSARIES,
  PRIVACY_ADVERSARY_ORDER,
  PRIVACY_FIELD_ORDER,
  PRIVACY_FIELDS,
} from '@l2beat/config/build/common/privacyAdversaries'
import { PRIVACY_CATEGORIES } from '@l2beat/config/build/common/privacyCategories'
import { PRIVACY_SUMMARY_DESCRIPTION } from '~/consts/summaryPageDescriptions'
import { ANONYMITY_SET_TOOLTIPS } from '~/server/features/privacy/anonymity-set/anonymitySetTooltips'
import { bulletList, heading, joinBlocks } from '~/server/markdown/markdown'
import { TRUSTED_SETUP_FRAMEWORK_LINK } from '~/server/markdown/zkSectionBodies'
import {
  PRIVACY_ADVERSARIES_TOOLTIP,
  PRIVACY_ADVERSARY_VERDICT,
  PRIVACY_ADVERSARY_VERDICT_DESCRIPTION,
} from '../adversaries/privacyAdversaryUi'
import { PRIVACY_COLUMN_DESCRIPTIONS as COLUMNS } from '../privacySummaryColumns'

/**
 * The methodology from the definitions the assessments themselves use, so
 * the page cannot drift from the site. The connecting sentences restate the
 * rules documented on those definitions.
 */
export function getPrivacyMethodologyMarkdown(): string {
  return joinBlocks([
    `${PRIVACY_SUMMARY_DESCRIPTION} Every protocol on the [privacy page](/privacy/summary) is assessed the way this page describes.`,

    heading(2, 'The privacy promise'),
    PRIVACY_ADVERSARIES_TOOLTIP,
    'A protocol promises to hide one of the following. Each is a different promise, so protocols are only ranked against those making the same one.',
    bulletList(
      PRIVACY_FIELD_ORDER.map((id) => {
        const field = PRIVACY_FIELDS[id]
        return `**${field.promiseLabel}**: ${field.description}`
      }),
    ),

    heading(2, 'Categories'),
    "The category is the mechanism a protocol deploys, read from its code. It decides which promise the protocol makes, not how well it keeps it: a protocol that fails to deliver its category's promise keeps the category and is rated exposed.",
    bulletList(
      Object.values(PRIVACY_CATEGORIES).map(
        (category) => `**${category.label}**: ${category.description}`,
      ),
    ),

    heading(2, 'Verdicts'),
    'Against each adversary, the promise gets one of three verdicts:',
    bulletList(
      (['good', 'warning', 'bad'] as const).map(
        (sentiment) =>
          `**${PRIVACY_ADVERSARY_VERDICT[sentiment]}**: ${PRIVACY_ADVERSARY_VERDICT_DESCRIPTION[sentiment]}`,
      ),
    ),
    'The verdict covers the promised field only. User hygiene never lowers it: what a careful user has to do is listed as advice. Facts about the deployment do lower it, such as an anonymity set too small for care to matter, or a structural leak the adversary exploits.',

    heading(2, 'Adversaries'),
    'Adversaries are defined by capability, never by identity. Real-world actors, such as governments, data brokers or chain analytics firms, combine several of them.',
    ...PRIVACY_ADVERSARY_ORDER.map((id) => {
      const adversary = PRIVACY_ADVERSARIES[id]
      return joinBlocks([
        heading(3, adversary.label),
        adversary.description,
        `Examples: ${adversary.examples}`,
      ])
    }),
    `The ${label('publicObserver')}, the ${label('chainAnalyst')} and the ${label('futureAdversary')} see the same public data with increasing time and effort, so protection against a later one implies protection against an earlier one. The ${label('networkObserver')} and the ${label('privilegedInsider')} depend on where they sit, so they do not follow that order.`,
    `Against the ${label('networkObserver')}, the user is assumed to use Tor, and their own node where the client lets them set an RPC. Tor hides only the IP address: identifiers the client sends stay attributed, and one server still sees a session's requests together.`,

    'The summary table folds the adversaries into one colour. Any exposed verdict makes it red, otherwise the majority wins and a tie is green. The future adversary is left out, as it grades a future cryptographic break, not the protocol today.',

    heading(2, 'Other columns'),
    bulletList([
      `**Anonymity set**: For ${lowerFirst(PRIVACY_FIELDS.linkage.promiseLabel)}, ${lowerFirst(ANONYMITY_SET_TOOLTIPS.deposits)} For ${lowerFirst(PRIVACY_FIELDS.recipient.promiseLabel)}, ${lowerFirst(ANONYMITY_SET_TOOLTIPS['key-registrations'])}`,
      `**Trusted setup**: ${COLUMNS.trustedSetup} Risks follow the ${TRUSTED_SETUP_FRAMEWORK_LINK}.`,
      `**Exit window**: ${COLUMNS.exitWindow}`,
      `**Walkaway test**: ${COLUMNS.walkawayTest}`,
      `**Reproducibility**: ${COLUMNS.reproducibility}`,
    ]),
  ])
}

function label(id: keyof typeof PRIVACY_ADVERSARIES) {
  return lowerFirst(PRIVACY_ADVERSARIES[id].label)
}

function lowerFirst(text: string) {
  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`
}
