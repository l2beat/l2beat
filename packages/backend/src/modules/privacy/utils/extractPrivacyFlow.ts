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

// Both events carry an indexed `token` and an `amount`, so a single extractor
// serves every Umbra flow. Announcement covers ERC20 deposits and doubles as the
// ETH withdrawal: sendEth forwards the value straight to the stealth address, so
// the contract never custodies ETH and emits no withdrawal event for it.
const umbraInterface = new utils.Interface([
  'event Announcement(address indexed receiver, uint256 amount, address indexed token, bytes32 pkx, bytes32 ciphertext)',
  'event TokenWithdrawal(address indexed receiver, address indexed acceptor, uint256 amount, address indexed token)',
])

const zamaInterface = new utils.Interface([
  'event Wrap(address indexed to, uint256 roundedAmount, bytes32 encryptedWrappedAmount)',
  'event UnwrapFinalized(address indexed receiver, bytes32 indexed unwrapRequestId, bytes32 encryptedAmount, uint64 cleartextAmount)',
])

const erc20Interface = new utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
])

const privacyBoostInterface = new utils.Interface([
  'event DepositRequested(uint256 indexed depositRequestId, address indexed depositor, uint16 tokenId, uint96 totalAmount, uint16 commitmentCount, uint256 commitmentsHash, uint256[] commitments, tuple(bytes32 viewingKey, bytes32 teeWrapKey, bytes32 receiverWrapKey, bytes32 ct0, bytes32 ct1, bytes16 ct2)[] ciphertexts)',
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
    case 'erc20Transfer':
      return extractErc20Transfer(source, log)
    case 'privacyBoostDeposit':
      return extractPrivacyBoostDeposit(source, log)
    case 'privacyPoolsValue':
      return extractPrivacyPoolsValue(log)
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

// The from/to filters are usually already applied server-side as topic
// filters; re-checking here keeps the extractor correct on its own.
function extractErc20Transfer(
  source: Extract<PrivacyFlowIndexerConfig, { extractor: 'erc20Transfer' }>,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = erc20Interface.parseLog(log)

  if (
    source.params.from !== undefined &&
    EthereumAddress(parsedLog.args.from) !== source.params.from
  ) {
    return undefined
  }

  if (
    source.params.to !== undefined &&
    EthereumAddress(parsedLog.args.to) !== source.params.to
  ) {
    return undefined
  }

  return {
    count: 1,
    amount: BigInt(parsedLog.args.value.toString()),
  }
}

function extractPrivacyBoostDeposit(
  source: Extract<
    PrivacyFlowIndexerConfig,
    { extractor: 'privacyBoostDeposit' }
  >,
  log: PrivacyRpcLog,
): PrivacyFlowExtractResult | undefined {
  const parsedLog = privacyBoostInterface.parseLog(log)

  if (Number(parsedLog.args.tokenId) !== source.params.tokenId) {
    return undefined
  }

  return {
    count: 1,
    amount: BigInt(parsedLog.args.totalAmount.toString()),
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

function extractUmbraAmount(
  source: Extract<PrivacyFlowIndexerConfig, { extractor: 'umbraAmount' }>,
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
  source: Extract<PrivacyFlowIndexerConfig, { extractor: 'zamaUnwrap' }>,
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
