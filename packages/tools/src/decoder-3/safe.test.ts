import { expect } from 'earl'
import { readFileSync } from 'fs'
import {
  decodeFunctionData,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { DecodedValue } from './decode'
import { decode } from './plugins'
import {
  calculateSafeHashes,
  decodeSafeTransaction,
  SAFE_ABI,
  stepSafeNonce,
} from './safe'

const batch = readFileSync(
  `${__dirname}/fixtures/safe-multicall.txt`,
  'utf8',
).trim() as Hex
const multicallAbi = parseAbi([
  'function aggregate3Value((address target, bool allowFailure, uint256 value, bytes callData)[] calls)',
])
const calls = decodeFunctionData({ abi: multicallAbi, data: batch }).args[0]
const first = calls[0]!
const second = calls[1]!
const input = {
  calldata: first.callData,
  safe: first.target,
  chainId: 1,
  version: '1.3.0',
  nonce: '65',
}

describe('Safe nonce stepping', () => {
  it('steps by one without rounding large integers', () => {
    expect(stepSafeNonce('65', 1)).toEqual('66')
    expect(stepSafeNonce('67', -1)).toEqual('66')
    expect(stepSafeNonce('9007199254740992', 1)).toEqual('9007199254740993')
    expect(stepSafeNonce('9007199254740993', -1)).toEqual('9007199254740992')
  })

  it('stops at uint256 bounds and leaves invalid inputs unchanged', () => {
    expect(stepSafeNonce('0', -1)).toEqual('0')
    const max = (2n ** 256n - 1n).toString()
    expect(stepSafeNonce(max, 1)).toEqual(max)
    for (const invalid of ['', '-1', '1.5', '1e3', (2n ** 256n).toString()]) {
      expect(stepSafeNonce(invalid, 1)).toEqual(invalid)
      expect(stepSafeNonce(invalid, -1)).toEqual(invalid)
    }
  })
})

describe('Safe hashes', () => {
  it('matches the independently verified mainnet signing data', () => {
    expect(calculateSafeHashes(input)).toEqual({
      domainHash:
        '0xdf53d510b56e539b90b369ef08fce3631020fbf921e3136ea5f8747c20bce967',
      messageHash:
        '0xca2592b0b722f9b621a72604e6b511bfd9c3cebfa97f55e11ee2f13bd45e9de6',
      signingData:
        '0x1901df53d510b56e539b90b369ef08fce3631020fbf921e3136ea5f8747c20bce967ca2592b0b722f9b621a72604e6b511bfd9c3cebfa97f55e11ee2f13bd45e9de6',
      safeTxHash:
        '0x04f02c35c694d0eca2ef985971903410082ab13cee22fe904c57624607f1d611',
    })
  })

  it('connects the second Safe transaction to the first approval', () => {
    const hashes = calculateSafeHashes({
      ...input,
      safe: second.target,
      calldata: second.callData,
      nonce: '40',
    })
    expect(hashes.safeTxHash).toEqual(
      '0xe3f44948764bcdce1fa897d8ee4078036add18b64b6f40f0c968210050916b7f',
    )
    const approvalCalls = decodeFunctionData({
      abi: multicallAbi,
      data: decodeSafeTransaction(first.callData).data,
    }).args[0]
    expect(approvalCalls[0]?.callData).toEqual(
      `0xd4d9bdcd${hashes.safeTxHash.slice(2)}`,
    )
  })

  it('finds both Safe calls and their addresses without ABI lookups', () => {
    const safes: string[] = []
    function walk(value: DecodedValue) {
      const decoded =
        value.type === 'bytes'
          ? (decode(value.bytes, [], value.chainId ?? 1, value.address) ??
            value)
          : value
      if (decoded.functionName === 'execTransaction')
        safes.push(decoded.address ?? '')
      for (const child of decoded.members ?? []) walk(child)
    }
    walk({
      type: 'bytes',
      value: batch,
      bytes: batch,
      chainId: 1,
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    })
    expect(safes).toEqual([
      first.target.toLowerCase(),
      second.target.toLowerCase(),
    ])
  })

  const transaction = decodeSafeTransaction(first.callData)
  function encode(
    overrides: Partial<typeof transaction>,
    signatures: Hex = '0x',
  ) {
    const tx = { ...transaction, ...overrides }
    return encodeFunctionData({
      abi: SAFE_ABI,
      functionName: 'execTransaction',
      args: [
        tx.to,
        tx.value,
        tx.data,
        tx.operation,
        tx.safeTxGas,
        tx.baseGas,
        tx.gasPrice,
        tx.gasToken,
        tx.refundReceiver,
        signatures,
      ],
    })
  }
  const mutations: Partial<typeof transaction>[] = [
    { to: second.target },
    { value: 1n },
    { data: '0x' },
    { operation: 0 },
    { safeTxGas: 1n },
    { baseGas: 1n },
    { gasPrice: 1n },
    { gasToken: second.target },
    { refundReceiver: second.target },
  ]
  for (const mutation of mutations) {
    it(`commits to ${Object.keys(mutation)[0]}`, () => {
      const changed = calculateSafeHashes({
        ...input,
        calldata: encode(mutation),
      })
      expect(changed.messageHash).not.toEqual(
        calculateSafeHashes(input).messageHash,
      )
      expect(changed.domainHash).toEqual(calculateSafeHashes(input).domainHash)
    })
  }

  it('commits to the nonce without losing integer precision', () => {
    const next = calculateSafeHashes({ ...input, nonce: '66' })
    expect(next.messageHash).not.toEqual(calculateSafeHashes(input).messageHash)
    expect(next.domainHash).toEqual(calculateSafeHashes(input).domainHash)
    expect(
      calculateSafeHashes({ ...input, nonce: '9007199254740992' }).messageHash,
    ).not.toEqual(
      calculateSafeHashes({ ...input, nonce: '9007199254740993' }).messageHash,
    )
  })

  it('excludes signatures from the signing hash', () => {
    expect(
      calculateSafeHashes({ ...input, calldata: encode({}, '0x1234') }),
    ).toEqual(calculateSafeHashes(input))
  })

  it('binds modern domains to the Safe and chain', () => {
    for (const change of [{ safe: second.target }, { chainId: 10 }]) {
      const changed = calculateSafeHashes({ ...input, ...change })
      expect(changed.domainHash).not.toEqual(
        calculateSafeHashes(input).domainHash,
      )
      expect(changed.messageHash).toEqual(
        calculateSafeHashes(input).messageHash,
      )
    }
  })

  it('handles the legacy domain explicitly', () => {
    const legacy = calculateSafeHashes({ ...input, version: '1.1.1' })
    expect(legacy.domainHash).toEqual(
      '0x862c3249c06a49a308ede93410c6d557d7818172b281d482476b8a1cb4dbec0b',
    )
    expect(
      calculateSafeHashes({ ...input, version: '1.2.0', chainId: 10 }),
    ).toEqual(legacy)
  })

  it('rejects unknown versions, chains, invalid nonces and calldata', () => {
    for (const change of [
      { version: '9.0.0' },
      { chainId: 0 },
      { nonce: '' },
      { nonce: '-1' },
      { nonce: '1.1' },
      { nonce: (2n ** 256n).toString() },
      { calldata: '0x6a761202' as Hex },
      { calldata: batch },
      { calldata: encode({ operation: 2 }) },
    ]) {
      expect(() => calculateSafeHashes({ ...input, ...change })).toThrow()
    }
  })
})
