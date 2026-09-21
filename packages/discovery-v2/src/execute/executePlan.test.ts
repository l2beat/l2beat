import type { IProvider } from '@l2beat/discovery'
import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber, type providers, utils } from 'ethers'
import { Library } from '../library/Library'
import type { Plan, Step } from '../plan/Plan'
import {
  ADMIN,
  FIXTURE_ABI,
  fixtureBaseline,
  fixturePrepared,
  IMPLEMENTATION,
  OPERATOR_ROLE,
  OWNER,
  REGISTRY,
  SELF,
  VALIDATOR_A,
  VALIDATOR_B,
  ZERO_HASH,
} from '../testing/fixture'
import { fixturePlan } from '../testing/fixturePlan'
import { type Executed, executePlan } from './executePlan'
import { TOO_MANY_VALUES } from './fetch'

/**
 * Runs plans against a scripted provider (no network) and checks the fields,
 * the raw fetch results and the status. The executor is the deterministic
 * half of the pipeline: given the same plan and chain state it must produce
 * the same V1-shaped values, so each fetch kind, each key source, reference
 * resolution, ordering and error propagation are pinned here.
 */
describe(executePlan.name, () => {
  const library = Library.load()
  after(() => library.close())

  const prepared = fixturePrepared()
  const baseline = fixtureBaseline()
  const coder = new utils.Interface(FIXTURE_ABI)

  const raw = (address: ChainSpecificAddress) =>
    ChainSpecificAddress.address(address).toString()
  const MAX_UINT =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935'

  /** The chain state the fixture contract is in. */
  function dispatch(
    address: ChainSpecificAddress,
    fragment: utils.FunctionFragment,
    args: unknown[],
  ): unknown {
    const key = JSON.stringify(args)
    switch (fragment.name) {
      case 'committeeThresholds':
        return {
          '[1,0]': BigNumber.from(2),
          '[1,1]': BigNumber.from(3),
          '[2,0]': BigNumber.from(MAX_UINT),
        }[key]
      case 'validatorAt':
        return [raw(VALIDATOR_A), raw(VALIDATOR_B)][Number(args[0])]
      case 'validators':
        return args[0] === raw(VALIDATOR_A)
      case 'balanceOf':
        return BigNumber.from(args[0] === raw(VALIDATOR_B) ? 10 : 0)
      case 'guardian':
        return address === REGISTRY ? raw(OWNER) : undefined
      case 'owner':
        return raw(OWNER)
      default:
        return undefined
    }
  }

  function log(
    event: string,
    values: unknown[],
    blockNumber: number,
    logIndex: number,
  ): providers.Log {
    const { topics, data } = coder.encodeEventLog(coder.getEvent(event), values)
    return {
      topics,
      data,
      blockNumber,
      logIndex,
      address: raw(SELF),
      blockHash: '0x',
      transactionHash: '0x',
      transactionIndex: 0,
      removed: false,
    }
  }

  const LOGS: providers.Log[] = [
    log('RoleGranted', [ZERO_HASH, raw(OWNER), raw(OWNER)], 10, 0),
    log('ValidatorStatusUpdate', [raw(VALIDATOR_A), true], 11, 0),
    log('RoleGranted', [OPERATOR_ROLE, raw(VALIDATOR_A), raw(OWNER)], 12, 1),
    log('ValidatorStatusUpdate', [raw(VALIDATOR_B), true], 13, 0),
    log('ValidatorStatusUpdate', [raw(VALIDATOR_A), false], 14, 0),
    log('RoleRevoked', [OPERATOR_ROLE, raw(VALIDATOR_A), raw(OWNER)], 15, 2),
    log('RoleGranted', [OPERATOR_ROLE, raw(VALIDATOR_B), raw(OWNER)], 15, 3),
  ]

  function scriptedProvider() {
    return mockObject<IProvider>({
      chain: 'ethereum',
      blockNumber: prepared.blockNumber,
      callMethod: async (address, abi, args) =>
        dispatch(address, abi as utils.FunctionFragment, args) as never,
      getLogs: async (address, topics) =>
        address === SELF
          ? LOGS.filter((entry) => entry.topics[0] === topics[0])
          : [],
      getStorage: async (_address, slot) =>
        Bytes.fromHex(utils.hexZeroPad(utils.hexlify(slot === 3 ? 42 : 0), 32)),
    })
  }

  function run(
    plan: Plan,
    provider = scriptedProvider(),
    options = {},
  ): Promise<Executed> {
    return executePlan(provider, { prepared, baseline, plan, library }, options)
  }

  function planOf(...steps: Step[]): Plan {
    return { version: 1, contract: 'Fixture', steps, skips: [] }
  }

  it('executes the fixture plan: every fetch kind and recipe, V1-formatted', async () => {
    const provider = scriptedProvider()
    const executed = await run(fixturePlan(), provider)
    expect(executed.status).toEqual('ok')
    expect(executed.fields).toEqual({
      accessControl: {
        value: {
          DEFAULT_ADMIN_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [OWNER],
          },
          OPERATOR_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [VALIDATOR_B],
          },
        },
      },
      validators: { value: [VALIDATOR_B] },
      committeeThresholds: { value: { '1,0': 2, '1,1': 3, '2,0': MAX_UINT } },
      validatorAt: { value: [VALIDATOR_A, VALIDATOR_B] },
      guardian: { value: OWNER },
      constructorArgs: { value: [IMPLEMENTATION, ADMIN, '0x'] },
      _totalWeight: { value: 42 },
    })
    expect(executed.raw.committeeThresholds).toEqual([
      { key: [1, 0], value: 2 },
      { key: [1, 1], value: 3 },
      { key: [2, 0], value: MAX_UINT },
    ])
    expect(executed.raw.validators).toEqual([
      {
        event: 'ValidatorStatusUpdate',
        blockNumber: 11,
        logIndex: 0,
        args: { validatorAddress: VALIDATOR_A, isActive: true },
      },
      {
        event: 'ValidatorStatusUpdate',
        blockNumber: 13,
        logIndex: 0,
        args: { validatorAddress: VALIDATOR_B, isActive: true },
      },
      {
        event: 'ValidatorStatusUpdate',
        blockNumber: 14,
        logIndex: 0,
        args: { validatorAddress: VALIDATOR_A, isActive: false },
      },
    ])
    expect(provider.callMethod).toHaveBeenCalledWith(
      REGISTRY,
      expect.subset({ name: 'guardian' }) as never,
      [],
    )
    expect(provider.getStorage).toHaveBeenOnlyCalledWith(SELF, 3)
  })

  it('sorts logs across events by block then log index before the recipe sees them', async () => {
    const executed = await run(
      planOf({
        id: 'accessControl',
        fetch: { kind: 'logs', events: ['RoleRevoked', 'RoleGranted'] },
        reason: 'r',
      }),
    )
    const events = (
      executed.raw.accessControl as { blockNumber: number; logIndex: number }[]
    ).map((entry) => [entry.blockNumber, entry.logIndex])
    expect(events).toEqual([
      [10, 0],
      [12, 1],
      [15, 2],
      [15, 3],
    ])
  })

  it('resolves $self, $baseline and $step references and strips chain prefixes before encoding', async () => {
    const provider = scriptedProvider()
    const executed = await run(
      planOf(
        {
          id: 'validators',
          fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
          use: 'set@1',
          args: {
            key: 'validatorAddress',
            add: [{ event: 'ValidatorStatusUpdate' }],
          },
          reason: 'r',
        },
        {
          id: 'balanceOf',
          fetch: {
            kind: 'callEach',
            method: 'balanceOf(address)',
            keys: { from: '$step.validators' },
          },
          use: 'map@1',
          reason: 'r',
        },
        {
          id: 'isSelfValidator',
          fetch: {
            kind: 'call',
            method: 'validators(address)',
            args: ['$self'],
          },
          reason: 'r',
        },
        {
          id: 'ownerIsValidator',
          fetch: {
            kind: 'call',
            method: 'validators(address)',
            args: ['$baseline.owner'],
          },
          reason: 'r',
        },
      ),
      provider,
    )
    expect(executed.status).toEqual('ok')
    expect(executed.fields.balanceOf?.value).toEqual({
      [VALIDATOR_A]: 0,
      [VALIDATOR_B]: 10,
    })
    expect(executed.fields.isSelfValidator?.value).toEqual(false)
    expect(provider.callMethod).toHaveBeenCalledWith(SELF, expect.anything(), [
      raw(SELF),
    ])
    expect(provider.callMethod).toHaveBeenCalledWith(SELF, expect.anything(), [
      raw(OWNER),
    ])
    expect(provider.callMethod).toHaveBeenCalledWith(SELF, expect.anything(), [
      raw(VALIDATOR_B),
    ])
  })

  it('prefixes address literals in recipe args so when.equals matches formatted log arguments', async () => {
    const executed = await run(
      planOf({
        id: 'validators',
        fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
        use: 'count@1',
        args: {
          events: ['ValidatorStatusUpdate'],
          when: {
            arg: 'validatorAddress',
            equals: raw(VALIDATOR_A).toLowerCase(),
          },
        },
        reason: 'r',
      }),
    )
    expect(executed.fields.validators).toEqual({ value: 2 })
  })

  it('issues independent steps and callEach keys in the same tick so the provider can batch them', async () => {
    let pending: Array<(value: unknown) => void> = []
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      blockNumber: prepared.blockNumber,
      callMethod: (address, abi, args) =>
        new Promise((resolve) => {
          pending.push(() =>
            resolve(
              dispatch(address, abi as utils.FunctionFragment, args) as never,
            ),
          )
        }),
    })
    const running = run(
      planOf(
        {
          id: 'committeeThresholds',
          fetch: {
            kind: 'callEach',
            method: 'committeeThresholds(uint8,uint256)',
            keys: {
              literal: [
                [1, 0],
                [1, 1],
              ],
            },
          },
          use: 'map@1',
          reason: 'r',
        },
        {
          id: 'owner',
          fetch: { kind: 'call', method: 'owner()' },
          reason: 'r',
        },
      ),
      provider,
    )
    await new Promise((resolve) => setImmediate(resolve))
    expect(pending.length).toEqual(3)
    for (const release of pending) {
      release(undefined)
    }
    pending = []
    const executed = await running
    expect(executed.status).toEqual('ok')
    expect(executed.fields.owner?.value).toEqual(OWNER)
  })

  it('runs a dependent step only after its dependency and fails it when the dependency failed', async () => {
    const executed = await run(
      planOf(
        {
          id: 'balanceOf',
          fetch: {
            kind: 'callEach',
            method: 'balanceOf(address)',
            keys: { from: '$step.validators' },
          },
          use: 'map@1',
          reason: 'r',
        },
        {
          id: 'validators',
          fetch: { kind: 'call', method: 'quote(uint256)', args: [1] },
          reason: 'r',
        },
      ),
    )
    expect(executed).toEqual({
      fields: {
        balanceOf: { error: 'dependency validators failed' },
        validators: { error: 'Execution reverted' },
      },
      raw: {},
      status: 'partial',
    })
  })

  it('enumerates untilRevert sequentially, stops at the first revert, and reports V1 wording at the cap', async () => {
    const step = (max: number): Step => ({
      id: 'validatorAt',
      fetch: {
        kind: 'callEach',
        method: 'validatorAt(uint256)',
        keys: { untilRevert: { max } },
      },
      use: 'array@1',
      reason: 'r',
    })
    expect((await run(planOf(step(10)))).fields.validatorAt).toEqual({
      value: [VALIDATOR_A, VALIDATOR_B],
    })
    expect((await run(planOf(step(2)))).fields.validatorAt).toEqual({
      value: [VALIDATOR_A, VALIDATOR_B],
      error: TOO_MANY_VALUES,
    })
    const capped = await run(planOf(step(10)), scriptedProvider(), {
      untilRevertHardMax: 1,
    })
    expect(capped.fields.validatorAt).toEqual({
      value: [VALIDATOR_A],
      error: TOO_MANY_VALUES,
    })
    expect(capped.status).toEqual('partial')
  })

  it('caps range enumeration like V1 and keeps the prefix with the error', async () => {
    const executed = await run(
      planOf({
        id: 'validatorAt',
        fetch: {
          kind: 'callEach',
          method: 'validatorAt(uint256)',
          keys: { range: { length: 2, start: 0 } },
        },
        use: 'array@1',
        reason: 'r',
      }),
      scriptedProvider(),
      { rangeHardMax: 1 },
    )
    expect(executed.fields.validatorAt).toEqual({
      value: [VALIDATOR_A],
      error: TOO_MANY_VALUES,
    })
  })

  it('fails the step when a literal key reverts, naming the key', async () => {
    const executed = await run(
      planOf({
        id: 'committeeThresholds',
        fetch: {
          kind: 'callEach',
          method: 'committeeThresholds(uint8,uint256)',
          keys: {
            literal: [
              [1, 0],
              [9, 9],
            ],
          },
        },
        use: 'map@1',
        reason: 'r',
      }),
    )
    expect(executed.fields.committeeThresholds).toEqual({
      error: 'key [9,9]: Execution reverted',
    })
  })

  it('records recipe failures, unknown methods and unresolvable references as step errors', async () => {
    const executed = await run(
      planOf(
        {
          id: 'validators',
          fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
          use: 'set@1',
          args: {
            key: 'validatorAddress',
            add: [{ event: 'ValidatorStatusUpdate' }],
            remove: [{ event: 'ValidatorStatusUpdate' }],
          },
          reason: 'r',
        },
        { id: 'owner', fetch: { kind: 'call', method: 'ownr()' }, reason: 'r' },
        {
          id: 'paused',
          fetch: { kind: 'call', method: 'owner()', at: '$baseline.paused' },
          reason: 'r',
        },
        {
          id: 'quote',
          fetch: { kind: 'call', method: 'owner()', at: '$baseline.nothing' },
          reason: 'r',
        },
      ),
    )
    expect(executed.status).toEqual('partial')
    expect(String(executed.fields.validators?.error)).toMatchRegex(
      /^set@1: .*(add|remove)/,
    )
    expect(Array.isArray(executed.raw.validators)).toEqual(true)
    expect(executed.fields.owner).toEqual({
      error:
        'function "ownr()" is not in the ABI; closest: owner(), quote(uint256), paused()',
    })
    expect(executed.fields.paused).toEqual({
      error: 'baseline field "paused" has no value (Execution reverted)',
    })
    expect(executed.fields.quote).toEqual({
      error: 'baseline has no field "nothing"',
    })
  })

  it('turns a null recipe result into no value, as V1 does for an event handler that matched nothing', async () => {
    const executed = await run(
      planOf({
        id: 'owner',
        fetch: { kind: 'logs', events: ['OwnershipTransferred'] },
        use: 'latest@1',
        args: { value: 'newOwner', set: [{ event: 'OwnershipTransferred' }] },
        reason: 'r',
      }),
    )
    expect(executed).toEqual({
      fields: { owner: {} },
      raw: { owner: [] },
      status: 'ok',
    })
  })

  it('formats hardcoded and storage values like V1 and reads storage at a foreign address', async () => {
    const provider = scriptedProvider()
    const executed = await run(
      planOf(
        {
          id: 'registry',
          fetch: { kind: 'hardcoded', value: raw(REGISTRY).toLowerCase() },
          reason: 'r',
        },
        {
          id: 'owner',
          fetch: {
            kind: 'storage',
            slot: '0x0',
            as: 'address',
            at: '$baseline.registry',
          },
          reason: 'r',
        },
        {
          id: 'paused',
          fetch: { kind: 'storage', slot: 3, as: 'bytes32' },
          reason: 'r',
        },
      ),
      provider,
    )
    expect(executed.fields).toEqual({
      registry: { value: REGISTRY },
      owner: {
        value: ChainSpecificAddress.fromLong('ethereum', `0x${'0'.repeat(40)}`),
      },
      paused: { value: `0x${'0'.repeat(62)}2a` },
    })
    expect(provider.getStorage).toHaveBeenCalledWith(REGISTRY, 0n)
  })

  it('refuses cycles and duplicate ids per step instead of hanging', async () => {
    const executed = await run(
      planOf(
        {
          id: 'a',
          fetch: { kind: 'call', method: 'owner()', at: '$step.b' },
          reason: 'r',
        },
        {
          id: 'b',
          fetch: { kind: 'call', method: 'owner()', at: '$step.a' },
          reason: 'r',
        },
        { id: 'a', fetch: { kind: 'call', method: 'owner()' }, reason: 'r' },
      ),
    )
    expect(executed.fields).toEqual({
      a: { error: 'duplicate step id "a"' },
      b: { error: 'part of a dependency cycle: a -> b -> a' },
    })
  })

  it('refuses a provider on another chain or block, because prepared.json describes one state', async () => {
    const provider = mockObject<IProvider>({
      chain: 'ethereum',
      blockNumber: 999,
    })
    await expect(run(planOf(), provider)).toBeRejectedWith(
      'provider is at block 999 but prepared.json is for block 1000',
    )
  })
})
