import { expect } from 'earl'

import { readMarkdown } from './readMarkdown'

describe(readMarkdown.name, () => {
  it('reads a markdown file relative to src and trims it', () => {
    const content = readMarkdown('utils/test/fixture.md')

    expect(content.startsWith('## Fixture')).toEqual(true)
    expect(content.endsWith('file.')).toEqual(true)
  })

  it('throws with the file path in cause when the file is missing', () => {
    const error = catchError(() => readMarkdown('utils/test/missing.md'))

    expect(error.message).toEqual('Markdown file not found')
    expect((error.cause as { filePath: string }).filePath).toMatchRegex(
      /utils\/test\/missing\.md$/,
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
    const error = catchError(() =>
      readMarkdown('utils/test/fixtureWithVars.md', { delay: '2d 8h' }),
    )

    expect(error.message).toEqual('Missing template variable')
    expect(error.cause).toEqual({
      name: 'threshold',
      pathFromSrc: 'utils/test/fixtureWithVars.md',
    })
  })

  it('throws when a var has no matching placeholder', () => {
    const error = catchError(() =>
      readMarkdown('utils/test/fixtureWithVars.md', {
        delay: '2d 8h',
        threshold: 1000,
        quorum: 5,
      }),
    )

    expect(error.message).toEqual('Unused template variables')
    expect(error.cause).toEqual({
      pathFromSrc: 'utils/test/fixtureWithVars.md',
      unused: ['quorum'],
    })
  })
})

function catchError(run: () => unknown): Error {
  try {
    run()
  } catch (error) {
    expect(error).toBeA(Error)
    return error as Error
  }
  throw new Error('Expected the call to throw')
}
