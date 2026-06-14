import { expect } from 'earl'

import { readMarkdown } from './readMarkdown'

describe(readMarkdown.name, () => {
  it('reads a markdown file relative to src and trims it', () => {
    const content = readMarkdown('utils/test/fixture.md')

    expect(content.startsWith('## Fixture')).toEqual(true)
    expect(content.endsWith('file.')).toEqual(true)
  })

  it('throws with the file path when the file is missing', () => {
    expect(() => readMarkdown('utils/test/missing.md')).toThrow(
      /Markdown file not found:.*utils\/test\/missing\.md/,
    )
  })

  it('substitutes {{name}} placeholders from vars', () => {
    const content = readMarkdown('utils/test/fixtureWithVars.md', {
      delay: '2d 8h',
      threshold: 1000,
    })

    expect(content).toEqual(
      'The delay is 2d 8h and the threshold is 1000 TORN. The delay is 2d 8h again.',
    )
  })

  it('throws when a placeholder has no matching var', () => {
    expect(() =>
      readMarkdown('utils/test/fixtureWithVars.md', { delay: '2d 8h' }),
    ).toThrow(
      /Missing template variable \{\{threshold\}\} for utils\/test\/fixtureWithVars\.md/,
    )
  })

  it('throws when a var has no matching placeholder', () => {
    expect(() =>
      readMarkdown('utils/test/fixtureWithVars.md', {
        delay: '2d 8h',
        threshold: 1000,
        quorum: 5,
      }),
    ).toThrow(
      /Unused template variables for utils\/test\/fixtureWithVars\.md: quorum/,
    )
  })
})
