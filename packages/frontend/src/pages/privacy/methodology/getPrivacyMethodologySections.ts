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
import { PRIVACY_REFERENCE_APP_ANCHOR } from './paths'
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
      'Privacy tools can hide activity from the public yet still leak it to specific parties. Our five adversary archetypes reveal who can learn what a privacy protocol promises to hide, and whom users must trust. They assess the live protocol and a released app, using source code, onchain data and observed behaviour.',
      'Each project promises at least one private field: sender, recipient, amount, asset or the link between two actions. We rate that field against each adversary independently and report other exposed fields separately. An adversary is a capability that different people or companies may have.',
    ]),

    ratings: joinBlocks([
      heading(2, 'Ratings'),
      "The ratings assume a careful user follows ordinary hygiene and the review's advice, using settings offered by the reference app.",
      bulletList([
        `**${VERDICT.good}** (green): the promised field stays hidden from this adversary.`,
        `**${VERDICT.warning}** (yellow): protection is limited, private use can be denied, or keeping the field hidden takes substantial effort beyond the app's options. A workaround must preserve ordinary use of the protocol.`,
        `**${VERDICT.bad}** (red): the field is exposed with no reasonable workaround, or no usable, verifiable app supports private use. A custodian who can require disclosure to release funds also earns red.`,
      ]),
      "A closed app's delivery risk falls to the privileged insider. When the review reads and pins the code a closed web app or extension serves, the other cells rate that code like open code. A native closed app caps the network observer at yellow.",
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
      'A third party ties requests to one user by content, session or timing. Content is what a request names, like an account or a hash. Session is what requests share, like an IP, a Tor circuit, a fingerprint or a login. Timing narrows the candidates to users active at the same moment. The network observer is green only when no third party ties both sides of the promised field by content or session. Timing must leave many candidates.',
      'Bulk downloads and a local node keep content out of requests. Tor hides the IP, and an app that routes its own traffic can give each step its own session. Only batching, delays and cover traffic hide timing, as a well-built mixnet does.',
      'Counterparties (e.g. private transfer recipients) also learn what the protocol hands them, such as a received note. We report this under the chain analyst and rate it only when it reaches parties the user never dealt with voluntarily.',
      'The public observer, chain analyst and future adversary see the same public data with increasing ability.',
    ]),

    referenceApp: joinBlocks([
      // A raw heading, since markdown headings render without an id to link.
      `<h2 id="${PRIVACY_REFERENCE_APP_ANCHOR}">Reference app</h2>`,
      'Each project names a reference app, the most private released app we found for the protocol. The ratings assume this app. Other apps we checked appear below it, each with one sourced finding that shows it leaks more.',
      'An app takes the spot when it leaks less to the five adversaries. Only released builds count.',
      `App teams can propose their app in the ${link('Privacy adversaries framework', externalLinks.articles.privacyAdversariesFramework)} thread on the L2BEAT forum.`,
    ]),

    categories: joinBlocks([
      heading(2, 'Categories'),
      'Categories describe how a protocol tries to hide data. Pools, shielded ledgers and anonymous access usually promise to hide a link. Stealth addresses hide a recipient. Confidential amounts hide an amount. Secret ballots hide how each voter voted. A project keeps its category even when it fails that promise.',
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
