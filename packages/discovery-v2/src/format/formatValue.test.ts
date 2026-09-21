import {
  asStructured,
  prefixAddresses,
  toContractValue,
} from '@l2beat/discovery'
import { expect } from 'earl'
import { BigNumber, utils } from 'ethers'
import { formatCallResult, formatLogArgs, formatValue } from './formatValue'

/**
 * Runs representative decoded values through V2's formatter and through
 * V1's functions composed by hand, and asserts equality. This is the whole
 * point of the module: if the two ever diverge, benchmark diffs become noise.
 */
describe('format', () => {
  const chain = 'ethereum'
  const address = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
  const checksummed = 'eth:0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'

  it('formats scalars, big integers and address arrays exactly like toContractValue then prefixAddresses', () => {
    const samples: unknown[] = [
      BigNumber.from(7),
      BigNumber.from(
        '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      ),
      BigNumber.from('9007199254740992'),
      BigNumber.from(-5),
      address,
      [address, address.toUpperCase().replace('0X', '0x')],
      true,
      'hello',
      `0x${'ab'.repeat(32)}`,
    ]
    for (const sample of samples) {
      expect(formatValue(chain, sample)).toEqual(
        prefixAddresses(chain, toContractValue(sample)),
      )
    }
    expect(formatValue(chain, BigNumber.from('9007199254740992'))).toEqual(
      '9007199254740992',
    )
    expect(formatValue(chain, [address])).toEqual([checksummed])
  })

  it('turns a named tuple output into an object through asStructured, after prefixing', () => {
    const fragment = utils.Fragment.from(
      'function getConfig() view returns (tuple(address admin, uint256 delay) config)',
    ) as utils.FunctionFragment
    const decoded = new utils.Interface([fragment]).decodeFunctionResult(
      fragment,
      utils.defaultAbiCoder.encode(
        ['tuple(address,uint256)'],
        [[address, 86400]],
      ),
    )[0]
    const expected = asStructured(
      prefixAddresses(chain, toContractValue(decoded)),
      fragment.outputs,
    )
    expect(formatCallResult(chain, decoded, fragment)).toEqual(expected)
    expect(formatCallResult(chain, decoded, fragment)).toEqual({
      admin: checksummed,
      delay: 86400,
    })
  })

  it('keeps multi-output results positional when outputs are unnamed, as V1 does', () => {
    const fragment = utils.Fragment.from(
      'function pair() view returns (address, uint256)',
    ) as utils.FunctionFragment
    const decoded = new utils.Interface([fragment]).decodeFunctionResult(
      fragment,
      utils.defaultAbiCoder.encode(['address', 'uint256'], [address, 1]),
    )
    expect(formatCallResult(chain, decoded, fragment)).toEqual([checksummed, 1])
  })

  it('keys log arguments by name, with _<index> for unnamed ones', () => {
    const fragment = utils.Fragment.from(
      'event Anon(address, uint256 indexed amount)',
    ) as utils.EventFragment
    const coder = new utils.Interface([fragment])
    const { topics, data } = coder.encodeEventLog(fragment, [address, 12])
    const parsed = coder.parseLog({ topics, data })
    expect(formatLogArgs(chain, parsed.args, fragment)).toEqual({
      _0: checksummed,
      amount: 12,
    })
  })
})
