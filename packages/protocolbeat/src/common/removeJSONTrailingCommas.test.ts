import { expect } from 'earl'
import { removeJSONTrailingCommas } from './removeJSONTrailingCommas'

describe('removeJSONTrailingCommas', () => {
  it('does nothing when there are no trailing commas', () => {
    const input = '{"a":1,"b":2}'
    expect(removeJSONTrailingCommas(input)).toEqual(input)
  })

  it('removes a trailing comma in an object', () => {
    const input = '{"a":1,"b":2,}'
    expect(removeJSONTrailingCommas(input)).toEqual('{"a":1,"b":2}')
  })

  it('removes a trailing comma in an array', () => {
    const input = '[1,2,]'
    expect(removeJSONTrailingCommas(input)).toEqual('[1,2]')
  })

  it('removes nested trailing commas', () => {
    const input = '{"a":[1,2,],}'
    expect(removeJSONTrailingCommas(input)).toEqual('{"a":[1,2]}')
  })

  it('preserves commas inside string values and keys', () => {
    const input = '{"k,e,y":"v,a,l,u,e",}'
    expect(removeJSONTrailingCommas(input)).toEqual('{"k,e,y":"v,a,l,u,e"}')
  })

  it('handles escaped quotes inside strings', () => {
    const input = '{"a":"He said \\"Hello\\"",}'
    expect(removeJSONTrailingCommas(input)).toEqual(
      '{"a":"He said \\"Hello\\""}',
    )
  })

  it('preserves non-trailing commas even with whitespace', () => {
    const input = '{"a":1, "b":2 }'
    expect(removeJSONTrailingCommas(input)).toEqual(input)
  })
})
