import {
  PRIVACY_ADVERSARIES,
  PRIVACY_ADVERSARY_ORDER,
} from '@l2beat/config/build/common/privacyAdversaries'
import lowerFirst from 'lodash/lowerFirst'
import { externalLinks } from '~/consts/externalLinks'
import { ANONYMITY_SET_TOOLTIPS } from '~/server/features/privacy/anonymity-set/anonymitySetTooltips'
import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
} from '~/server/markdown/markdown'
import { TRUSTED_SETUP_FRAMEWORK_LINK } from '~/server/markdown/zkSectionBodies'
import { PRIVACY_ADVERSARY_VERDICT as VERDICT } from '../adversaries/privacyAdversaryUi'
import { PRIVACY_COLUMN_DESCRIPTIONS as COLUMNS } from '../privacySummaryColumns'
import {
  PRIVACY_ADVICE_ANCHOR,
  PRIVACY_IP_HIDING_ROUTES_ANCHOR,
  PRIVACY_REFERENCE_APP_ANCHOR,
} from './paths'
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
      `The ratings assume a careful user takes the steps a project page lists under [How to stay private](#${PRIVACY_ADVICE_ANCHOR}), with settings the reference app offers.`,
      bulletList([
        `**${VERDICT.good}** (green): the promised field stays hidden from this adversary.`,
        `**${VERDICT.warning}** (yellow): protection is limited, private use can be denied, or keeping the field hidden takes substantial effort beyond the app's options. A workaround must preserve ordinary use of the protocol.`,
        `**${VERDICT.bad}** (red): the field is exposed with no reasonable workaround, or no usable, verifiable app supports private use. A custodian who can require disclosure to release funds also earns red.`,
      ]),
      'Substantial effort is what a non-developer cannot be expected to do, such as a second operating system, a build from source or a change to system files. Installing an app, like Tor Browser or a listed route, is not. A local Ethereum node is the only chain node we expect a careful user to run, and needing it together with a route is substantial.',
      "A closed app's delivery risk falls to the privileged insider. When the review reads and pins the code a closed web app or extension serves, the other cells rate that code like open code. A native closed app caps the network observer at yellow.",
      'When privacy depends on hiding among other users, the size of that group (anonymity set) affects the adversary who sees the later action. Until real use builds that group, ratings rest on what the design allows.',
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
      "Vendors behind an operator's backend are third parties. Each one the backend needs or the operator declares, such as an RPC provider, is presumed to receive what its job needs, grouped by user. Open backend code or a specific public statement from the operator rebuts this.",
      `Bulk downloads and a local node keep content out of requests. An [IP-hiding route](#${PRIVACY_IP_HIDING_ROUTES_ANCHOR}) keeps the IP out. An app that routes its own traffic can also give each step its own session. A mixnet's cover traffic hides when the user is online, but only the app can hide when they act.`,
      'Counterparties (e.g. private transfer recipients) also learn what the protocol hands them, such as a received note. We report this under the chain analyst and rate it only when it reaches parties the user never dealt with voluntarily.',
      'The public observer, chain analyst and future adversary see the same public data with increasing ability.',
    ]),

    // A raw heading, since markdown headings render without an id to link.
    ipHidingRoutes: joinBlocks([
      `<h2 id="${PRIVACY_IP_HIDING_ROUTES_ANCHOR}">IP-hiding routes</h2>`,
      "An IP-hiding route hides the user's IP from the services an app calls. Our advice names one where an app needs it. Its entry sees the user's IP, and its exit sees the destination. We list a route when it passes three checks:",
      bulletList([
        "It carries all of the app's traffic, and the exit gets no identifier that links connections.",
        'One operator or hosting company holds both the entry and the exit of at most 1% of connections, at every location we test.',
        "Its client's source and node list are public.",
      ]),
      'A route is decentralised when any two operators or hosting companies together hold the entry and the exit of at most 10% of connections. All routes below are, listed by the effort they take, each with its official download. Our steps name the lightest one that works with the app. Use Tor Browser for a website, and a route that carries all traffic for a native app.',
      bulletList([
        '**[Tor Browser](https://www.torproject.org/download/)**: a free install. Websites, each site on its own circuit.',
        '**[NymVPN](https://nym.com/download) with the Random profile**: a paid install. All traffic on desktop and mobile, UDP included. Its exits accept only listed ports. Its default and mixnet profiles pick gateways near the user, which fails the second check in some regions. It sends network statistics under a persistent id until Anonymous network stats is turned off in its settings.',
        "**[Orbot](https://orbot.app/en/download/)'s VPN mode**: a free install on Android. All traffic through Tor, which carries no UDP.",
        '**[Tails](https://tails.net/install/) or [Whonix](https://www.whonix.org/wiki/Download)**: a second operating system. All traffic through Tor. A local node must be reachable from inside it. [Qubes OS](https://www.qubes-os.org/downloads/) ships Whonix.',
      ]),
    ]),

    // A raw heading, since markdown headings render without an id to link.
    // Project pages link the section once, the habits carry no anchors.
    advice: joinBlocks([
      `<h2 id="${PRIVACY_ADVICE_ANCHOR}">How to stay private</h2>`,
      'Each project page gives our advice as steps that keep the privacy promise with the reference app, in the order the user takes them. Most steps follow the habits below.',
      heading(3, 'Fresh address'),
      'Exit to an address with no history and no public link to you, and use a new one for every exit.',
      heading(3, 'Separate wallet'),
      "Keep the fresh address in a different wallet app, created from its own seed. A wallet app can send every address it holds to its servers, and look up the next addresses of its seed. Spending from the fresh address later shows that app's fingerprint, so a common app on default settings blends in best.",
      heading(3, 'Relayers'),
      "A relayer submits the exit and takes its fee from the withdrawn funds. The receiving address then needs no gas from a wallet you own. Gas you pay yourself shows your wallet's fingerprint, such as its fee habits, even from a fresh address.",
      heading(3, 'Timing and amounts'),
      `A withdrawal right after its deposit is the easiest pair to guess, and a fixed wait is detected by an analyst. Draw the wait at random between 0 and ${ANONYMITY_SET_WINDOW_DAYS} days, the window our anonymity set counts. Every depositor of that window is then an equal candidate. On a quiet pool no wait helps, so exit only after many others have moved funds in and out. Move common amounts rather than the exact sum you deposited. Use the pool with the most depositors.`,
      heading(3, 'Sessions'),
      "Give each step its own network session, so no service ties the steps by IP, cookie or login. Tor Browser's New Identity starts one. With an ip-hiding route covering all traffic, reconnect it for a new exit and clear the browser's cookies. An app that loads every wallet it holds ties them in one session, so remove the deposit wallet before the exit.",
      heading(3, 'Wallet in Tor Browser'),
      "Tor Browser ships no wallet. A wallet extension installed in it, like MetaMask, sends all its traffic through Tor and keeps its accounts across restarts. Every site can see that a wallet is installed, which sets this browser apart from other Tor Browsers. Keep only the account a step needs in it, since the wallet's servers see every account it holds. A phone wallet joined through WalletConnect is the alternative, but it shows the phone's IP to the WalletConnect relay and to the wallet's own RPC, unless the phone runs a route too.",
      heading(3, 'Own node'),
      'An app that reads the chain through a hosted service tells it which addresses or notes you hold. A local Ethereum node answers those reads without a third party. Set it as the endpoint in the app, and in the depositing wallet if advised.',
      heading(3, 'App delivery'),
      `A hosted website can serve different code at any time, to you alone. An onchain name, like an ENS record, serves whatever its owner or governance points it to. Load the [reviewed release](#${PRIVACY_REFERENCE_APP_ANCHOR}) by the hash or contract address the steps name. For an IPFS hash, use your own IPFS node, since a public gateway can serve other code. [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/), an IPFS node in one install, serves it at http://localhost:8080/ipfs/ followed by the hash. Where the build reproduces, building it from the reviewed source we point at gives the same release without IPFS.`,
    ]),

    referenceApp: joinBlocks([
      // A raw heading, since markdown headings render without an id to link.
      `<h2 id="${PRIVACY_REFERENCE_APP_ANCHOR}">Reference app</h2>`,
      'Each project names a reference app, the most private released app we found for the protocol. The ratings assume this app. Other apps we checked appear below it, each with one sourced finding that shows it leaks more.',
      'An app takes the spot when it leaks less to the five adversaries. Only released builds count.',
      `App teams can propose their app in the ${link('Privacy adversaries framework', externalLinks.articles.privacyAdversariesFramework)} thread on the ETHBEAT forum.`,
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
      `Feedback on the framework is welcome in the ${link('Privacy adversaries framework', externalLinks.articles.privacyAdversariesFramework)} thread on the ETHBEAT forum.`,
    ]),
  }
}
