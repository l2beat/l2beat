import { expect } from 'earl'
import { readFileSync } from 'fs'
import {
  decodeFunctionData,
  encodeFunctionData,
  type Hex,
  parseAbi,
} from 'viem'
import type { DecodedValue } from './decode'
import { findKnownHashes } from './knownHashes'
import { decode } from './plugins'
import {
  calculateNearbySafeHashes,
  calculateSafeHashes,
  decodeSafeSignatures,
  decodeSafeTransaction,
  matchExpectedHashes,
  SAFE_ABI,
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

describe('Safe hashes', () => {
  it('finds nonce 11 for the queued Unichain deposit without changing nonce 10', () => {
    const data = readFileSync(
      `${__dirname}/fixtures/safe-queued-multicall.txt`,
      'utf8',
    ).trim() as Hex
    const calls = decodeFunctionData({ abi: multicallAbi, data }).args[0]
    expect(
      encodeFunctionData({
        abi: multicallAbi,
        functionName: 'aggregate3Value',
        args: [calls],
      }),
    ).toEqual(data)
    const approval = decodeFunctionData({
      abi: multicallAbi,
      data: decodeSafeTransaction(calls[0]!.callData).data,
    }).args[0][0]!
    const approvedHash = decodeFunctionData({
      abi: parseAbi(['function approveHash(bytes32 hashToApprove)']),
      data: approval.callData,
    }).args[0]
    expect(approvedHash).toEqual(
      '0x586752c373176aa3d4cc2b7aee615069cdbcdd5e2a29a572170c2e603a21f2af',
    )
    const queued = {
      ...input,
      calldata: calls[1]!.callData,
      safe: calls[1]!.target,
      version: '1.4.1',
      nonce: '10',
    }
    const selected = calculateSafeHashes(queued)
    expect(selected.safeTxHash).toEqual(
      '0xb43842079de7d95b5e12cc10ec6a00ae289ba60eabcbc3d4e1ebb57e7f982bcc',
    )
    const entry = {
      id: 'queued',
      hash: selected.safeTxHash,
      address: queued.safe,
      chainId: 1,
      nonce: queued.nonce,
      path: 'transaction.calls[1].callData',
      anchor: 'queued',
      nearbyHashes: calculateNearbySafeHashes(queued),
    }
    const matches = findKnownHashes([entry], approvedHash, 1)
    expect(matches.length).toEqual(1)
    expect(matches[0]?.matchedNonce).toEqual('11')
    expect(matches[0]?.nonce).toEqual('10')
    expect(findKnownHashes([entry], approvedHash, 10)).toEqual([])
    const exact = {
      ...entry,
      nonce: '11',
      hash: approvedHash,
      nearbyHashes: calculateNearbySafeHashes({ ...queued, nonce: '11' }),
    }
    expect(findKnownHashes([exact], approvedHash, 1)).toEqual([exact])
  })

  it('searches only five nonces on each side of the selected nonce', () => {
    const expected = calculateSafeHashes(input).safeTxHash
    expect(
      calculateNearbySafeHashes({ ...input, nonce: '60' }).find(
        (x) => x.hash === expected,
      )?.nonce,
    ).toEqual('65')
    expect(
      calculateNearbySafeHashes({ ...input, nonce: '70' }).find(
        (x) => x.hash === expected,
      )?.nonce,
    ).toEqual('65')
    expect(
      calculateNearbySafeHashes({ ...input, nonce: '59' }).some(
        (x) => x.hash === expected,
      ),
    ).toEqual(false)
    expect(calculateNearbySafeHashes(input).map((x) => x.nonce)).toEqual([
      '60',
      '61',
      '62',
      '63',
      '64',
      '66',
      '67',
      '68',
      '69',
      '70',
    ])
  })

  it('bounds nearby nonces to uint256 and preserves large integer precision', () => {
    expect(
      calculateNearbySafeHashes({ ...input, nonce: '0' }).map((x) => x.nonce),
    ).toEqual(['1', '2', '3', '4', '5'])
    const max = 2n ** 256n - 1n
    expect(
      calculateNearbySafeHashes({ ...input, nonce: max.toString() }).map(
        (x) => x.nonce,
      ),
    ).toEqual([5n, 4n, 3n, 2n, 1n].map((offset) => (max - offset).toString()))
    expect(
      calculateNearbySafeHashes({ ...input, nonce: '9007199254740992' }).some(
        (x) => x.nonce === '9007199254740993',
      ),
    ).toEqual(true)
    expect(() => calculateNearbySafeHashes({ ...input, nonce: '' })).toThrow()
  })

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

describe(decodeSafeSignatures.name, () => {
  const owner = '0xc2819dc788505aac350142a7a707bf9d03e3bd03'
  const word = (value: bigint) => value.toString(16).padStart(64, '0')
  const approval = `${word(BigInt(owner))}${word(0n)}01`

  it('labels the operation and splits signatures in execTransaction', () => {
    const tx = decodeSafeTransaction(first.callData)
    const calldata = encodeFunctionData({
      abi: SAFE_ABI,
      functionName: 'execTransaction',
      args: [
        tx.to,
        tx.value,
        tx.data,
        1,
        tx.safeTxGas,
        tx.baseGas,
        tx.gasPrice,
        tx.gasToken,
        tx.refundReceiver,
        `0x${approval}`,
      ],
    })
    const decoded = decode(calldata, [], 1, first.target)
    const operation = decoded?.members?.find((x) => x.name === 'operation')
    expect(operation?.note).toEqual({ text: 'delegatecall', warning: true })
    const signatures = decoded?.members?.find((x) => x.name === 'signatures')
    expect(signatures?.type).toEqual('array')
    expect(signatures?.members?.[0]?.note?.text).toEqual(
      'pre-validated: the signer sends this call or approved the hash onchain',
    )
    expect(signatures?.members?.[0]?.members?.[0]?.value).toEqual(owner)
  })

  it('reads ECDSA, eth_sign and contract signatures', () => {
    const r = word(1n)
    const s = word(2n)
    const contractData = 'abcd'
    const signatures: Hex = `0x${r}${s}1b${r}${s}1f${word(BigInt(owner))}${word(195n)}00${word(2n)}${contractData}`
    const decoded = decodeSafeSignatures(signatures, 1)

    expect(decoded?.members?.map((x) => x.note?.text)).toEqual([
      'ECDSA signature',
      'eth_sign signature',
      'contract signature (EIP-1271), checked by the signer',
    ])
    expect(decoded?.members?.[0]?.members?.[0]?.value).toEqual('27')
    expect(decoded?.members?.[0]?.members?.[1]?.opaque).toEqual(true)
    expect(decoded?.members?.[2]?.members?.map((x) => x.value)).toEqual([
      owner,
      `0x${contractData}`,
    ])
  })

  it('leaves bytes that are not Safe signatures undecoded', () => {
    expect(decodeSafeSignatures('0x')).toEqual(undefined)
    expect(decodeSafeSignatures('0x1234')).toEqual(undefined)
    expect(decodeSafeSignatures(`0x${approval}00`)).toEqual(undefined)
    // A pre-validated signature whose r is not an address.
    expect(decodeSafeSignatures(`0x${word(2n ** 255n)}${word(0n)}01`)).toEqual(
      undefined,
    )
    // A contract signature whose data points past the end.
    expect(
      decodeSafeSignatures(`0x${word(BigInt(owner))}${word(65n)}00`),
    ).toEqual(undefined)
  })
})

describe(matchExpectedHashes.name, () => {
  const data = readFileSync(
    `${__dirname}/fixtures/unichain-proposer-rotation.txt`,
    'utf8',
  ).trim() as Hex
  const council = decodeFunctionData({ abi: multicallAbi, data }).args[0][0]!
  const councilInput = {
    calldata: council.callData,
    safe: council.target,
    chainId: 1,
    version: '1.3.0',
    nonce: '71',
  }
  // From the task's VALIDATION.md.
  const domain =
    '0xdf53d510b56e539b90b369ef08fce3631020fbf921e3136ea5f8747c20bce967'
  const message =
    '0xd1ca01c6a00f0dc65b492552ee6de24afc78285209cd2d70532b040c3a297d3f'

  it('matches the task hashes at the selected nonce', () => {
    expect(
      matchExpectedHashes(councilInput, [domain, message]).matches,
    ).toEqual([
      { hash: domain, kind: 'domain hash' },
      { hash: message, kind: 'message hash', nonce: '71' },
    ])
  })

  it('finds the pinned nonce when the selected nonce differs', () => {
    const result = matchExpectedHashes({ ...councilInput, nonce: '68' }, [
      message.toUpperCase().replace('0X', '0x') as Hex,
    ])
    expect(result.matches).toEqual([
      { hash: message, kind: 'message hash', nonce: '71' },
    ])
    expect(result.from).toEqual('0')
    expect(result.to).toEqual('168')
  })

  it('reports hashes that match nothing', () => {
    const other =
      '0xa4a9c312badf3fcaa05eafe5dc9bee8bd9316c78ee8b0bebe3115bb21b732672'
    expect(matchExpectedHashes(councilInput, [other]).matches).toEqual([
      { hash: other },
    ])
  })
})
