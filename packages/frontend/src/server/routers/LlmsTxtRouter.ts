import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import type { STATIC_PAGE_PATHS } from '~/server/pagePaths'

/**
 * Machine-oriented entry point for AI crawlers and agents, following the
 * llms.txt convention (https://llmstxt.org).
 */
export function createLlmsTxtRouter() {
  const router = express.Router()
  const body = renderLlmsTxt(LLMS_TXT)

  router.get('/llms.txt', (_req, res) => {
    res.header('Content-Type', 'text/markdown; charset=utf-8').send(body)
  })

  return router
}

/** To list a new page or endpoint, add one entry to the matching section. */
const LLMS_TXT = {
  title: 'L2BEAT',
  summary:
    'L2BEAT is an independent analytics and research website about Ethereum scaling. It tracks layer 2s, data availability layers and interoperability protocols, assessing their risks, maturity stages, value secured and activity.',
  notes:
    'In API paths, {slug} is the project slug used in project page URLs, e.g. arbitrum in https://l2beat.com/layer2s/projects/arbitrum. All endpoints except the scaling summary wrap their result as { success, data }.',
  sections: [
    {
      heading: 'Sections',
      links: [
        {
          name: 'Scaling summary',
          path: staticPagePath('/layer2s/summary'),
          description:
            'Every tracked layer 2 with its stage, risks, total value secured and category.',
        },
        {
          name: 'Scaling risk analysis',
          path: staticPagePath('/layer2s/risk'),
          description:
            'Per-project risk rosette: state validation, data availability, exit window, sequencer and proposer failure.',
        },
        {
          name: 'Total value secured (TVS)',
          path: staticPagePath('/layer2s/tvs'),
          description:
            'Value locked in or minted on each layer 2, split into native, canonically bridged and externally bridged tokens.',
        },
        {
          name: 'Activity',
          path: staticPagePath('/layer2s/activity'),
          description:
            'Transactions and user operations per second for each layer 2, compared with Ethereum.',
        },
        {
          name: 'Data availability',
          path: staticPagePath('/data-availability/summary'),
          description:
            'Data availability layers and their bridges, with economic security and fallback risks.',
        },
        {
          name: 'ZK catalog',
          path: staticPagePath('/zk-catalog'),
          description:
            'Zero-knowledge proving systems used by tracked projects, with their verifiers and trusted setups.',
        },
        {
          name: 'Glossary',
          path: staticPagePath('/glossary'),
          description: 'Definitions of the terms used across L2BEAT.',
        },
        {
          name: 'FAQ',
          path: staticPagePath('/faq'),
          description:
            'How L2BEAT works, what it tracks and how to read its data.',
        },
        {
          name: 'Publications',
          path: staticPagePath('/publications'),
          description:
            'Research, explainers, monthly ecosystem updates and governance reviews published by L2BEAT.',
        },
      ],
    },
    {
      heading: 'Markdown pages',
      links: [
        {
          name: 'Scaling project',
          path: '/layer2s/projects/{slug}.md',
          description:
            'One layer 2 or layer 3 as markdown: stage and its requirements, risks with sentiments, TVS and activity, technology, permissions and contracts. The HTML page URL with Accept: text/markdown returns the same.',
        },
      ],
    },
    {
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
    },
  ],
} satisfies LlmsTxt

interface LlmsTxt {
  title: string
  summary: string
  notes: string
  sections: {
    heading: string
    links: { name: string; path: `/${string}`; description: string }[]
  }[]
}

/** Typed against the page list, so removing a page breaks the build instead of leaving a dead link here. */
function staticPagePath(path: (typeof STATIC_PAGE_PATHS)[number]) {
  return path
}

function renderLlmsTxt(llmsTxt: LlmsTxt): string {
  const sections = llmsTxt.sections.map((section) =>
    [
      `## ${section.heading}`,
      '',
      ...section.links.map(
        (link) =>
          `- [${link.name}](${PRODUCTION_ORIGIN}${link.path}): ${link.description}`,
      ),
    ].join('\n'),
  )

  return `${[
    `# ${llmsTxt.title}`,
    `> ${llmsTxt.summary}`,
    llmsTxt.notes,
    ...sections,
  ].join('\n\n')}\n`
}
