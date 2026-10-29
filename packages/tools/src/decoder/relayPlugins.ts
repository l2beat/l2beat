import { toFunctionSelector } from 'viem'
import { BinaryReader } from './BinaryReader'
import { type DecodedValue, decodeType, sliceBytes } from './decode'

export const relayPlugins = [
  arbitrumScheduleBatchPlugin,
  arbitrumSendTxToL1Plugin,
  zkSyncSendToL1Plugin,
  taikoExecutePlugin,
  taikoMessageInvocationPlugin,
  whitebitBatchPlugin,
]

const ETHEREUM_CHAIN_ID = 1
const ZKSYNC_ERA_CHAIN_ID = 324

const SCHEDULE_BATCH_ABI =
  'function scheduleBatch(address[] targets, uint256[] values, bytes[] payloads, bytes32 predecessor, bytes32 salt, uint256 delay)'
const RETRYABLE_TICKET_MAGIC = '0xa723c008e76e379c55599d2e4d93879beafda79c'
const RETRYABLE_TICKET_TYPE =
  '(address targetInbox, address l2Target, uint256 l2Value, uint256 gasLimit, uint256 maxFeePerGas, bytes l2Calldata)'
// Ethereum inboxes stay hardcoded: historical ones must keep decoding forever.
const ARBITRUM_INBOX_CHAIN_IDS: Record<string, number> = {
  '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f': 42161,
  '0xc4448b71118c9071bcb9734a0eac55d18a153949': 42170,
}

function arbitrumScheduleBatchPlugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  const decoded = decodeCall(SCHEDULE_BATCH_ABI, data, chainId, address)
  if (!decoded) return
  const [targets, , payloads] = members(decoded)
  const targetMembers = members(targets)
  if (!payloads?.members) return decoded
  payloads.members = payloads.members.map((payload, i) => {
    const target = targetMembers[i]?.value as `0x${string}` | undefined
    if (chainId === ETHEREUM_CHAIN_ID && target === RETRYABLE_TICKET_MAGIC) {
      return decodeRetryableTicketPayload(payload, chainId)
    }
    payload.address = target
    return payload
  })
  return decoded
}

function decodeRetryableTicketPayload(
  payload: DecodedValue,
  chainId: number,
): DecodedValue {
  let ticket: DecodedValue
  try {
    ticket = decodeRetryableTicket(payload.bytes, chainId)
  } catch {
    return payload
  }
  ticket.name = payload.name
  ticket.extra ??= payload.extra
  return ticket
}

export function decodeRetryableTicket(
  bytes: `0x${string}`,
  chainId: number,
): DecodedValue {
  const ticket = decodeType(RETRYABLE_TICKET_TYPE, bytes, chainId)
  const [inbox, l2Target, , , , l2Calldata] = members(ticket)
  const l2ChainId =
    chainId === ETHEREUM_CHAIN_ID
      ? ARBITRUM_INBOX_CHAIN_IDS[inbox?.value ?? '']
      : undefined
  if (l2Target && l2Calldata) {
    l2Calldata.address = l2Target.value as `0x${string}`
    if (l2ChainId !== undefined) {
      l2Target.chainId = l2ChainId
      l2Calldata.chainId = l2ChainId
    }
  }
  return ticket
}

// Orbit L3s settle on an L2, but only L2s to Ethereum are supported for now.
function arbitrumSendTxToL1Plugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  const decoded = decodeCall(
    'function sendTxToL1(address destination, bytes calldata data)',
    data,
    chainId,
    address,
  )
  if (!decoded) return
  const [destination, calldata] = members(decoded)
  if (!destination || !calldata) return
  destination.chainId = ETHEREUM_CHAIN_ID
  calldata.chainId = ETHEREUM_CHAIN_ID
  calldata.address = destination.value as `0x${string}`
  return decoded
}

// The ZK Nation governor on Era sends upgrade proposals that the
// ProtocolUpgradeHandler executes on Ethereum.
function zkSyncSendToL1Plugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  if (chainId !== ZKSYNC_ERA_CHAIN_ID) return
  return replaceBytesArgument(
    'function sendToL1(bytes message)',
    data,
    chainId,
    address,
    (message) =>
      decodeType(
        '(((address target, uint256 value, bytes data)[] calls, address executor, bytes32 salt) proposal)',
        message.bytes,
        ETHEREUM_CHAIN_ID,
      ).members?.[0],
  )
}

const TAIKO_ACTIONS_TYPE =
  '((address target, uint256 value, bytes data)[] actions)'
const TAIKO_EXECUTION_ID_BYTES = 8

function taikoExecutePlugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  return replaceBytesArgument(
    'function execute(bytes _actions)',
    data,
    chainId,
    address,
    (actions) =>
      decodeType(TAIKO_ACTIONS_TYPE, actions.bytes, chainId).members?.[0],
  )
}

// The Taiko bridge delivers DAO proposals as
// bytes8(executionId) ++ abi.encode(Action[]), which is not a call.
function taikoMessageInvocationPlugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  return replaceBytesArgument(
    'function onMessageInvocation(bytes _data)',
    data,
    chainId,
    address,
    (payload) => {
      const executionId = sliceBytes(payload.bytes, 0, TAIKO_EXECUTION_ID_BYTES)
      const actions = decodeType(
        TAIKO_ACTIONS_TYPE,
        sliceBytes(payload.bytes, TAIKO_EXECUTION_ID_BYTES),
        chainId,
      ).members?.[0]
      if (!actions) return
      return {
        type: 'tuple',
        bytes: payload.bytes,
        value: '',
        chainId,
        members: [
          {
            type: 'number',
            name: 'executionId',
            bytes: executionId,
            value: BigInt(executionId).toString(),
            chainId,
          },
          actions,
        ],
      }
    },
  )
}

const WHITEBIT_NATIVE_TOKEN_INDEX = 255

// WhiteBIT appends a packed list of transfers to a call of batch().
function whitebitBatchPlugin(
  data: `0x${string}`,
  chainId: number,
  address?: `0x${string}`,
): DecodedValue | undefined {
  const decoded = decodeCall('function batch()', data, chainId, address)
  if (!decoded?.extra) return

  const reader = new BinaryReader(decoded.extra)
  const count = Number(reader.read(1))
  const triplets = Array.from({ length: count }, () => ({
    tokenIndex: Number(reader.read(1)),
    addressIndex: Number(reader.read(1)),
    amountIndex: Number(reader.read(1)),
  }))
  const words: `0x${string}`[] = []
  while (!reader.isAtEnd()) {
    words.push(reader.read(20))
  }

  decoded.members = triplets.map((triplet, i): DecodedValue => {
    const token = words[triplet.tokenIndex]
    const recipient = words[triplet.addressIndex]
    const amount = words[triplet.amountIndex]
    const isNative = triplet.tokenIndex === WHITEBIT_NATIVE_TOKEN_INDEX
    if ((!token && !isNative) || !recipient || !amount) {
      throw new Error('Invalid encoding')
    }
    return {
      type: 'tuple',
      name: i.toString(),
      bytes: '0x',
      value: '',
      chainId,
      members: [
        token
          ? {
              type: 'address',
              name: 'token',
              bytes: token,
              value: token,
              chainId,
            }
          : {
              type: 'string',
              name: 'token',
              bytes: '0x',
              value: 'ETH',
              chainId,
            },
        {
          type: 'address',
          name: 'recipient',
          bytes: recipient,
          value: recipient,
          chainId,
        },
        {
          type: 'number',
          name: 'amount',
          bytes: amount,
          value: BigInt(amount).toString(),
          chainId,
          token,
        },
      ],
    }
  })
  decoded.extra = undefined
  return decoded
}

const ERC20_AMOUNT_ABIS: [string, number][] = [
  ['function transfer(address, uint256)', 1],
  ['function transferFrom(address, address, uint256)', 2],
  ['function approve(address, uint256)', 1],
  ['function increaseAllowance(address, uint256)', 1],
  ['function decreaseAllowance(address, uint256)', 1],
  ['function burn(uint256)', 0],
  ['function burn(address, uint256)', 1],
  ['function burnFrom(address, uint256)', 1],
  ['function mint(uint256)', 0],
  ['function mint(address, uint256)', 1],
  ['function mintFrom(address, uint256)', 1],
]
const ERC20_AMOUNTS: Record<string, { name: string; index: number }> =
  Object.fromEntries(
    ERC20_AMOUNT_ABIS.map(([abi, index]) => [
      toFunctionSelector(abi),
      { name: abi.slice('function '.length, abi.indexOf('(')), index },
    ]),
  )

// Runs after decoding and checks the name, so a colliding non-token ABI never gets an amount.
export function markTokenAmount(value: DecodedValue) {
  if (value.type !== 'call' || !value.address) return
  const erc20 = ERC20_AMOUNTS[value.bytes.slice(0, 10).toLowerCase()]
  if (!erc20 || erc20.name !== value.functionName) return
  const amount = value.members?.[erc20.index]
  if (amount?.type === 'number') amount.token = value.address
}

function replaceBytesArgument(
  abi: string,
  data: `0x${string}`,
  chainId: number,
  address: `0x${string}` | undefined,
  decodeArgument: (argument: DecodedValue) => DecodedValue | undefined,
): DecodedValue | undefined {
  const decoded = decodeCall(abi, data, chainId, address)
  const argument = decoded?.members?.[0]
  if (!decoded || argument?.type !== 'bytes') return
  const replacement = decodeArgument(argument)
  if (!replacement) return
  replacement.name = argument.name
  decoded.members = [replacement]
  decoded.extra ??= argument.extra
  return decoded
}

function decodeCall(
  abi: string,
  data: `0x${string}`,
  chainId: number,
  address: `0x${string}` | undefined,
): DecodedValue | undefined {
  if (data.slice(0, 10).toLowerCase() !== toFunctionSelector(abi)) return
  return decodeType(abi, data, chainId, address)
}

function members(value: DecodedValue | undefined): DecodedValue[] {
  return value?.members ?? []
}
