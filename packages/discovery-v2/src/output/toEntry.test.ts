import { expect } from 'earl'
import type { Executed } from '../execute/executePlan'
import {
  ADMIN,
  DEPLOYER,
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
import { toEntry } from './toEntry'

/**
 * Builds a baseline and an executed plan by hand and compares the entry with
 * a hand-written V1-shaped object, key order included. V1 tooling reads
 * these entries unchanged, so any extra, missing or reordered key is a
 * regression regardless of the values being right.
 */
describe(toEntry.name, () => {
  const prepared = fixturePrepared()
  const baseline = fixtureBaseline()
  const executed: Executed = {
    fields: {
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
      validators: { value: [VALIDATOR_B, SELF] },
      validatorAt: {
        value: [VALIDATOR_A],
        error: 'Too many values. Update configuration to explore fully',
      },
      guardian: { error: 'Execution reverted' },
      constructorArgs: { value: [IMPLEMENTATION, ADMIN, '0x'] },
    },
    raw: {},
    status: 'partial',
  }

  it('produces the V1 entry: proxy values, baseline and plan fields merged and sorted, errors sorted', () => {
    const { entry } = toEntry(prepared, baseline, executed, {
      planStatus: 'partial',
    })
    expect(entry).toEqual({
      name: 'Fixture',
      address: SELF,
      type: 'Contract',
      sourceHashes: [`0x${'11'.repeat(32)}`, `0x${'22'.repeat(32)}`],
      proxyType: 'EIP1967 proxy',
      deployerAddress: DEPLOYER,
      sinceTimestamp: 1_600_000_000,
      sinceBlock: 500,
      values: {
        $admin: ADMIN,
        $implementation: IMPLEMENTATION,
        accessControl: {
          DEFAULT_ADMIN_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [OWNER],
          },
          OPERATOR_ROLE: {
            adminRole: 'DEFAULT_ADMIN_ROLE',
            members: [VALIDATOR_B],
          },
        },
        constructorArgs: [IMPLEMENTATION, ADMIN, '0x'],
        DEFAULT_ADMIN_ROLE: ZERO_HASH,
        getConfig: { admin: ADMIN, delay: 86400 },
        OPERATOR_ROLE,
        owner: OWNER,
        registry: REGISTRY,
        validatorAt: [VALIDATOR_A],
        validatorCount: 2,
        validators: [VALIDATOR_B, SELF],
      },
      errors: {
        guardian: 'Execution reverted',
        paused: 'Execution reverted',
        validatorAt: 'Too many values. Update configuration to explore fully',
      },
      implementationNames: {
        [SELF]: 'TransparentUpgradeableProxy',
        [IMPLEMENTATION]: 'Fixture',
      },
    })
    expect(Object.keys(entry)).toEqual([
      'name',
      'address',
      'type',
      'sourceHashes',
      'proxyType',
      'deployerAddress',
      'sinceTimestamp',
      'sinceBlock',
      'values',
      'errors',
      'implementationNames',
    ])
    expect(Object.keys(entry.values ?? {})).toEqual(
      [...Object.keys(entry.values ?? {})].sort((a, b) => a.localeCompare(b)),
    )
  })

  it('returns relatives from every value, without this contract or the proxy machinery, unique and sorted', () => {
    const { relatives } = toEntry(prepared, baseline, executed, {
      planStatus: 'partial',
    })
    expect(relatives).toEqual(
      [ADMIN, DEPLOYER, OWNER, REGISTRY, VALIDATOR_A, VALIDATOR_B]
        .filter((address) => address !== DEPLOYER)
        .sort(),
    )
    expect(relatives).not.toInclude(SELF)
    expect(relatives).not.toInclude(IMPLEMENTATION)
  })

  it('writes the V2 facts to the side file', () => {
    const { meta } = toEntry(prepared, baseline, executed, {
      planStatus: 'partial',
      planHash: '0xplan',
      model: 'gpt-5-codex',
      plan: fixturePlan(),
    })
    expect(meta).toEqual({
      version: 1,
      planStatus: 'partial',
      planHash: '0xplan',
      shapeHash: `0x${'22'.repeat(32)}`,
      stepCount: 7,
      failedSteps: ['validatorAt', 'guardian'],
      skipCount: 3,
      model: 'gpt-5-codex',
    })
    const missing = toEntry(
      prepared,
      baseline,
      { fields: {}, raw: {}, status: 'ok' },
      { planStatus: 'missing' },
    )
    expect(missing.meta).toEqual({
      version: 1,
      planStatus: 'missing',
      shapeHash: `0x${'22'.repeat(32)}`,
      stepCount: 0,
      failedSteps: [],
      skipCount: 0,
    })
  })

  it('marks unverified contracts and drops source hashes, empty values and errors like V1', () => {
    const unverified = fixturePrepared({
      isVerified: false,
      proxy: { type: 'immutable', values: {}, addresses: [SELF] },
      sources: [{ ...prepared.sources[1]!, address: SELF, hash: undefined }],
      implementationNames: undefined,
      deployment: undefined,
    })
    const { entry } = toEntry(
      unverified,
      { fields: {} },
      { fields: {}, raw: {}, status: 'ok' },
      { planStatus: 'missing' },
    )
    expect(entry).toEqual({
      name: 'Fixture',
      address: SELF,
      type: 'Contract',
      unverified: true,
      proxyType: 'immutable',
      implementationNames: { [SELF]: 'Fixture' },
    })
  })

  it('writes an EOA entry with no values, as V1 does', () => {
    const eoa = fixturePrepared({
      isEOA: true,
      name: '',
      proxy: { type: 'EOA', values: {}, addresses: [SELF] },
      sources: [],
      abi: [],
      abis: {},
    })
    const output = toEntry(
      eoa,
      { fields: {} },
      { fields: {}, raw: {}, status: 'ok' },
      { planStatus: 'missing' },
    )
    expect(output.entry).toEqual({
      address: SELF,
      type: 'EOA',
      proxyType: 'EOA',
    })
    expect(output.relatives).toEqual([])
  })
})
