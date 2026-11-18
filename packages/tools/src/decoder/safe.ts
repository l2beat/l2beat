import {
  type Address,
  concatHex,
  decodeFunctionData,
  type Hex,
  hashStruct,
  keccak256,
  parseAbi,
} from 'viem'

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
