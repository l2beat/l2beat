import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { ZkStackDaTrackingHandler } from './ZkStackDaTrackingHandler'

describe(ZkStackDaTrackingHandler.name, () => {
  const abi = new utils.Interface([
    'event ValidatorAdded(uint256 indexed chainId, address validator)',
    'event ValidatorRemoved(uint256 indexed chainId, address validator)',
    'event RoleGranted(address indexed chainAddress, bytes32 indexed role, address indexed account)',
    'event RoleRevoked(address indexed chainAddress, bytes32 indexed role, address indexed account)',
  ])

  const EXECUTOR_ROLE = utils.solidityKeccak256(['string'], ['EXECUTOR_ROLE'])

  const CHAIN_ID = 543210
  const OTHER_CHAIN_ID = 324

  const OLD_INBOX = 'eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564'
  const NEW_INBOX = 'eth:0x2e5110cF18678Ec99818bFAa849B8C881744b776'
  const DIAMOND = 'eth:0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9'
  const DIAMOND_RAW = EthereumAddress(
    '0xdbD849acC6bA61F461CB8A41BBaeE2D673CA02d9',
  )

  const ALICE = EthereumAddress('0x' + '1'.repeat(40))
  const BOB = EthereumAddress('0x' + '2'.repeat(40))
  const CAROL = EthereumAddress('0x' + '3'.repeat(40))

  function ValidatorAdded(
    chainId: number,
    validator: EthereumAddress,
    blockNumber: number,
    logIndex = 0,
  ): providers.Log {
    return {
      ...abi.encodeEventLog(abi.getEvent('ValidatorAdded'), [
        chainId,
        validator,
      ]),
      blockNumber,
      logIndex,
    } as providers.Log
  }

  function ValidatorRemoved(
    chainId: number,
    validator: EthereumAddress,
    blockNumber: number,
    logIndex = 0,
  ): providers.Log {
    return {
      ...abi.encodeEventLog(abi.getEvent('ValidatorRemoved'), [
        chainId,
        validator,
      ]),
      blockNumber,
      logIndex,
    } as providers.Log
  }

  function RoleGranted(
    chainAddress: EthereumAddress,
    role: string,
    account: EthereumAddress,
    blockNumber: number,
    logIndex = 0,
  ): providers.Log {
    return {
      ...abi.encodeEventLog(abi.getEvent('RoleGranted'), [
        chainAddress,
        role,
        account,
      ]),
      blockNumber,
      logIndex,
    } as providers.Log
  }

  function RoleRevoked(
    chainAddress: EthereumAddress,
    role: string,
    account: EthereumAddress,
    blockNumber: number,
    logIndex = 0,
  ): providers.Log {
    return {
      ...abi.encodeEventLog(abi.getEvent('RoleRevoked'), [
        chainAddress,
        role,
        account,
      ]),
      blockNumber,
      logIndex,
    } as providers.Log
  }

  function providerWithLogs(
    logsByAddress: Record<string, providers.Log[]>,
  ): IProvider {
    return mockObject<IProvider>({
      async getLogs(address) {
        return logsByAddress[address.toString()] ?? []
      },
    })
  }

  const contractAddress = ChainSpecificAddress(NEW_INBOX)

  it('splits an era into entries at every validator set change', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: OLD_INBOX, validatorSource: 'legacyEvents' }],
    })
    const provider = providerWithLogs({
      [OLD_INBOX]: [
        ValidatorAdded(CHAIN_ID, ALICE, 100, 0),
        ValidatorAdded(CHAIN_ID, BOB, 100, 1),
        ValidatorAdded(CHAIN_ID, CAROL, 200),
      ],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.error).toEqual(undefined)
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString(), BOB.toString()],
        sinceBlock: 100,
        untilBlock: 200,
      },
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString(), BOB.toString(), CAROL.toString()],
        sinceBlock: 200,
        untilBlock: undefined,
      },
    ])
  })

  it('ignores events of other chains', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: OLD_INBOX, validatorSource: 'legacyEvents' }],
    })
    const provider = providerWithLogs({
      [OLD_INBOX]: [
        ValidatorAdded(OTHER_CHAIN_ID, CAROL, 50),
        ValidatorAdded(CHAIN_ID, ALICE, 100),
        ValidatorAdded(OTHER_CHAIN_ID, BOB, 150),
      ],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString()],
        sinceBlock: 100,
        untilBlock: undefined,
      },
    ])
  })

  it('coalesces separate ranges with the same validator set', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: OLD_INBOX, validatorSource: 'legacyEvents' }],
    })
    const provider = providerWithLogs({
      [OLD_INBOX]: [
        ValidatorAdded(CHAIN_ID, ALICE, 100),
        ValidatorAdded(CHAIN_ID, BOB, 200),
        ValidatorRemoved(CHAIN_ID, BOB, 300),
      ],
    })

    const result = await handler.execute(provider, contractAddress)
    // {ALICE} exists in 100-200 and again from 300 - merged into one open
    // entry so the backend never sees two configurations with the same id.
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString()],
        sinceBlock: 100,
        untilBlock: undefined,
      },
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString(), BOB.toString()],
        sinceBlock: 200,
        untilBlock: 300,
      },
    ])
  })

  it('resolves crossChainRoles eras filtered by chain address and role', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [
        {
          inbox: NEW_INBOX,
          validatorSource: 'crossChainRoles',
          chainAddress: DIAMOND,
        },
      ],
    })
    const OTHER_ROLE = utils.solidityKeccak256(['string'], ['OTHER_ROLE'])
    const OTHER_DIAMOND = EthereumAddress('0x' + '9'.repeat(40))
    const provider = providerWithLogs({
      [NEW_INBOX]: [
        RoleGranted(DIAMOND_RAW, EXECUTOR_ROLE, ALICE, 1000, 0),
        RoleGranted(DIAMOND_RAW, OTHER_ROLE, BOB, 1000, 1),
        RoleGranted(OTHER_DIAMOND, EXECUTOR_ROLE, CAROL, 1000, 2),
        RoleRevoked(DIAMOND_RAW, EXECUTOR_ROLE, ALICE, 2000, 0),
        RoleGranted(DIAMOND_RAW, EXECUTOR_ROLE, BOB, 2000, 1),
      ],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual([
      {
        inbox: NEW_INBOX,
        sequencers: [ALICE.toString()],
        sinceBlock: 1000,
        untilBlock: 2000,
      },
      {
        inbox: NEW_INBOX,
        sequencers: [BOB.toString()],
        sinceBlock: 2000,
        untilBlock: undefined,
      },
    ])
  })

  it('chains era boundaries: previous era closes where the next one starts', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [
        {
          inbox: OLD_INBOX,
          validatorSource: 'legacyEvents',
          sinceBlock: 100,
        },
        {
          inbox: NEW_INBOX,
          validatorSource: 'crossChainRoles',
          chainAddress: DIAMOND,
          sinceBlock: 5000,
        },
      ],
    })
    const provider = providerWithLogs({
      [OLD_INBOX]: [
        ValidatorAdded(CHAIN_ID, ALICE, 100),
        // rotation after the era already ended must not create entries
        ValidatorAdded(CHAIN_ID, CAROL, 6000),
      ],
      [NEW_INBOX]: [RoleGranted(DIAMOND_RAW, EXECUTOR_ROLE, BOB, 5000)],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString()],
        sinceBlock: 100,
        untilBlock: 5000,
      },
      {
        inbox: NEW_INBOX,
        sequencers: [BOB.toString()],
        sinceBlock: 5000,
        untilBlock: undefined,
      },
    ])
  })

  it('uses the sequencers override verbatim without fetching logs', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [
        {
          inbox: OLD_INBOX,
          validatorSource: 'legacyEvents',
          sinceBlock: 100,
          untilBlock: 200,
          sequencers: [BOB.toString(), ALICE.toString()],
        },
        {
          inbox: NEW_INBOX,
          validatorSource: 'crossChainRoles',
          chainAddress: DIAMOND,
          sinceBlock: 200,
        },
      ],
    })
    const provider = providerWithLogs({
      [NEW_INBOX]: [RoleGranted(DIAMOND_RAW, EXECUTOR_ROLE, CAROL, 200)],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString(), BOB.toString()],
        sinceBlock: 100,
        untilBlock: 200,
      },
      {
        inbox: NEW_INBOX,
        sequencers: [CAROL.toString()],
        sinceBlock: 200,
        untilBlock: undefined,
      },
    ])
  })

  it('skips windows with an empty validator set', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: OLD_INBOX, validatorSource: 'legacyEvents' }],
    })
    const provider = providerWithLogs({
      [OLD_INBOX]: [
        ValidatorAdded(CHAIN_ID, ALICE, 100),
        ValidatorRemoved(CHAIN_ID, ALICE, 200),
        ValidatorAdded(CHAIN_ID, BOB, 300),
      ],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString()],
        sinceBlock: 100,
        untilBlock: 200,
      },
      {
        inbox: OLD_INBOX,
        sequencers: [BOB.toString()],
        sinceBlock: 300,
        untilBlock: undefined,
      },
    ])
  })

  it('errors when an era has no events and no explicit sinceBlock', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: OLD_INBOX, validatorSource: 'legacyEvents' }],
    })
    const provider = providerWithLogs({})

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual(undefined)
    expect(result.error ?? '').toInclude('no validator events')
  })

  it('errors when crossChainRoles is missing a chainAddress', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: NEW_INBOX, validatorSource: 'crossChainRoles' }],
    })
    const provider = providerWithLogs({})

    const result = await handler.execute(provider, contractAddress)
    expect(result.error ?? '').toInclude('requires a chainAddress')
  })

  it('is deterministic regardless of validator address casing and order', async () => {
    const handler = new ZkStackDaTrackingHandler('daTrackingConfig', {
      type: 'zkStackDaTracking',
      l2ChainId: CHAIN_ID,
      eras: [{ inbox: OLD_INBOX, validatorSource: 'legacyEvents' }],
    })
    const provider = providerWithLogs({
      [OLD_INBOX]: [
        ValidatorAdded(CHAIN_ID, CAROL, 100, 1),
        ValidatorAdded(CHAIN_ID, ALICE, 100, 0),
        ValidatorAdded(CHAIN_ID, BOB, 100, 2),
      ],
    })

    const result = await handler.execute(provider, contractAddress)
    expect(result.value).toEqual([
      {
        inbox: OLD_INBOX,
        sequencers: [ALICE.toString(), BOB.toString(), CAROL.toString()],
        sinceBlock: 100,
        untilBlock: undefined,
      },
    ])
  })
})
