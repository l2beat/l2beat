import {
  PRIVACY_ADVERSARIES,
  PRIVACY_ADVERSARY_ORDER,
} from '@l2beat/config/build/common/privacyAdversaries'
import lowerFirst from 'lodash/lowerFirst'
import { externalLinks } from '~/consts/externalLinks'
import { ANONYMITY_SET_TOOLTIPS } from '~/server/features/privacy/anonymity-set/anonymitySetTooltips'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
} from '~/server/markdown/markdown'
import { TRUSTED_SETUP_FRAMEWORK_LINK } from '~/server/markdown/zkSectionBodies'
import { PRIVACY_ADVERSARY_VERDICT as VERDICT } from '../adversaries/privacyAdversaryUi'
import { PRIVACY_COLUMN_DESCRIPTIONS as COLUMNS } from '../privacySummaryColumns'
import { FRAMEWORK_ADVERSARY_TEXT } from './privacyFrameworkText'

export type PrivacyMethodologySections = ReturnType<
  typeof getPrivacyMethodologySections
>

/**
 * The page's markdown, split where the figures go. The framework sections
 * follow the privacy adversaries framework post on the forum; keep them in
 * sync with it. The summary table section quotes the table's own column
 * tooltips.
 */
export function getPrivacyMethodologySections() {
  return {
    intro: joinBlocks([
      'Privacy tools can hide activity from the public yet still leak it to specific parties. Our five adversary archetypes reveal who can learn what an app promises to hide, and whom users must trust. They assess the live protocol and a released client, using source code, onchain data and observed behaviour.',
      'Each project promises at least one private field: sender, recipient, amount, asset or the link between two actions. We rate that field against each adversary independently and report other exposed fields separately. An adversary is a capability that different people or companies may have.',
    ]),

    ratings: joinBlocks([
      heading(2, 'Ratings'),
      "The ratings assume a careful user follows ordinary hygiene and the review's advice, using settings offered by the assessed client. Each review names at least one client, usually the strongest functional released open-source client available.",
      bulletList([
        `**${VERDICT.good}** (green): the promised field stays hidden from this adversary.`,
        `**${VERDICT.warning}** (yellow): protection is limited, private use can be denied, or keeping the field hidden takes substantial effort beyond the client's options. A workaround must preserve ordinary use of the protocol.`,
        `**${VERDICT.bad}** (red): the field is exposed with no reasonable workaround, or no usable, verifiable client supports private use. A custodian who can require disclosure to release funds also earns red.`,
      ]),
      'When privacy depends on hiding among other users, the size of that group (anonymity set) affects the adversary who sees the later action.',
    ]),

    adversaries: joinBlocks([
      heading(2, 'Adversaries'),
      bulletList(
        PRIVACY_ADVERSARY_ORDER.map(
          (id) =>
            `**${PRIVACY_ADVERSARIES[id].label}**: ${FRAMEWORK_ADVERSARY_TEXT[id]}`,
        ),
      ),
      'The public observer, chain analyst and future adversary see the same public data with increasing ability.',
    ]),

    categories: joinBlocks([
      heading(2, 'Categories'),
      'Categories describe how a protocol tries to hide data. Pools, shielded ledgers and anonymous access usually promise to hide a link. Stealth addresses hide a recipient. Confidential amounts hide an amount. A project keeps its category even when it fails that promise.',
    ]),

    columns: joinBlocks([
      heading(2, 'Summary table'),
      'Next to the adversary ratings, the [privacy summary](/privacy/summary) shows:',
      bulletList([
        `**Anonymity set**: For link privacy, ${lowerFirst(ANONYMITY_SET_TOOLTIPS.deposits)} For recipient privacy, ${lowerFirst(ANONYMITY_SET_TOOLTIPS['key-registrations'])}`,
        `**Trusted setup**: ${COLUMNS.trustedSetup} Risks follow the ${TRUSTED_SETUP_FRAMEWORK_LINK}.`,
        `**Exit window**: ${COLUMNS.exitWindow}`,
        `**Walkaway test**: ${COLUMNS.walkawayTest}`,
        `**Reproducibility**: ${COLUMNS.reproducibility}`,
      ]),
      `Feedback on the framework is welcome in the ${link('Privacy adversaries framework', externalLinks.articles.privacyAdversariesFramework)} thread on the L2BEAT forum.`,
    ]),
  }
}
