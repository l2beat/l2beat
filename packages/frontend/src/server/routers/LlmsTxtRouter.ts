import express from 'express'
import { externalLinks } from '~/consts/externalLinks'
import type { STATIC_PAGE_PATHS } from '~/server/pagePaths'
import {
  type MarkdownAlternatePath,
  type MarkdownSection,
  renderMarkdown,
} from './MarkdownAlternatesRouter'

/**
 * Entry point for AI agents, following the llms.txt spec (https://llmstxt.org):
 * a short curated map of the site that fits in context, with detail behind
 * the links. Project lists live in the markdown alternates, not here.
 */
export function createLlmsTxtRouter() {
  const router = express.Router()
  const body = renderMarkdown(LLMS_TXT, [
    ...PAGE_SECTIONS,
    API_SECTION,
    OPTIONAL_SECTION,
  ])

  router.get('/llms.txt', (_req, res) => {
    res.header('Content-Type', 'text/markdown; charset=utf-8').send(body)
  })

  return router
}

const LLMS_TXT = {
  title: 'L2BEAT',
  summary:
    'L2BEAT is an independent analytics and research website about Ethereum scaling. It tracks layer 2s and layer 3s, data availability layers, interoperability protocols, privacy protocols and zero-knowledge proving systems, assessing their risks, maturity stages, value secured, activity, liveness and costs. Risk assessments are backed by on-chain contract discovery and all project data is open source.',
  notes: [
    'Important notes:',
    '',
    '- Links ending in .md are markdown versions of the page, listing every tracked project with its page URL. The other links are HTML pages.',
    '- {slug} in API paths is the last segment of a project page URL, e.g. arbitrum for https://l2beat.com/layer2s/projects/arbitrum.',
    '- All API endpoints except the scaling summary wrap their result as { success, data }.',
    '- "Stage" is the rollup maturity level (Stage 0, 1 or 2) defined by the stages framework linked below.',
    '',
    'When to use L2BEAT:',
    '',
    '- To answer which layer 2s exist, how mature they are (stage), what their risks are and how they compare.',
    '- To get current or historical total value secured, activity, liveness or cost figures for a layer 2, via the pages or the JSON API.',
    '- To check where a layer 2 posts its data and how secure that data availability layer and its bridge are.',
    '- To look up which proving system, stack or ecosystem a project uses, or the definitions behind L2BEAT terms.',
    '- Not for token prices, exchange data, wallet balances or anything outside Ethereum scaling and its infrastructure.',
  ].join('\n'),
}

/** To list a new page, add one entry to the matching section. */
const PAGE_SECTIONS: MarkdownSection[] = [
  {
    heading: 'Scaling (layer 2s and layer 3s)',
    links: [
      {
        name: 'All scaling projects',
        path: markdownAlternate('/layer2s/summary.md'),
        description:
          'Markdown list of every tracked layer 2, layer 3 and ecosystem with category, stage, stack, host chain and page URL.',
      },
      {
        name: 'Summary',
        path: staticPagePath('/layer2s/summary'),
        description:
          'Every tracked layer 2 and layer 3 with its stage, risk rosette, total value secured, category and stack.',
      },
      {
        name: 'Risk analysis',
        path: staticPagePath('/layer2s/risk'),
        description:
          'Per-project risk rosette: state validation, data availability, exit window, sequencer failure and proposer failure.',
      },
      {
        name: 'State validation',
        path: staticPagePath('/layer2s/risk/state-validation'),
        description:
          'How each project proves or challenges its state: proof system, challenge period, verifier and upgrade delays.',
      },
      {
        name: 'Data availability risks',
        path: staticPagePath('/layer2s/risk/data-availability'),
        description:
          'Where each project posts its data and the risks of that choice: layer, bridge, mode and attestations.',
      },
      {
        name: 'Sequencing',
        path: staticPagePath('/layer2s/risk/sequencing'),
        description:
          'Who orders transactions on each project and what users can do if the sequencer fails or censors.',
      },
      {
        name: 'Total value secured (TVS)',
        path: staticPagePath('/layer2s/tvs'),
        description:
          'Value secured by each layer 2, split into native, canonically bridged and externally bridged tokens, with 7- and 30-day changes.',
      },
      {
        name: 'TVS breakdown',
        path: staticPagePath('/layer2s/tvs/breakdown'),
        description:
          'Every token counted in TVS across all projects, with amount, USD value, category and bridging source.',
      },
      {
        name: 'Activity',
        path: staticPagePath('/layer2s/activity'),
        description:
          'Transactions and user operations per second for each layer 2, compared with Ethereum, with 7- and 30-day changes.',
      },
      {
        name: 'Liveness',
        path: staticPagePath('/layer2s/liveness'),
        description:
          'How often each project submits batches, state updates and proofs to Ethereum, with intervals and anomalies.',
      },
      {
        name: 'Costs',
        path: staticPagePath('/layer2s/costs'),
        description:
          'What each project pays Ethereum for calldata, blobs, compute and overhead, in ETH, USD and gas, per transaction or in total.',
      },
      {
        name: 'Archived projects',
        path: staticPagePath('/layer2s/archived'),
        description:
          'Layer 2s and layer 3s that shut down or are no longer tracked, with their last known data.',
      },
      {
        name: 'Stages framework',
        path: staticPagePath('/stages'),
        description:
          'The rollup maturity framework: what a project must satisfy to be Stage 0, Stage 1 or Stage 2.',
      },
      {
        name: 'Native rollups',
        path: staticPagePath('/native-rollups'),
        description:
          'Explainer and tracker for native rollups, which verify state transitions with an Ethereum precompile.',
      },
    ],
  },
  {
    heading: 'Data availability',
    links: [
      {
        name: 'All data availability layers',
        path: markdownAlternate('/data-availability/summary.md'),
        description:
          'Markdown list of every tracked data availability layer and bridge with page URL.',
      },
      {
        name: 'Summary',
        path: staticPagePath('/data-availability/summary'),
        description:
          'Data availability layers and their bridges to Ethereum, with economic security, throughput and the projects using each.',
      },
      {
        name: 'Risk analysis',
        path: staticPagePath('/data-availability/risk'),
        description:
          'Per-layer and per-bridge risks: economic security, fraud detection, committee security, upgradeability and relayer failure.',
      },
      {
        name: 'Throughput',
        path: staticPagePath('/data-availability/throughput'),
        description:
          'Data posted per day to each layer, its maximum capacity and which projects post the most.',
      },
      {
        name: 'Liveness',
        path: staticPagePath('/data-availability/liveness'),
        description:
          'How regularly data is posted to each layer and whether its bridge keeps up.',
      },
      {
        name: 'Archived layers',
        path: staticPagePath('/data-availability/archived'),
        description: 'Data availability layers no longer tracked.',
      },
      {
        name: 'Data availability risk framework',
        path: staticPagePath('/da-risk-framework'),
        description:
          'How L2BEAT evaluates the risks of data availability layers and their bridges.',
      },
    ],
  },
  {
    heading: 'Interoperability',
    links: [
      {
        name: 'Summary',
        path: staticPagePath('/interop/summary'),
        description:
          'Cross-chain protocols and token frameworks connecting Ethereum and its layer 2s, with activity and message volumes.',
      },
      {
        name: 'Non-minting bridges',
        path: staticPagePath('/interop/non-minting'),
        description:
          'Protocols that move messages or liquidity without minting new token representations.',
      },
      {
        name: 'Lock-and-mint bridges',
        path: staticPagePath('/interop/lock-and-mint'),
        description:
          'Bridges that lock tokens on one chain and mint a representation on another.',
      },
      {
        name: 'Burn-and-mint bridges',
        path: staticPagePath('/interop/burn-and-mint'),
        description:
          'Bridges that burn tokens on the source chain and mint them on the destination.',
      },
      {
        name: 'Token frameworks',
        path: staticPagePath('/interop/token-frameworks'),
        description:
          'Standards for multi-chain tokens such as xERC20, OFT and NTT, and which tokens use them.',
      },
      {
        name: 'Intent bridges',
        path: staticPagePath('/interop/intent-bridges'),
        description:
          'Protocols where solvers fill user intents across chains and settle afterwards.',
      },
    ],
  },
  {
    heading: 'Other trackers',
    links: [
      {
        name: 'Privacy',
        path: staticPagePath('/privacy/summary'),
        description:
          'Privacy protocols on Ethereum and its layer 2s, with what they hide, anonymity set sizes and trust assumptions.',
      },
      {
        name: 'All privacy protocols',
        path: markdownAlternate('/privacy/summary.md'),
        description:
          'Markdown list of every tracked privacy protocol with page URL.',
      },
      {
        name: 'ZK catalog',
        path: staticPagePath('/zk-catalog'),
        description:
          'Zero-knowledge proving systems used by tracked projects, with their verifiers, trusted setups, audits and which projects rely on them.',
      },
      {
        name: 'All proving systems',
        path: markdownAlternate('/zk-catalog.md'),
        description:
          'Markdown list of every proving system in the ZK catalog with creator and page URL.',
      },
      {
        name: 'Governance',
        path: staticPagePath('/governance'),
        description:
          'L2BEAT governance research, delegate activity and the projects L2BEAT holds delegated voting power in.',
      },
      {
        name: 'Multisig report',
        path: staticPagePath('/multisig-report'),
        description:
          'Report on how multisigs are used to govern and upgrade layer 2s.',
      },
    ],
  },
  {
    heading: 'Reference',
    links: [
      {
        name: 'Glossary',
        path: staticPagePath('/glossary'),
        description: 'Definitions of the terms used across L2BEAT.',
      },
      {
        name: 'FAQ',
        path: staticPagePath('/faq'),
        description:
          'How L2BEAT works, what it tracks, how TVS and risks are computed and how to get a project listed.',
      },
      {
        name: 'Publications',
        path: staticPagePath('/publications'),
        description:
          'Research, explainers, monthly ecosystem updates and governance reviews published by L2BEAT.',
      },
      {
        name: 'Changelog',
        path: staticPagePath('/changelog'),
        description:
          'Dated log of changes to the site, its frameworks and its methodology.',
      },
      {
        name: 'About us',
        path: staticPagePath('/about-us'),
        description: 'The mission, team and funding of L2BEAT.',
      },
    ],
  },
]

/** To list a new endpoint, add one entry here; a test compares this with the public API router. */
const API_SECTION: MarkdownSection = {
  heading: 'Public API',
  links: [
    {
      name: 'Scaling summary',
      path: '/api/scaling/summary',
      description:
        'JSON of every active layer 2 and layer 3 (stage, risks, TVS breakdown, category, stack) plus a 30-day TVS chart.',
    },
    {
      name: 'Scaling TVS',
      path: '/api/scaling/tvs',
      description:
        'Current USD and ETH value plus a TVS chart (native, canonical, external, ETH price); query params: range, type, projectIds, excludeAssociatedTokens, excludeRwaRestrictedTokens (defaults to true).',
    },
    {
      name: 'Project TVS',
      path: '/api/scaling/tvs/{slug}',
      description:
        'Current USD and ETH value plus a TVS chart for one project; query params: range, excludeAssociatedTokens, excludeRwaRestrictedTokens (defaults to true).',
    },
    {
      name: 'Project TVS breakdown',
      path: '/api/scaling/tvs/{slug}/breakdown',
      description:
        'The tokens making up one project TVS, with amounts, USD values, category and bridging source.',
    },
    {
      name: 'Scaling activity',
      path: '/api/scaling/activity',
      description:
        'Chart of transaction and user operation counts for layer 2s; query params: range, type, projectIds.',
    },
    {
      name: 'Project activity',
      path: '/api/scaling/activity/{slug}',
      description:
        'Chart of transaction and user operation counts for one project, or for Ethereum with slug ethereum; query param: range.',
    },
  ],
}

const OPTIONAL_SECTION: MarkdownSection = {
  heading: 'Optional',
  links: [
    {
      name: 'Source code and project configs',
      url: externalLinks.github,
      description:
        'The L2BEAT monorepo: frontend, backend, and every project config with risks, contracts, permissions and discovery history.',
    },
    {
      name: 'Governance forum',
      url: externalLinks.forum,
      description: 'Discussion of L2BEAT governance research and delegation.',
    },
    {
      name: 'Medium',
      url: externalLinks.medium,
      description: 'Long-form articles and framework announcements.',
    },
    {
      name: 'X',
      url: externalLinks.x,
      description: 'Announcements and short updates.',
    },
    {
      name: 'Donate',
      path: staticPagePath('/donate'),
      description: 'How to support L2BEAT as a public good.',
    },
    {
      name: 'Terms of service',
      path: staticPagePath('/terms-of-service'),
      description: 'Terms of use for the site and its data.',
    },
  ],
}

/** Typed against the page list, so removing a page breaks the build instead of leaving a dead link here. */
function staticPagePath(path: (typeof STATIC_PAGE_PATHS)[number]) {
  return path
}

/** Typed against the alternates, and a test checks each one is actually served. */
function markdownAlternate(path: MarkdownAlternatePath) {
  return path
}
