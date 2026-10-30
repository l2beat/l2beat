import { expect } from 'earl'
import { parseModelJson } from './parseModelJson'

/**
 * The three shapes a model answer takes (bare JSON, a fenced block, JSON
 * with prose around it) must all parse, and garbage must come back as an
 * error message rather than a throw, because the loop turns it into a
 * finding.
 */
describe(parseModelJson.name, () => {
  it('parses bare JSON, a fenced block and JSON surrounded by prose', () => {
    expect(parseModelJson(' {"a":1} ')).toEqual({ value: { a: 1 } })
    expect(parseModelJson('Here:\n```json\n{"a":1}\n```\nDone.')).toEqual({
      value: { a: 1 },
    })
    expect(parseModelJson('```\n{"a":[1,2]}\n```')).toEqual({
      value: { a: [1, 2] },
    })
    expect(parseModelJson('Sure. {"a":{"b":"}"}} hope it helps')).toEqual({
      value: { a: { b: '}' } },
    })
  })

  it('takes the object that closes when a stray brace follows it', () => {
    expect(parseModelJson('{"a":{"b":"}"}}}')).toEqual({
      value: { a: { b: '}' } },
    })
    expect(parseModelJson('{"a":[1]}}\n')).toEqual({ value: { a: [1] } })
  })

  it('returns the parse error for text without a JSON object', () => {
    const result = parseModelJson('I cannot do that.')
    expect(result.error).toBeA(String)
    expect(parseModelJson('').error).toEqual('the response is empty')
    expect(parseModelJson('{"a":').error ?? '').toMatchRegex(/JSON/)
  })

  it('says by how many braces an object is never closed', () => {
    expect(
      parseModelJson('{"fields":{"a":{"x":"{"}},"other":[]').error,
    ).toEqual(
      'Expected \',\' or \'}\' after property value in JSON at position 36 (line 1 column 37); the object is never closed, there are 1 more "{" than "}"',
    )
    expect(parseModelJson('{"a":{"b":1}').error ?? '').toMatchRegex(
      /there are 1 more "\{" than "\}"$/,
    )
  })
})
