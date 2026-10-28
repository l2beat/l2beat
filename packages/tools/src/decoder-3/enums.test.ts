import { expect } from 'earl'
import { readFileSync } from 'fs'
import {
  encodeAbiParameters,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { DecodedValue } from './decode'
import { decode } from './plugins'
import { compareState, getStateReads } from './stateDiff'

const VAULT = '0x420000000000000000000000000000000000001b'
const SIGNATURE = 'function setWithdrawalNetwork(uint8 _newWithdrawalNetwork)'
const ABI = parseAbi([SIGNATURE])
// Signatures come keyed by selector, as in the decoder's store.
const signaturesFor = (data: Hex) =>
  data.toLowerCase().startsWith('0x307f2962') ? [SIGNATURE] : []

function setWithdrawalNetwork(network: number) {
  const data = encodeFunctionData({
    abi: ABI,
    functionName: 'setWithdrawalNetwork',
    args: [network],
  })
  return decode(data, signaturesFor(data), 130, VAULT)
}

describe('known enums', () => {
  it('names the withdrawal network in the 080 fee vault deposits', () => {
    const data = readFileSync(
      `${__dirname}/fixtures/unichain-operator-fee-vault.txt`,
      'utf8',
    ).trim() as Hex
    const notes: string[] = []
    function walk(value: DecodedValue) {
      const decoded =
        value.type === 'bytes'
          ? (decode(
              value.bytes,
              signaturesFor(value.bytes),
              value.chainId ?? 1,
              value.address,
            ) ?? value)
          : value
      if (
        decoded.type === 'call' &&
        decoded.functionName === 'setWithdrawalNetwork'
      ) {
        notes.push(decoded.members?.[0]?.note?.text ?? '')
      }
      for (const member of decoded.members ?? []) walk(member)
    }
    walk({
      type: 'bytes',
      bytes: data,
      value: data,
      chainId: 1,
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    })
    expect(notes).toEqual(['L1 (Types.WithdrawalNetwork)'])
  })

  it('warns about values outside the enum', () => {
    expect(setWithdrawalNetwork(1)?.members?.[0]?.note).toEqual({
      text: 'L2 (Types.WithdrawalNetwork)',
    })
    expect(setWithdrawalNetwork(2)?.members?.[0]?.note).toEqual({
      text: 'not a Types.WithdrawalNetwork value',
      warning: true,
    })
  })

  it('names the current value read from the getter', () => {
    const call = setWithdrawalNetwork(0)!
    const [read] =
      getStateReads(call, {
        abi: ['function withdrawalNetwork() view returns (uint8)'],
      }) ?? []
    const [change] = compareState(
      read!,
      encodeAbiParameters([{ type: 'uint8' }], [1]),
    )
    expect(change?.current?.note).toEqual({
      text: 'L2 (Types.WithdrawalNetwork)',
    })
    expect(change?.next.note).toEqual({ text: 'L1 (Types.WithdrawalNetwork)' })
    expect(change?.changed).toEqual(true)
  })
})
