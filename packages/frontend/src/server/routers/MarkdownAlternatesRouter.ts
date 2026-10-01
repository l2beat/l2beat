import express from 'express'
import { getDaListSections } from '~/server/markdown/list-pages/getDaListSections'
import { getDefiListSections } from '~/server/markdown/list-pages/getDefiListSections'
import { getInteropListSections } from '~/server/markdown/list-pages/getInteropListSections'
import { getPrivacyListSections } from '~/server/markdown/list-pages/getPrivacyListSections'
import { getScalingListSections } from '~/server/markdown/list-pages/getScalingListSections'
import { getZkListSections } from '~/server/markdown/list-pages/getZkListSections'
import {
  type MarkdownSection,
  renderMarkdown,
} from '~/server/markdown/listPageMarkdown'
import { sendMarkdownDocument } from '~/server/markdown/markdownAlternate'
import { TRUSTED_SETUP_FRAMEWORK_LINK } from '~/server/markdown/zkSectionBodies'
import {
  isServedAsMarkdown,
  type ListPageWithMarkdown,
} from '~/utils/getMarkdownAlternatePath'

/**
 * Markdown versions of the pages that list what L2BEAT tracks, at the page
 * URL plus `.md` as the llms.txt spec recommends. llms.txt links here instead
 * of listing every project itself, so it stays small enough to fit in context
 * while an agent can still map a project name to its page and API slug.
 */
export function createMarkdownAlternatesRouter(
  alternates: MarkdownAlternate[] = MARKDOWN_ALTERNATES,
) {
  const router = express.Router()

  for (const alternate of alternates) {
    router.get(alternate.path, async (_req, res) => {
      sendMarkdownDocument(
        res,
        renderMarkdown(alternate, await alternate.getSections()),
      )
    })
  }

  return router
}

export type MarkdownAlternatePath = `${ListPageWithMarkdown}.md`

export interface MarkdownAlternate {
  path: MarkdownAlternatePath
  title: string
  summary: string
  /** The intro the HTML page shows above its table. */
  notes?: string
  getSections: () => Promise<MarkdownSection[]>
}

const ALL_MARKDOWN_ALTERNATES: MarkdownAlternate[] = [
  {
    path: '/layer2s/summary.md',
    title: 'L2BEAT scaling projects',
    summary:
      'Every layer 2 and layer 3 tracked by L2BEAT, with category, stage, stack and host chain. Each link is the project page; its last path segment is the {slug} for the public API.',
    getSections: getScalingListSections,
  },
  {
    path: '/data-availability/summary.md',
    title: 'L2BEAT data availability layers',
    summary:
      'Every data availability layer tracked by L2BEAT with its type and risks: public layers one entry per bridge to Ethereum plus one for use without a bridge, and custom solutions built for a single project.',
    getSections: getDaListSections,
  },
  {
    path: '/zk-catalog.md',
    title: 'L2BEAT ZK catalog',
    summary:
      'Zero-knowledge proving systems used by tracked projects, with their creators, trusted setups and onchain verifiers.',
    notes: [
      'ZK Catalog by L2BEAT is a community-driven resource offering detailed insights into the ZK technology utilized by various blockchain projects. It aims to enhance transparency and understanding of ZK tech implementations across the industry.',
      '',
      `Trusted setup risks (green, yellow, red) follow the ${TRUSTED_SETUP_FRAMEWORK_LINK}.`,
    ].join('\n'),
    getSections: getZkListSections,
  },
  {
    path: '/privacy/summary.md',
    title: 'L2BEAT privacy protocols',
    summary:
      'Privacy protocols on Ethereum and its layer 2s tracked by L2BEAT, with their category and exit window.',
    notes:
      'Analysis of privacy protocols on Ethereum focusing on CROPS principles (Censorship Resistance, Openness, Privacy, Security).',
    getSections: getPrivacyListSections,
  },
  {
    path: '/interop/summary.md',
    title: 'L2BEAT interoperability protocols',
    summary:
      'Cross-chain protocols tracked by L2BEAT, with their type and the bridge types they use.',
    notes:
      'Token pages live at /interop/tokens/{id}/{issuer}/{symbol}, where {id} is case-sensitive and alone identifies the token. Token ids come from the database, so they are not listed here: take them from the token links on the protocol pages.',
    getSections: getInteropListSections,
  },
  {
    path: '/defi/summary.md',
    title: 'L2BEAT DeFi protocols',
    summary: 'DeFi protocols tracked by L2BEAT, with their category.',
    notes: 'Overview of DeFi protocols tracked by L2BEAT.',
    getSections: getDefiListSections,
  },
]

/** Without the alternates of pages that are switched off, which would be 404s. */
export const MARKDOWN_ALTERNATES = ALL_MARKDOWN_ALTERNATES.filter((alternate) =>
  isServedAsMarkdown(alternate.path),
)
