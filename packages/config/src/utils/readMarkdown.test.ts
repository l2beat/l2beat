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
})
