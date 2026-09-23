import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { DataAvailabilityProjectPage } from './DataAvailabilityProjectPage'

// Why: screen readers and LLMs navigate a page by its heading outline, so the
// project title must be the only h1, top-level sections h2 and grouped
// sections h3.
//
// How: server-render the whole page, layout included, the way ServerEntry
// does, then read the h1-h6 elements back out of the HTML in document order.
// The DA page is used because it is the one that nests sections in groups.
describe(DataAvailabilityProjectPage.name, () => {
  let previousSsrUrl: string
  beforeEach(() => {
    previousSsrUrl = globalThis.__FIX_SSR_URL__
    globalThis.__FIX_SSR_URL__ = '/data-availability/projects/ethereum'
  })
  afterEach(() => {
    globalThis.__FIX_SSR_URL__ = previousSsrUrl
  })

  it('renders the project title as the only h1', () => {
    const outline = getHeadingOutline(renderPage())

    expect(outline.filter((heading) => heading.startsWith('h1 '))).toEqual([
      'h1 Ethereum',
    ])
  })

  it('renders top-level sections as h2 and grouped sections as h3', () => {
    const outline = getHeadingOutline(renderPage())

    // Page chrome (search dialog, links accordion) precedes the sections and
    // is not what this test is about, so the outline is read from the first
    // section on.
    const firstSection = outline.indexOf('h2 Detailed description')
    expect(outline.slice(firstSection)).toEqual([
      'h2 Detailed description',
      'h2 Ethereum layer',
      'h3 Technology',
      'h2 Enshrined bridge',
      'h3 Bridge technology',
      'h3 Permissions',
    ])
  })

  it('keeps each section heading linked to its section anchor', () => {
    const html = renderPage()

    expect(html).toInclude('id="da-layer-technology"')
    expect(html).toMatchRegex(
      /<a href="#da-layer-technology"[^>]*>(?:(?!<\/a>)[\s\S])*<h3[^>]*>Technology<\/h3><\/a>/,
    )
  })
})

function renderPage(): string {
  return renderToString(
    createElement(DataAvailabilityProjectPage, {
      entry: ethereumEntry([
        markdownSection('detailed-description', 'Detailed description'),
        {
          type: 'Group',
          props: {
            id: 'da-layer',
            title: 'Ethereum layer',
            items: [markdownSection('da-layer-technology', 'Technology')],
          },
        },
        {
          type: 'Group',
          props: {
            id: 'da-bridge',
            title: 'Enshrined bridge',
            items: [
              markdownSection('da-bridge-technology', 'Bridge technology'),
              markdownSection('da-bridge-permissions', 'Permissions'),
            ],
          },
        },
      ]),
      queryState: { mutations: [], queries: [] },
      terms: [],
      recentlyAddedProjects: [],
      recentChangelogEntriesIds: [],
      whatsNew: undefined,
      countdowns: PROJECT_COUNTDOWNS,
    }),
  )
}

function markdownSection(
  id:
    | 'detailed-description'
    | 'da-layer-technology'
    | 'da-bridge-technology'
    | 'da-bridge-permissions',
  title: string,
): ProjectDetailsSection {
  return { type: 'MarkdownSection', props: { id, title, content: 'Body' } }
}

function ethereumEntry(
  sections: ProjectDetailsSection[],
): EthereumDaProjectPageEntry {
  return {
    entryType: 'ethereum',
    name: 'Ethereum',
    slug: 'ethereum',
    icon: '/icons/ethereum.png',
    kind: 'Public Blockchain',
    type: 'Public Blockchain',
    description: 'Ethereum description',
    isUnderReview: false,
    archivedAt: undefined,
    colors: undefined,
    header: {
      links: [],
      tvs: 0,
      economicSecurity: undefined,
      durationStorage: 0,
      maxThroughputPerSecond: undefined,
      usedIn: [],
      bridgeName: 'Enshrined bridge',
      callout: { title: 'Callout', description: 'Callout description' },
      numberOfValidators: undefined,
    },
    sections,
  }
}

function getHeadingOutline(html: string): string[] {
  return [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(
    ([, level, inner]) => `h${level} ${stripTags(inner ?? '')}`,
  )
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
