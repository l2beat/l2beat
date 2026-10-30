import type { ConfigReader } from '@l2beat/discovery'
import { expect, mockFn, mockObject } from 'earl'
import { readFileSync } from 'fs'
import { join } from 'path'
import { renderProjectPage, withProjectMeta } from './renderProjectPage'

const INDEX_HTML = readFileSync(
  join(__dirname, '../../../../discoui/index.html'),
  'utf-8',
)

describe(renderProjectPage.name, () => {
  it('names a known project', () => {
    const configReader = mockConfigReader(['arbitrum'])

    const html = renderProjectPage(configReader, INDEX_HTML, {
      project: 'arbitrum',
    })

    expect(html).toInclude('<title>arbitrum | Disco</title>')
    expect(configReader.projectConfigExists).toHaveBeenOnlyCalledWith(
      'arbitrum',
    )
  })

  it('serves the generic page for an unknown project', () => {
    const configReader = mockConfigReader(['arbitrum'])

    const html = renderProjectPage(configReader, INDEX_HTML, {
      project: 'not-a-project',
    })

    expect(html).toEqual(INDEX_HTML)
  })

  it('serves the generic page without a lookup for an invalid name', () => {
    const configReader = mockConfigReader(['arbitrum'])

    const html = renderProjectPage(configReader, INDEX_HTML, {
      project: '../arbitrum',
    })

    expect(html).toEqual(INDEX_HTML)
    expect(configReader.projectConfigExists).not.toHaveBeenCalled()
  })
})

describe(withProjectMeta.name, () => {
  it('puts the project into the title, description and url tags', () => {
    const html = withProjectMeta(INDEX_HTML, 'arbitrum')

    expect(html).toInclude('<title>arbitrum | Disco</title>')
    expect(html).toInclude(
      '<meta property="og:title" content="arbitrum | Disco" />',
    )
    expect(html).toInclude(
      '<meta name="twitter:title" content="arbitrum | Disco" />',
    )
    expect(html).toInclude(
      '<meta property="og:url" content="https://disco.l2beat.com/ui/p/arbitrum" />',
    )
    expect(html).toInclude(
      '<meta property="og:description" content="Contracts and permissions of arbitrum, discovered onchain" />',
    )
    expect(html).toInclude('<meta property="og:site_name" content="Disco" />')
    expect(html).not.toInclude('content="A dashboard to explore')
    expect(html).not.toInclude('content="https://disco.l2beat.com/"')
  })

  it('leaves the rest of the page untouched', () => {
    const html = withProjectMeta(INDEX_HTML, 'arbitrum')

    expect(html).toInclude('<div id="root" class="h-full w-full"></div>')
    expect(html.split('\n').length).toEqual(INDEX_HTML.split('\n').length)
  })

  it('escapes the project name', () => {
    const html = withProjectMeta(INDEX_HTML, `"><script>alert('x')</script>`)

    expect(html).not.toInclude('<script>alert')
    expect(html).toInclude(
      '<title>&quot;&gt;&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt; | Disco</title>',
    )
    expect(html).toInclude(
      'content="https://disco.l2beat.com/ui/p/%22%3E%3Cscript%3Ealert(&#39;x&#39;)%3C%2Fscript%3E"',
    )
  })

  it('throws when index.html lacks a tag it rewrites', () => {
    const html = INDEX_HTML.replace('<title>Disco</title>', '')

    expect(() => withProjectMeta(html, 'arbitrum')).toThrow(
      'Meta tag missing from index.html',
    )
  })
})

function mockConfigReader(projects: string[]) {
  return mockObject<ConfigReader>({
    projectConfigExists: mockFn((project: string) =>
      projects.includes(project),
    ),
  })
}
