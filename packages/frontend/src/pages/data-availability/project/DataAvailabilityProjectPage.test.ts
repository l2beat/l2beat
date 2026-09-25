import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { expect } from 'earl'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import type {
  ProjectDetailsSection,
  ProjectSectionId,
} from '~/components/projects/sections/types'
import type { EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { DataAvailabilityProjectPage } from './DataAvailabilityProjectPage'

// Why: screen readers and LLMs navigate a page by its heading outline, so the
// project title must be the only h1, top-level sections h2, grouped sections
// h3, and headings authored inside section content sit below their section.
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

  it('nests sections and their authored headings below the project title', () => {
    const outline = getHeadingOutline(renderPage())

    expect(headingsFromFirstSection(outline)).toEqual([
      'h2 Detailed description',
      'h3 Architecture',
      'h4 Upgradeability',
      'h2 Ethereum layer',
      'h3 Technology',
      'h4 Consensus',
      'h2 Enshrined bridge',
      'h3 Bridge technology',
      'h3 Permissions',
      'h4 Ethereum',
    ])
  })

  it('keeps the authored look of headings moved below their section', () => {
    const html = renderPage()

    expect(html).toInclude('<h3 class="mdc-h1">Architecture</h3>')
    expect(html).toInclude('<h4 class="mdc-h2">Upgradeability</h4>')
    expect(html).toInclude('<h4 class="mdc-h2">Consensus</h4>')
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
        markdownSection(
          'detailed-description',
          'Detailed description',
          '# Architecture\n\nBody\n\n## Upgradeability\n\nBody',
        ),
        {
          type: 'Group',
          props: {
            id: 'da-layer',
            title: 'Ethereum layer',
            items: [
              markdownSection(
                'da-layer-technology',
                'Technology',
                // Real DA technology descriptions start at `##`.
                '## Consensus\n\nBody',
              ),
            ],
          },
        },
        {
          type: 'Group',
          props: {
            id: 'da-bridge',
            title: 'Enshrined bridge',
            items: [
              markdownSection('da-bridge-technology', 'Bridge technology'),
              {
                type: 'PermissionsSection',
                props: {
                  id: 'da-bridge-permissions',
                  title: 'Permissions',
                  permissionsByChain: {
                    Ethereum: { roles: [], actors: [] },
                  },
                },
              },
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
  id: ProjectSectionId,
  title: string,
  content = 'Body',
): ProjectDetailsSection {
  return { type: 'MarkdownSection', props: { id, title, content } }
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

// Page chrome (search dialog, links accordion) precedes the sections and is
// not what these tests are about.
function headingsFromFirstSection(outline: string[]): string[] {
  return outline.slice(outline.indexOf('h2 Detailed description'))
}

// Repeats until nothing changes, so a tag split across a removed one is
// removed too.
function stripTags(html: string): string {
  let previous: string
  let current = html
  do {
    previous = current
    current = current.replace(/<[^>]*>/g, '')
  } while (current !== previous)
  return current.trim()
}
