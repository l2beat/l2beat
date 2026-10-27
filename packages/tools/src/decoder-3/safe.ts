import {
  type Address,
  concatHex,
  decodeFunctionData,
  type Hex,
  hashStruct,
  keccak256,
  parseAbi,
} from 'viem'
import { type DecodedValue, sliceBytes } from './decode'

export const SAFE_EXEC_ABI =
  'function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures)'
export const SAFE_ABI = parseAbi([SAFE_EXEC_ABI])

const SAFE_TX_TYPES = {
  SafeTx: [
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'operation', type: 'uint8' },
    { name: 'safeTxGas', type: 'uint256' },
    { name: 'baseGas', type: 'uint256' },
    { name: 'gasPrice', type: 'uint256' },
    { name: 'gasToken', type: 'address' },
    { name: 'refundReceiver', type: 'address' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const

export function decodeSafeTransaction(data: Hex) {
  const { args } = decodeFunctionData({ abi: SAFE_ABI, data })
  const [
    to,
    value,
    callData,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
  ] = args
  if (operation !== 0 && operation !== 1) {
    throw new Error('Invalid Safe operation')
  }
  return {
    to,
    value,
    data: callData,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
  }
}

// Splits signatures the way Safe's checkNSignatures reads them: 65-byte
// {r, s, v} entries, with contract signature data appended after them.
export function decodeSafeSignatures(
  signatures: Hex,
  chainId?: number,
): DecodedValue | undefined {
  const length = (signatures.length - 2) / 2
  if (!Number.isInteger(length) || length === 0) return
  const common: Pick<DecodedValue, 'chainId'> = {}
  if (chainId !== undefined) common.chainId = chainId

  const entries: DecodedValue[] = []
  let staticEnd = length
  for (let start = 0; start + 65 <= staticEnd; start += 65) {
    const r = sliceBytes(signatures, start, start + 32)
    const s = sliceBytes(signatures, start + 32, start + 64)
    const vBytes = sliceBytes(signatures, start + 64, start + 65)
    const v = Number(vBytes)
    const word = (name: string, bytes: Hex): DecodedValue => ({
      ...common,
      name,
      type: 'bytes',
      value: bytes,
      bytes,
      opaque: true,
    })
    const ecdsa = [
      {
        ...common,
        name: 'v',
        type: 'number',
        value: v.toString(),
        bytes: vBytes,
      },
      word('r', r),
      word('s', s),
    ] satisfies DecodedValue[]

    let members: DecodedValue[]
    let note: DecodedValue['note']
    if (v === 0 || v === 1) {
      if (!/^0x0{24}/.test(r)) return
      const signer: Hex = `0x${r.slice(26)}`
      members = [
        {
          ...common,
          name: 'signer',
          type: 'address',
          value: signer,
          bytes: signer,
        },
      ]
      if (v === 1) {
        note = {
          text: 'pre-validated: the signer sends this call or approved the hash onchain',
        }
      } else {
        const offset = BigInt(s)
        if (offset < start + 65 || offset + 32n > BigInt(length)) return
        const dataStart = Number(offset) + 32
        const dataLength = BigInt(
          sliceBytes(signatures, Number(offset), dataStart),
        )
        if (BigInt(dataStart) + dataLength > BigInt(length)) return
        members.push(
          word(
            'data',
            sliceBytes(signatures, dataStart, dataStart + Number(dataLength)),
          ),
        )
        note = { text: 'contract signature (EIP-1271), checked by the signer' }
        staticEnd = Math.min(staticEnd, Number(offset))
      }
    } else if (v === 27 || v === 28) {
      members = ecdsa
      note = { text: 'ECDSA signature' }
    } else if (v === 31 || v === 32) {
      members = ecdsa
      note = { text: 'eth_sign signature' }
    } else {
      members = ecdsa
      note = { text: 'unknown signature type', warning: true }
    }
    entries.push({
      ...common,
      name: entries.length.toString(),
      type: 'tuple',
      value: '',
      bytes: sliceBytes(signatures, start, start + 65),
      members,
      note,
    })
  }
  if (entries.length * 65 !== staticEnd) return

  return {
    ...common,
    type: 'array',
    value: '',
    bytes: signatures,
    members: entries,
    note: {
      text: `${entries.length} signature${entries.length === 1 ? '' : 's'}`,
    },
  }
}

export function calculateSafeHashes(input: {
  calldata: Hex
  safe: Address
  chainId: number
  version: string
  nonce: string
}) {
  if (!Number.isSafeInteger(input.chainId) || input.chainId <= 0) {
    throw new Error('Select a known chain to calculate Safe hashes.')
  }
  if (
    !/^(0|[1-9][0-9]*)$/.test(input.nonce) ||
    BigInt(input.nonce) >= 2n ** 256n
  ) {
    throw new Error('Enter a valid uint256 Safe nonce.')
  }
  // These releases use the same SafeTx schema. Older releases omit chainId.
  const legacy = ['1.1.1', '1.2.0'].includes(input.version)
  if (!legacy && !['1.3.0', '1.4.1'].includes(input.version)) {
    throw new Error(`Safe version ${input.version} is not supported.`)
  }
  const domainHash = hashStruct({
    primaryType: 'EIP712Domain',
    types: {
      EIP712Domain: [
        ...(!legacy ? [{ name: 'chainId', type: 'uint256' }] : []),
        { name: 'verifyingContract', type: 'address' },
      ],
    },
    data: {
      ...(!legacy ? { chainId: BigInt(input.chainId) } : {}),
      verifyingContract: input.safe,
    },
  })
  const messageHash = hashStruct({
    primaryType: 'SafeTx',
    types: SAFE_TX_TYPES,
    data: {
      ...decodeSafeTransaction(input.calldata),
      nonce: BigInt(input.nonce),
    },
  })
  const signingData = concatHex(['0x1901', domainHash, messageHash])
  return {
    domainHash,
    messageHash,
    signingData,
    safeTxHash: keccak256(signingData),
  }
}

export const EXPECTED_HASH_NONCE_RANGE = 100n

export interface ExpectedHashMatch {
  hash: Hex
  kind?: 'domain hash' | 'message hash' | 'Safe transaction hash'
  nonce?: string
}

// Task instructions pin nonces that may differ from the onchain nonce, so a
// pasted hash is matched against nonces around the selected one too.
export function matchExpectedHashes(
  input: Parameters<typeof calculateSafeHashes>[0],
  expected: Hex[],
): { matches: ExpectedHashMatch[]; from: string; to: string } {
  const selected = calculateSafeHashes(input)
  const nonce = BigInt(input.nonce)
  const from =
    nonce > EXPECTED_HASH_NONCE_RANGE ? nonce - EXPECTED_HASH_NONCE_RANGE : 0n
  const max = 2n ** 256n - 1n
  const to =
    nonce < max - EXPECTED_HASH_NONCE_RANGE
      ? nonce + EXPECTED_HASH_NONCE_RANGE
      : max
  const wanted = new Set(expected.map((hash) => hash.toLowerCase()))
  const found = new Map<string, ExpectedHashMatch>()
  const record = (match: ExpectedHashMatch) => {
    const hash = match.hash.toLowerCase()
    if (wanted.has(hash) && !found.has(hash)) found.set(hash, match)
  }

  record({ hash: selected.domainHash, kind: 'domain hash' })
  const candidates = [nonce]
  for (let candidate = from; candidate <= to; candidate++) {
    if (candidate !== nonce) candidates.push(candidate)
  }
  for (const candidate of candidates) {
    if (found.size === wanted.size) break
    const hashes =
      candidate === nonce
        ? selected
        : calculateSafeHashes({ ...input, nonce: candidate.toString() })
    const nonceString = candidate.toString()
    record({
      hash: hashes.messageHash,
      kind: 'message hash',
      nonce: nonceString,
    })
    record({
      hash: hashes.safeTxHash,
      kind: 'Safe transaction hash',
      nonce: nonceString,
    })
  }

  return {
    matches: [...wanted].map(
      (hash) => found.get(hash) ?? { hash: hash as Hex },
    ),
    from: from.toString(),
    to: to.toString(),
  }
}

export function calculateNearbySafeHashes(
  input: Parameters<typeof calculateSafeHashes>[0],
) {
  // Validate the selected transaction before trying any other nonce.
  calculateSafeHashes(input)
  const selected = BigInt(input.nonce)
  const candidates: { nonce: string; hash: Hex }[] = []
  for (let offset = -5n; offset <= 5n; offset++) {
    const nonce = selected + offset
    if (offset === 0n || nonce < 0n || nonce >= 2n ** 256n) continue
    const candidate = { ...input, nonce: nonce.toString() }
    candidates.push({
      nonce: candidate.nonce,
      hash: calculateSafeHashes(candidate).safeTxHash,
    })
  }
  return candidates
}
