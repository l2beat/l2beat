import { expect } from 'earl'
import { parseRelayApiKeys } from './interop'

describe(parseRelayApiKeys.name, () => {
  it('parses a single key', () => {
    expect(parseRelayApiKeys('first-key')).toEqual(['first-key'])
  })

  it('trims, drops empty entries and deduplicates', () => {
    expect(
      parseRelayApiKeys(' first-key, second-key, first-key, , second-key '),
    ).toEqual(['first-key', 'second-key'])
  })

  it('rejects an empty key list', () => {
    expect(() => parseRelayApiKeys(' , ')).toThrow(
      'Relay API key must not be empty',
    )
  })
})
