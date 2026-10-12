import express from 'express'
import {
  DEFI_SUMMARY_DESCRIPTION,
  PRIVACY_SUMMARY_DESCRIPTION,
  ZK_CATALOG_DESCRIPTION,
} from '~/consts/summaryPageDescriptions'
import { getDaListSections } from '~/server/markdown/list-pages/getDaListSections'
import { getDefiListSections } from '~/server/markdown/list-pages/getDefiListSections'
import { getInteropListSections } from '~/server/markdown/list-pages/getInteropListSections'
import { getPrivacyListSections } from '~/server/markdown/list-pages/getPrivacyListSections'
import { getScalingListSections } from '~/server/markdown/list-pages/getScalingListSections'
import { getZkListSections } from '~/server/markdown/list-pages/getZkListSections'
import {
  type LinkListSection,
  renderLinkListMarkdown,
} from '~/server/markdown/listPageMarkdown'
import {
  serveMarkdown,
  serveMarkdownIfPreferred,
} from '~/server/markdown/markdownAlternate'
import { TRUSTED_SETUP_FRAMEWORK_LINK } from '~/server/markdown/zkSectionBodies'
import {
  LIST_PAGES_WITH_MARKDOWN,
  type ListPageWithMarkdown,
} from '~/utils/getMarkdownAlternatePath'

/**
 * Markdown versions of the pages that list what L2BEAT tracks, at the page
 * URL plus `.md` as the llms.txt spec recommends. llms.txt links here instead
 * of listing every project itself, so it stays small enough to fit in context
 * while an agent can still map a project name to its page and API slug.
 *
 * The page URL itself answers with the same markdown when Accept prefers it,
 * and falls through to the HTML page otherwise.
 */
export function createMarkdownAlternatesRouter(
  alternates: MarkdownAlternate[] = MARKDOWN_ALTERNATES,
) {
  const router = express.Router()

  for (const alternate of alternates) {
    const getMarkdown = async () =>
      renderLinkListMarkdown(alternate, await alternate.getSections())

    router.get(alternate.path, serveMarkdown(getMarkdown))
    router.get(
      toPagePath(alternate.path),
      serveMarkdownIfPreferred(getMarkdown),
    )
  }

  return router
}

function toPagePath(alternatePath: MarkdownAlternatePath) {
  return alternatePath.slice(0, -'.md'.length)
}

export type MarkdownAlternatePath = `${ListPageWithMarkdown}.md`

export interface MarkdownAlternate {
  path: MarkdownAlternatePath
  title: string
  summary: string
  /** The intro the HTML page shows above its table. */
  notes?: string
  getSections: () => Promise<LinkListSection[]>
}

/** Keyed by the registry, so every list page registered as having markdown gets its document. */
const LIST_PAGE_DOCUMENTS: Record<
  ListPageWithMarkdown,
  Omit<MarkdownAlternate, 'path'>
> = {
  '/layer2s/summary': {
    title: 'L2BEAT scaling projects',
    summary:
      'Every layer 2 and layer 3 tracked by L2BEAT, with category, stage, stack and host chain. Each link is the project page; its last path segment is the {slug} for the public API.',
    getSections: getScalingListSections,
  },
  '/data-availability/summary': {
    title: 'L2BEAT data availability layers',
    summary:
      'Every data availability layer tracked by L2BEAT with its type and risks: public layers one entry per bridge to Ethereum plus one for use without a bridge, and custom solutions built for a single project.',
    getSections: getDaListSections,
  },
  '/zk-catalog': {
    title: 'L2BEAT ZK catalog',
    summary:
      'Zero-knowledge proving systems used by tracked projects, with their creators, trusted setups and onchain verifiers.',
    notes: [
      ZK_CATALOG_DESCRIPTION,
      '',
      `Trusted setup risks (green, yellow, red) follow the ${TRUSTED_SETUP_FRAMEWORK_LINK}.`,
    ].join('\n'),
    getSections: getZkListSections,
  },
  '/privacy/summary': {
    title: 'L2BEAT privacy protocols',
    summary:
      'Privacy protocols on Ethereum and its layer 2s tracked by L2BEAT, with their category and exit window.',
    notes: PRIVACY_SUMMARY_DESCRIPTION,
    getSections: getPrivacyListSections,
  },
  '/interop/summary': {
    title: 'L2BEAT interoperability protocols',
    summary:
      'Cross-chain protocols tracked by L2BEAT, with their type and the bridge types they use.',
    notes:
      'Token pages live at /interop/tokens/{id}/{issuer}/{symbol}, where {id} is case-sensitive and alone identifies the token. Token ids come from the database, so they are not listed here: take them from the token links on the protocol pages.',
    getSections: getInteropListSections,
  },
  '/defi/summary': {
    title: 'L2BEAT DeFi protocols',
    summary: 'DeFi protocols tracked by L2BEAT, with their category.',
    notes: DEFI_SUMMARY_DESCRIPTION,
    getSections: getDefiListSections,
  },
}

/** The registry already leaves out pages that are switched off, which would be 404s. */
export const MARKDOWN_ALTERNATES: MarkdownAlternate[] =
  LIST_PAGES_WITH_MARKDOWN.map((page) => ({
    path: `${page}.md`,
    ...LIST_PAGE_DOCUMENTS[page],
  }))
