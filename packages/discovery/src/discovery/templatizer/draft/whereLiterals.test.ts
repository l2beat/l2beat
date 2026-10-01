import { expect } from 'earl'
import { utils } from 'ethers'
import { whereLiteralProblem } from './whereLiterals'

describe(whereLiteralProblem.name, () => {
  const param = (type: string, indexed = false) =>
    utils.ParamType.fromObject({ type, name: 'x', indexed })
  const lower = '0x798576400f7d662961ba15c6b3f3d813447a26a6'
  const prefixed = 'eth:0x798576400F7D662961BA15C6b3F3d813447a26a6'

  it('accepts literals spelled exactly as V1 renders the log value', () => {
    expect(whereLiteralProblem(prefixed, param('address'), 'ethereum')).toEqual(
      undefined,
    )
    expect(whereLiteralProblem(true, param('bool'), 'ethereum')).toEqual(
      undefined,
    )
    expect(whereLiteralProblem(5, param('uint256'), 'ethereum')).toEqual(
      undefined,
    )
    expect(
      whereLiteralProblem('9007199254740993', param('uint256'), 'ethereum'),
    ).toEqual(undefined)
    expect(
      whereLiteralProblem(`0x${'ab'.repeat(32)}`, param('bytes32'), 'ethereum'),
    ).toEqual(undefined)
  })

  it('names the literal that would match when the spelling never can', () => {
    expect(whereLiteralProblem(lower, param('address'), 'ethereum')).toEqual(
      `V1 compares with the log value exactly as it renders it (addresses chain-prefixed and checksummed), so write "${prefixed}"`,
    )
    expect(whereLiteralProblem('5', param('uint64'), 'ethereum')).toEqual(
      'V1 compares with the log value exactly as it renders it (integers up to 2^53 as numbers, larger ones as decimal strings), so write 5',
    )
    expect(
      whereLiteralProblem(`0x${'AB'.repeat(32)}`, param('bytes32'), 'ethereum'),
    ).toEqual(
      `V1 compares with the log value exactly as it renders it (hex in lowercase), so write "0x${'ab'.repeat(32)}"`,
    )
  })

  it('rejects mistyped literals and arguments no literal can equal', () => {
    expect(whereLiteralProblem('true', param('bool'), 'ethereum')).toEqual(
      'expected a boolean, got "true"',
    )
    expect(whereLiteralProblem(1, param('uint256[]'), 'ethereum')).toEqual(
      '"=" and "!=" compare with strict equality, which never holds for a uint256[] value; compare a scalar argument instead',
    )
    expect(whereLiteralProblem('a', param('string', true), 'ethereum')).toEqual(
      'an indexed string is logged only as its hash, so V1 cannot compare it with a literal',
    )
  })
})
