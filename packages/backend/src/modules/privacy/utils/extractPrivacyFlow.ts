import type {
  PrivacyFlowExtractorConfig,
  PrivacyFlowSource,
} from '@l2beat/config'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyFlowExtractResult, PrivacyRpcLog } from '../types'
import { extractPrivacyPoolsEvent } from './extractPrivacyPoolsEvent'

const ERC20_TOKEN_TYPE = 0

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

// Both events carry an indexed `token` and an `amount`, so a single extractor
// serves every Umbra flow. Announcement covers ERC20 deposits and doubles as the
// ETH withdrawal: sendEth forwards the value straight to the stealth address, so
// the contract never custodies ETH and emits no withdrawal event for it.
const umbraInterface = new utils.Interface([
  'event Announcement(address indexed receiver, uint256 amount, address indexed token, bytes32 pkx, bytes32 ciphertext)',
  'event TokenWithdrawal(address indexed receiver, address indexed acceptor, uint256 amount, address indexed token)',
])

const erc20Interface = new utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
])

const zamaInterface = new utils.Interface([
  'event Wrap(address indexed to, uint256 roundedAmount, bytes32 encryptedWrappedAmount)',
  'event UnwrapFinalized(address indexed receiver, bytes32 indexed unwrapRequestId, bytes32 encryptedAmount, uint64 cleartextAmount)',
])

export function extractPrivacyFlow<T extends PrivacyFlowSource>(
  source: T,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  switch (source.extractor) {
    case 'fixedAmount':
      return {
        count: 1,
        amount: BigInt(source.params.amount),
      }
    case 'erc20Transfer':
      return extractErc20Transfer(source, log)
    case 'privacyPoolsValue':
      return {
        count: 1,
        amount: extractPrivacyPoolsEvent(log).amount,
      }
    case 'railgunShield':
      return extractRailgunShield(source, log)
    case 'railgunUnshield':
      return extractRailgunUnshield(source, log)
    case 'umbraAmount':
      return extractUmbraAmount(source, log)
    case 'zamaWrap':
      return extractZamaWrap(log)
    case 'zamaUnwrap':
      return extractZamaUnwrap(source, log)
    default:
      return undefined
  }
}

// Zero-value and self transfers move nothing across the pool boundary, so
// they do not count as flows.
function extractErc20Transfer(
  source: Extract<PrivacyFlowExtractorConfig, { extractor: 'erc20Transfer' }>,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = erc20Interface.parseLog(log)
  const from = EthereumAddress(parsedLog.args.from)
  const to = EthereumAddress(parsedLog.args.to)

  // The query already filters on these topics; re-checking guards against a
  // log source that does not honour positional topic filters.
  if (source.params.from !== undefined && from !== source.params.from) {
    return undefined
  }
  if (source.params.to !== undefined && to !== source.params.to) {
    return undefined
  }

  const amount = BigInt(parsedLog.args.value.toString())
  if (amount === 0n || from === to) {
    return undefined
  }

  return { count: 1, amount }
}

function extractRailgunShield(
  source: Extract<PrivacyFlowExtractorConfig, { extractor: 'railgunShield' }>,
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
  source: Extract<PrivacyFlowExtractorConfig, { extractor: 'railgunUnshield' }>,
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

function extractUmbraAmount(
  source: Extract<PrivacyFlowExtractorConfig, { extractor: 'umbraAmount' }>,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = umbraInterface.parseLog(log)

  if (EthereumAddress(parsedLog.args.token) !== source.params.tokenAddress) {
    return undefined
  }

  return {
    count: 1,
    amount: BigInt(parsedLog.args.amount.toString()),
  }
}

function extractZamaWrap(log: PrivacyRpcLog): PrivacyFlowExtractResult {
  const parsedLog = zamaInterface.parseLog(log)

  return {
    count: 1,
    amount: BigInt(parsedLog.args.roundedAmount.toString()),
  }
}

function extractZamaUnwrap(
  source: Extract<PrivacyFlowExtractorConfig, { extractor: 'zamaUnwrap' }>,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult {
  const parsedLog = zamaInterface.parseLog(log)

  return {
    count: 1,
    amount:
      BigInt(parsedLog.args.cleartextAmount.toString()) *
      BigInt(source.params.rate),
  }
}
