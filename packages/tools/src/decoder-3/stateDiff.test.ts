import { expect } from 'earl'
import {
  encodeAbiParameters,
  encodeFunctionData,
  type Hex,
  parseAbi,
  toFunctionSelector,
} from 'viem'
import { decodeType } from './decode'
import { decode } from './plugins'
import { compareState, getStateReads } from './stateDiff'

const FACTORY = '0x2f12d621a16e2d3285929c9996f478508951dfe4'
const IMPL = '0x5c3eb47cb0174aea522a2a9ae79487139a53d691'
const ASR = '27cf508e4e3aa8d30b3226ac3b5ea0e8bcacaff9'
const OLD_PROPOSER = 'd5f0e2912c70771c589cd8bb087ede0dab4afa9a'
const NEW_PROPOSER = '86b392ca30ad7453c8d88b56eb5a04fd0e2175b7'
const ABI = parseAbi([
  'function setImplementation(uint32 _gameType, address _impl, bytes _args)',
  'function setInitBond(uint32 _gameType, uint256 _initBond)',
])

function setImplementation(args: Hex) {
  const call = decode(
    encodeFunctionData({
      abi: ABI,
      functionName: 'setImplementation',
      args: [5, IMPL, args],
    }),
    [],
    1,
    FACTORY,
  )
  if (!call) throw new Error('Cannot decode')
  return call
}

const address = (value: string) =>
  encodeAbiParameters([{ type: 'address' }], [`0x${value}`])
const bytes = (value: Hex) => encodeAbiParameters([{ type: 'bytes' }], [value])

describe(getStateReads.name, () => {
  it('reads the getters of setImplementation', () => {
    const reads = getStateReads(setImplementation(`0x${ASR}${NEW_PROPOSER}`))
    expect(reads?.map((read) => [read.label, read.data])).toEqual([
      [
        'gameImpls(5)',
        '0x1b685b9e0000000000000000000000000000000000000000000000000000000000000005',
      ],
      [
        'gameArgs(5)',
        '0x74cc86ac0000000000000000000000000000000000000000000000000000000000000005',
      ],
    ])
  })

  it('works without argument names', () => {
    const call = decodeType(
      'function setInitBond(uint32,uint256)',
      encodeFunctionData({
        abi: ABI,
        functionName: 'setInitBond',
        args: [5, 10n],
      }),
      1,
      FACTORY,
    )
    const [read] = getStateReads(call) ?? []
    expect(read?.label).toEqual('initBonds(5)')
    expect(
      compareState(read!, encodeAbiParameters([{ type: 'uint256' }], [10n])),
    ).toEqual([
      {
        label: 'initBonds(5)',
        current: {
          type: 'number',
          value: '10',
          bytes: encodeAbiParameters([{ type: 'uint256' }], [10n]),
          chainId: 1,
        },
        next: call.members![1]!,
        changed: false,
      },
    ])
  })

  it('ignores other calls', () => {
    const call = decodeType('function owner()', '0x8da5cb5b', 1, FACTORY)
    expect(getStateReads(call)).toEqual(undefined)
  })
})

describe(compareState.name, () => {
  const call = setImplementation(`0x${ASR}${NEW_PROPOSER}`)
  const [implRead, argsRead] = getStateReads(call)!

  it('compares each game args field with the current one', () => {
    expect(
      compareState(implRead!, address(IMPL.slice(2))).map((x) => x.changed),
    ).toEqual([false])
    const changes = compareState(argsRead!, bytes(`0x${ASR}${OLD_PROPOSER}`))
    expect(
      changes.map(({ label, current, next, changed }) => ({
        label,
        current: current?.value,
        next: next.value,
        changed,
      })),
    ).toEqual([
      {
        label: 'gameArgs(5).anchorStateRegistry',
        current: `0x${ASR}`,
        next: `0x${ASR}`,
        changed: false,
      },
      {
        label: 'gameArgs(5).proposer',
        current: `0x${OLD_PROPOSER}`,
        next: `0x${NEW_PROPOSER}`,
        changed: true,
      },
    ])
  })

  it('compares whole args when the layout changes', () => {
    const previous: Hex = `0x${'00'.repeat(124)}`
    const changes = compareState(argsRead!, bytes(previous))
    expect(changes.length).toEqual(1)
    expect(changes[0]?.label).toEqual('gameArgs(5)')
    expect(changes[0]?.current?.bytes).toEqual(previous)
    expect(changes[0]?.changed).toEqual(true)
  })

  it('compares with unset args', () => {
    const changes = compareState(argsRead!, bytes('0x'))
    expect(changes.map((x) => [x.label, x.current?.bytes, x.changed])).toEqual([
      ['gameArgs(5)', '0x', true],
    ])
  })

  it('marks reverted getters as unknown', () => {
    expect(compareState(argsRead!, null)).toEqual([
      { label: 'gameArgs(5)', next: argsRead!.next },
    ])
  })
})

describe('state reads from the target ABI', () => {
  const SIGNATURES = [
    'function acceptOwnership()',
    'function transferOwnership(address newOwner)',
    'function updateL1Recipient(address newRecipient)',
    'function updateMinWithdrawalAmount(uint256 newAmount)',
    'function setFeeDisbursementInterval(uint48 newInterval)',
  ]
  const ABI = parseAbi(SIGNATURES)
  const SPLITTER_ABI = [
    'function owner() view returns (address)',
    'function pendingOwner() view returns (address)',
    'function l1Recipient() view returns (address)',
    'function minWithdrawalAmount() view returns (uint256)',
    'function feeDisbursementInterval() view returns (uint48)',
  ]
  const SPLITTER = '0x4300c0d3c0d3c0d3c0d3c0d3c0d3c0d3c0d30003'
  const SENDER = '0x6b1bae59d09fccbddb6c6cceb07b7279367c4e3b'

  function call(data: Hex) {
    // Signatures come keyed by selector, as in the decoder's store.
    const signatures = SIGNATURES.filter(
      (signature) => toFunctionSelector(signature) === data.slice(0, 10),
    )
    const decoded = decode(data, signatures, 130, SPLITTER)
    if (!decoded) throw new Error('Cannot decode')
    return decoded
  }
  const encode = (...args: Parameters<typeof encodeFunctionData<typeof ABI>>) =>
    encodeFunctionData(...args)

  it('reads the getter named after a setter', () => {
    const update = call(
      encode({
        abi: ABI,
        functionName: 'updateL1Recipient',
        args: [`0x${NEW_PROPOSER}`],
      }),
    )
    const [read] = getStateReads(update, { abi: SPLITTER_ABI }) ?? []
    expect(read?.label).toEqual('l1Recipient()')
    expect(read?.data).toEqual('0x7c01a0f8')
    expect(
      compareState(read!, address(OLD_PROPOSER)).map((x) => [
        x.current?.value,
        x.changed,
      ]),
    ).toEqual([[`0x${OLD_PROPOSER}`, true]])

    const amount = call(
      encode({
        abi: ABI,
        functionName: 'updateMinWithdrawalAmount',
        args: [150000000000000000n],
      }),
    )
    const [amountRead] = getStateReads(amount, { abi: SPLITTER_ABI }) ?? []
    const [change] = compareState(
      amountRead!,
      encodeAbiParameters([{ type: 'uint256' }], [10n ** 19n]),
    )
    expect([
      change?.current?.value,
      change?.current?.name,
      change?.changed,
    ]).toEqual(['10000000000000000000', 'minWithdrawalAmount', true])
  })

  it('skips getters of another type or missing from the ABI', () => {
    const interval = call(
      encode({
        abi: ABI,
        functionName: 'setFeeDisbursementInterval',
        args: [86400],
      }),
    )
    expect(getStateReads(interval, { abi: SPLITTER_ABI })).not.toEqual(
      undefined,
    )
    expect(
      getStateReads(interval, {
        abi: ['function feeDisbursementInterval() view returns (uint256)'],
      }),
    ).toEqual(undefined)
    expect(getStateReads(interval, {})).toEqual(undefined)
  })

  it('requires the sender to be the pending owner in acceptOwnership', () => {
    const accept = call(encode({ abi: ABI, functionName: 'acceptOwnership' }))
    expect(getStateReads(accept, { abi: SPLITTER_ABI })).toEqual(undefined)
    const reads = getStateReads(accept, { abi: SPLITTER_ABI, sender: SENDER })!
    expect(reads.map((x) => [x.label, x.requirement])).toEqual([
      ['pendingOwner()', true],
      ['owner()', undefined],
    ])
    expect(
      compareState(reads[0]!, address('00'.repeat(20))).map((x) => [
        x.changed,
        x.requirement,
      ]),
    ).toEqual([[true, true]])
    expect(
      compareState(reads[0]!, address(SENDER.slice(2))).map((x) => [
        x.changed,
        x.requirement,
      ]),
    ).toEqual([[false, true]])
  })

  it('reads pendingOwner for an Ownable2Step transferOwnership', () => {
    const transfer = call(
      encode({ abi: ABI, functionName: 'transferOwnership', args: [SENDER] }),
    )
    expect(
      getStateReads(transfer, { abi: SPLITTER_ABI })?.map((x) => x.label),
    ).toEqual(['pendingOwner()'])
    expect(
      getStateReads(transfer, {
        abi: ['function owner() view returns (address)'],
      })?.map((x) => x.label),
    ).toEqual(['owner()'])
  })

  it('treats a result of the wrong shape as unknown', () => {
    const update = call(
      encode({
        abi: ABI,
        functionName: 'updateL1Recipient',
        args: [`0x${NEW_PROPOSER}`],
      }),
    )
    const [read] = getStateReads(update, { abi: SPLITTER_ABI }) ?? []
    expect(compareState(read!, '0x')).toEqual([
      { label: 'l1Recipient()', next: update.members![0]! },
    ])
  })
})
