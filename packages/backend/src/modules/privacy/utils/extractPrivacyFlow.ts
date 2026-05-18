import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type {
  PrivacyFlowExtractResult,
  PrivacyFlowIndexerConfig,
  PrivacyRpcLog,
} from '../types'

const ERC20_TOKEN_TYPE = 0

const privacyPoolsInterface = new utils.Interface([
  'event Deposited(address indexed depositor, uint256 commitment, uint256 label, uint256 value, uint256 precommitmentHash)',
  'event Withdrawn(address indexed processooor, uint256 value, uint256 spentNullifier, uint256 newCommitment)',
])

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

export function extractPrivacyFlow(
  source: PrivacyFlowIndexerConfig,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  switch (source.extractor) {
    case 'fixedAmount':
      return {
        count: 1,
        amount: BigInt(source.params.amount),
      }
    case 'privacyPoolsValue':
      return extractPrivacyPoolsValue(log)
    case 'railgunShield':
      return extractRailgunShield(source, log)
    case 'railgunUnshield':
      return extractRailgunUnshield(source, log)
    default:
      return undefined
  }
}

function extractPrivacyPoolsValue(
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = privacyPoolsInterface.parseLog(log)
  const value = parsedLog.args.value

  return {
    count: 1,
    amount: BigInt(value.toString()),
  }
}

function extractRailgunShield(
  source: Extract<PrivacyFlowIndexerConfig, { extractor: 'railgunShield' }>,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = railgunInterface.parseLog(log)
  let count = 0
  let amount = 0n

  for (const commitment of parsedLog.args.commitments) {
    const token = commitment.token
    if (Number(token.tokenType) !== ERC20_TOKEN_TYPE) {
      continue
    }

    if (EthereumAddress(token.tokenAddress) !== source.params.tokenAddress) {
      continue
    }

    count += 1
    amount += BigInt(commitment.value.toString())
  }

  if (count === 0 && amount === 0n) {
    return undefined
  }

  return { count, amount }
}

function extractRailgunUnshield(
  source: Extract<PrivacyFlowIndexerConfig, { extractor: 'railgunUnshield' }>,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = railgunInterface.parseLog(log)
  const token = parsedLog.args.token

  if (Number(token.tokenType) !== ERC20_TOKEN_TYPE) {
    return undefined
  }

  if (EthereumAddress(token.tokenAddress) !== source.params.tokenAddress) {
    return undefined
  }

  return {
    count: 1,
    amount: BigInt(parsedLog.args.amount.toString()),
  }
}
