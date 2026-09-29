import { expect } from 'earl'
import {
  absolutizeLinks,
  markCritical,
  nestHeadings,
  subsection,
  table,
} from './markdown'

// Method: feed small hand-written markdown snippets and compare with the
// expected text literally.
describe(nestHeadings.name, () => {
  it('moves the shallowest heading to the given level, keeping the hierarchy', () => {
    expect(nestHeadings('## Architecture\n\nText\n\n### Nodes', 4)).toEqual(
      '#### Architecture\n\nText\n\n##### Nodes',
    )
  })

  it('leaves text that is already deep enough or has no headings', () => {
    expect(nestHeadings('#### Deep', 3)).toEqual('#### Deep')
    expect(nestHeadings('Plain #hashtag text', 3)).toEqual(
      'Plain #hashtag text',
    )
  })

  it('does not treat # lines inside code fences as headings', () => {
    expect(nestHeadings('# Title\n\n```\n# comment\n```', 3)).toEqual(
      '### Title\n\n```\n# comment\n```',
    )
  })

  it('stops at level 6, the deepest markdown heading', () => {
    expect(nestHeadings('# One\n\n## Two', 6)).toEqual(
      '###### One\n\n###### Two',
    )
  })
})

describe(subsection.name, () => {
  it('heads a non-empty body', () => {
    expect(subsection(3, 'Roles', 'Body')).toEqual('### Roles\n\nBody')
  })

  it('drops the heading when there is no body to head', () => {
    expect(subsection(3, 'Roles', '')).toEqual('')
    expect(subsection(3, 'Roles', undefined)).toEqual('')
  })
})

describe(absolutizeLinks.name, () => {
  it('prefixes site paths in links and images with the origin', () => {
    expect(
      absolutizeLinks(
        'See [best practices](/publications/x) and ![diagram](/images/y.png).',
        'https://l2beat.com',
      ),
    ).toEqual(
      'See [best practices](https://l2beat.com/publications/x) and ![diagram](https://l2beat.com/images/y.png).',
    )
  })

  it('leaves absolute and protocol-relative URLs alone', () => {
    const text = '[a](https://example.com/x) [b](//cdn.example.com/y)'
    expect(absolutizeLinks(text, 'https://l2beat.com')).toEqual(text)
  })
})

describe(markCritical.name, () => {
  it('puts the marker before the closing punctuation', () => {
    expect(markCritical('Funds can be stolen.', true)).toEqual(
      'Funds can be stolen (CRITICAL).',
    )
  })

  it('appends the marker to text without closing punctuation', () => {
    expect(markCritical('Program hashes are unverified', true)).toEqual(
      'Program hashes are unverified (CRITICAL)',
    )
  })

  it('leaves non-critical text alone', () => {
    expect(markCritical('Funds can be stolen.', false)).toEqual(
      'Funds can be stolen.',
    )
  })
})

describe(table.name, () => {
  it('escapes pipes so a cell cannot split into two columns', () => {
    expect(table(['Asset', 'Value'], [['A|B', '$1']])).toEqual(
      '| Asset | Value |\n| --- | --- |\n| A\\|B | $1 |',
    )
  })
})
