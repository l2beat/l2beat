import { withoutUndefinedKeys } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Library } from '../library/Library'
import {
  ADMIN,
  fixtureBaseline,
  fixturePrepared,
  fixtureWorklist,
  OWNER,
  ZERO_HASH,
} from '../testing/fixture'
import { fixturePlan } from '../testing/fixturePlan'
import type { Plan, Step } from './Plan'
import {
  type Finding,
  type ValidationContext,
  validatePlan,
} from './validatePlan'

/**
 * Starts from a fully valid plan for the fixture contract and breaks one
 * thing per test, asserting the finding's path and a message that says what
 * would be right. The validator is the gate between the model and RPC, and
 * its messages are the model's only feedback in a repair round, so both the
 * detection and the wording are pinned.
 */
describe(validatePlan.name, () => {
  const library = Library.load()
  after(() => library.close())

  const ctx: ValidationContext = {
    prepared: fixturePrepared(),
    baseline: fixtureBaseline(),
    worklist: fixtureWorklist(),
    library,
  }

  function errorsOf(plan: unknown): Finding[] {
    return validatePlan(plan, ctx).filter(
      (finding) => finding.severity === 'error',
    )
  }

  function withStep(
    patch: Partial<Step> | ((step: Step) => Step),
    index = 0,
  ): Plan {
    const plan = fixturePlan()
    const step = plan.steps[index] as Step
    plan.steps[index] = withoutUndefinedKeys(
      typeof patch === 'function' ? patch(step) : { ...step, ...patch },
    )
    return plan
  }

  it('accepts the fixture plan with no errors, warning only about the private state variable id', () => {
    expect(validatePlan(fixturePlan(), ctx)).toEqual([
      {
        severity: 'warning',
        path: 'steps[6].id',
        message:
          '"_totalWeight" is not an ABI function name but appears in the source, so it is accepted as a state variable name',
      },
    ])
  })

  describe('rule 1: schema', () => {
    it('returns schema findings alone, with plan paths', () => {
      const plan = { ...fixturePlan(), version: 2, steps: [{ id: 'x' }] }
      expect(validatePlan(plan, ctx)).toEqual([
        { severity: 'error', path: 'version', message: 'expected 1, got 2' },
        {
          severity: 'error',
          path: 'steps[0]',
          message: 'missing required property "fetch"',
        },
        {
          severity: 'error',
          path: 'steps[0]',
          message: 'missing required property "reason"',
        },
      ])
      expect(validatePlan('nonsense', ctx)).toEqual([
        {
          severity: 'error',
          path: 'plan',
          message: 'expected object, got "nonsense"',
        },
      ])
    })

    it('rejects a plan authored for another shape', () => {
      const plan = { ...fixturePlan(), shapeHash: '0xother' }
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'shapeHash',
          message: `plan is for shape 0xother but prepared.json has shape 0x${'22'.repeat(32)}; copy the prepared value`,
        },
      ])
    })
  })

  describe('rule 2: coverage', () => {
    it('reports worklist items with no verdict in one finding', () => {
      const plan = fixturePlan()
      plan.skips = plan.skips.slice(0, 1)
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'plan',
          message:
            "2 worklist item(s) have no verdict: quote(uint256), supportsInterface(bytes4); add each to a step's covers or to skips with a reason",
        },
      ])
    })

    it('reports a second verdict for the same item at the later position', () => {
      const plan = fixturePlan()
      plan.skips.push({ item: 'validators(address)', reason: 'covered' })
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'skips[3].item',
          message:
            '"validators(address)" already has a verdict at steps[1].covers[0]; each worklist item is covered or skipped exactly once',
        },
      ])
    })

    it('rejects covers and skips that are not worklist items, with hints', () => {
      const plan = withStep({ covers: ['validator(address)'] }, 1)
      plan.skips.push({ item: 'owner()', reason: 'covered' })
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].covers[0]',
          message:
            '"validator(address)" is not a worklist item; closest: validators(address), validatorAt(uint256), balanceOf(address)',
        },
        {
          severity: 'error',
          path: 'skips[3].item',
          message:
            '"owner()" is a 0-arg getter, which the baseline reads; it is not a worklist item and needs no verdict',
        },
        {
          severity: 'error',
          path: 'plan',
          message:
            "1 worklist item(s) have no verdict: validators(address); add each to a step's covers or to skips with a reason",
        },
      ])
    })
  })

  describe('rule 3: ABI membership', () => {
    it('rejects a method that is not in the ABI and names the closest ones', () => {
      const plan = withStep(
        (step) => ({
          ...step,
          fetch: {
            ...step.fetch,
            method: 'commiteeThresholds(uint8,uint256)',
          } as never,
        }),
        2,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[2].fetch.method',
          message:
            'function "commiteeThresholds(uint8,uint256)" is not in the ABI; closest: committeeThresholds(uint8,uint256), OPERATOR_ROLE(), validatorCount()',
        },
      ])
    })

    it('accepts a foreign full fragment only together with at', () => {
      const plan = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'call',
            method: 'function guardian() view returns (address)',
          },
        }),
        4,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].fetch.method',
          message:
            "guardian() is not in this contract's ABI; a full fragment is only accepted together with `at` naming the contract that has it",
        },
      ])
    })

    it('rejects events that are not in the ABI', () => {
      const plan = withStep(
        {
          fetch: {
            kind: 'logs',
            events: ['ValidatorStatusUpdate', 'ValidatorAdded'],
          },
        },
        1,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].fetch.events[1]',
          message:
            'event "ValidatorAdded" is not in the ABI; closest: RoleGranted(bytes32,address,address), ValidatorStatusUpdate(address,bool), RoleRevoked(bytes32,address,address)',
        },
      ])
    })

    it('rejects recipe rules naming events the step does not fetch, and unknown event arguments', () => {
      const plan = withStep(
        {
          args: {
            key: 'validator',
            add: [
              { event: 'RoleGranted', when: { arg: 'isActive', equals: true } },
            ],
            remove: [
              {
                event: 'ValidatorStatusUpdate',
                when: { arg: 'active', equals: false },
              },
            ],
          },
        },
        1,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].args.key',
          message:
            'event ValidatorStatusUpdate has no argument "validator"; its arguments are validatorAddress, isActive',
        },
        {
          severity: 'error',
          path: 'steps[1].args.add[0].event',
          message:
            'event "RoleGranted" is not fetched by this step; fetch.events lists ValidatorStatusUpdate',
        },
        {
          severity: 'error',
          path: 'steps[1].args.remove[0].when.arg',
          message:
            'event ValidatorStatusUpdate has no argument "active"; its arguments are validatorAddress, isActive',
        },
      ])
    })
  })

  describe('rule 4: recipe', () => {
    it('rejects an unknown recipe and lists the known ones', () => {
      const plan = withStep({ use: 'sets@1' }, 1)
      expect(errorsOf(plan)[0]).toEqual({
        severity: 'error',
        path: 'steps[1].use',
        message: `Unknown recipe "sets@1". Known recipes: ${library
          .list()
          .map((recipe) => recipe.id)
          .join(', ')}`,
      })
    })

    it('reports recipe argument findings under the step args path', () => {
      const plan = withStep(
        { args: { key: 'validatorAddress', add: [], extra: 1 } },
        1,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].args.add',
          message: 'expected at least 1 item(s), got 0',
        },
        {
          severity: 'error',
          path: 'steps[1].args.extra',
          message: 'unexpected property (allowed: "key", "add", "remove")',
        },
      ])
    })

    it('rejects a recipe whose input kind does not match the fetch', () => {
      const plan = withStep({ use: 'map@1', args: undefined }, 1)
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].use',
          message:
            'map@1 takes [{ key, value }] pairs from a callEach fetch, but this step fetches a logs fetch; use a matching fetch, or one of accessControl@1, count@1, latest@1, list@1, set@1',
        },
      ])
      const formatter = withStep(
        { use: 'format.seconds@1', args: undefined },
        2,
      )
      expect(errorsOf(formatter)[0]?.message).toEqual(
        'format.seconds@1 takes one scalar value from a call, storage or hardcoded fetch, but this step fetches a callEach fetch; use a matching fetch, or one of array@1, map@1',
      )
    })

    it('requires a recipe for logs and callEach fetches and warns about unused args', () => {
      const plan = withStep({ use: undefined }, 2)
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[2].use',
          message:
            'a callEach fetch needs a recipe to shape its result into a field value; pick one of array@1, map@1',
        },
      ])
      const unused = withStep({ args: { decimals: 18 } }, 4)
      expect(validatePlan(unused, ctx)).toInclude({
        severity: 'warning',
        path: 'steps[4].args',
        message: 'args are ignored because the step has no `use`',
      })
    })
  })

  describe('rule 5: references', () => {
    it('rejects unknown baseline fields and warns when the field has no value', () => {
      const missing = withStep(
        (step) => ({
          ...step,
          fetch: { ...step.fetch, at: '$baseline.registryAddress' } as never,
        }),
        4,
      )
      expect(errorsOf(missing)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].fetch.at',
          message:
            'baseline has no field "registryAddress"; closest: registry, OPERATOR_ROLE, getConfig',
        },
      ])
      const errored = withStep(
        (step) => ({
          ...step,
          fetch: { ...step.fetch, at: '$baseline.paused' } as never,
        }),
        4,
      )
      expect(validatePlan(errored, ctx)).toInclude({
        severity: 'warning',
        path: 'steps[4].fetch.at',
        message:
          'baseline field "paused" has no value (Execution reverted); the step will fail at run time',
      })
    })

    it('requires at to be an address: literal, baseline address, or an address-producing step', () => {
      const notAddress = withStep(
        (step) => ({
          ...step,
          fetch: { ...step.fetch, at: '$baseline.validatorCount' } as never,
        }),
        4,
      )
      expect(errorsOf(notAddress)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].fetch.at',
          message:
            '$baseline.validatorCount is 2, not an address; `at` needs an address-valued baseline field or a literal address',
        },
      ])
      const fromSet = withStep(
        (step) => ({
          ...step,
          fetch: { ...step.fetch, at: '$step.validators' } as never,
        }),
        4,
      )
      expect(errorsOf(fromSet)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].fetch.at',
          message:
            '$step.validators does not produce an address (a logs fetch shaped by set@1); `at` needs a call returning one address, a storage slot read as address, or a hardcoded address',
        },
      ])
      const literal = withStep(
        (step) => ({
          ...step,
          fetch: { ...step.fetch, at: ADMIN.slice(4).toLowerCase() } as never,
        }),
        4,
      )
      expect(errorsOf(literal)).toEqual([])
      const viaStep = withStep(
        (step) => ({
          ...step,
          fetch: { ...step.fetch, at: '$step.guardian' } as never,
        }),
        6,
      )
      expect(errorsOf(viaStep)).toEqual([])
    })

    it('rejects unknown and self step references', () => {
      const plan = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'validators(address)',
            keys: { from: '$step.members' },
          },
          use: 'map@1',
          args: undefined,
        }),
        1,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].fetch.keys.from',
          message:
            'no step has id "members"; steps are accessControl, validators, committeeThresholds, validatorAt, guardian, constructorArgs, _totalWeight',
        },
      ])
      const self = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'validators(address)',
            keys: { from: '$step.validators' },
          },
          use: 'map@1',
          args: undefined,
        }),
        1,
      )
      expect(errorsOf(self)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].fetch.keys.from',
          message: 'a step cannot reference itself ($step.validators)',
        },
      ])
    })

    it('type-checks baseline values against the position that uses them', () => {
      const plan = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'validatorAt(uint256)',
            keys: { range: { length: '$baseline.owner' } },
          },
        }),
        3,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[3].fetch.keys.range.length',
          message: `$baseline.owner is "${OWNER}", not an integer; \`length\` needs a numeric baseline field`,
        },
      ])
      const from = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'validatorAt(uint256)',
            keys: { from: '$baseline.owner' },
          },
        }),
        3,
      )
      expect(errorsOf(from)[0]?.message).toEqual(
        `$baseline.owner is "${OWNER}"; \`from\` needs an array of keys or an object whose keys are used`,
      )
      const arg = withStep(
        {
          id: 'hasRole',
          fetch: {
            kind: 'call',
            method: 'hasRole(bytes32,address)',
            args: ['$baseline.validatorCount', '$baseline.owner'],
          },
        },
        4,
      )
      expect(errorsOf(arg)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].fetch.args[0]',
          message:
            '$baseline.validatorCount is 2: expected bytes32 as 0x + 64 hex digits, got 2',
        },
      ])
    })

    it('reports a dependency cycle once, at its first step', () => {
      const plan = fixturePlan()
      plan.steps[4] = {
        ...(plan.steps[4] as Step),
        fetch: {
          kind: 'call',
          method: 'function guardian() view returns (address)',
          at: '$step.registry',
        },
      }
      plan.steps.push({
        id: 'registry',
        fetch: {
          kind: 'storage',
          slot: 4,
          as: 'address',
          at: '$step.guardian',
        },
        reason: 'r',
      })
      const findings = errorsOf(plan)
      expect(findings).toInclude({
        severity: 'error',
        path: 'steps[4].fetch',
        message:
          'steps guardian -> registry -> guardian reference each other in a cycle; break it by reading one of them from the baseline or a literal',
      })
    })
  })

  describe('rule 6: identifiers', () => {
    it('rejects duplicate ids and ids that shadow a baseline field', () => {
      const duplicate = withStep({ id: 'validators', covers: [] }, 3)
      expect(errorsOf(duplicate)).toEqual([
        {
          severity: 'error',
          path: 'plan',
          message:
            "1 worklist item(s) have no verdict: validatorAt(uint256); add each to a step's covers or to skips with a reason",
        },
        {
          severity: 'error',
          path: 'steps[3].id',
          message:
            'duplicate step id "validators" (first used at steps[1].id); merge the steps or rename one after its own getter',
        },
      ])
      const shadow = withStep({ id: 'owner' }, 4)
      expect(errorsOf(shadow)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].id',
          message:
            '"owner" is already a baseline field; a step must not shadow it (reference it as $baseline.owner instead)',
        },
      ])
    })

    it('rejects an id found nowhere and suggests the covered getters', () => {
      const plan = withStep({ id: 'thresholds' }, 2)
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[2].id',
          message:
            '"thresholds" is neither an ABI function name, a fixed name (accessControl, constructorArgs) nor an identifier in the source; name the field after the getter or state variable it comes from; covered items suggest: committeeThresholds',
        },
      ])
    })

    it('requires the fixed id for constructorArgs', () => {
      const plan = withStep({ id: 'validatorCount' }, 5)
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[5].id',
          message:
            '"validatorCount" is already a baseline field; a step must not shadow it (reference it as $baseline.validatorCount instead)',
        },
        {
          severity: 'error',
          path: 'steps[5].id',
          message:
            'a constructorArgs fetch must use the fixed id "constructorArgs" (V1 names this field so), got "validatorCount"',
        },
      ])
    })
  })

  describe('rule 7: literals', () => {
    it('type-checks call args, their count, and callEach literal keys', () => {
      const count = withStep(
        {
          id: 'hasRole',
          fetch: { kind: 'call', method: 'hasRole(bytes32,address)', args: [] },
        },
        4,
      )
      expect(errorsOf(count)).toEqual([
        {
          severity: 'error',
          path: 'steps[4].fetch.args',
          message: 'hasRole(bytes32,address) takes 2 argument(s), got 0',
        },
      ])
      const badArg = withStep(
        {
          id: 'hasRole',
          fetch: {
            kind: 'call',
            method: 'hasRole(bytes32,address)',
            args: [ZERO_HASH, '0xDEADbeef'],
          },
        },
        4,
      )
      expect(errorsOf(badArg).map((finding) => finding.path)).toEqual([
        'steps[4].fetch.args[1]',
      ])
      const keys = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'committeeThresholds(uint8,uint256)',
            keys: { literal: [[1, 0], [300, 1], 2] },
          },
        }),
        2,
      )
      expect(errorsOf(keys)).toEqual([
        {
          severity: 'error',
          path: 'steps[2].fetch.keys.literal[1]',
          message: '[0]: 300 is out of range for uint8',
        },
        {
          severity: 'error',
          path: 'steps[2].fetch.keys.literal[2]',
          message:
            'committeeThresholds(uint8,uint256) takes 2 arguments, so each key must be an array of 2 literals, got 2',
        },
      ])
    })

    it('type-checks when.equals against the event argument type', () => {
      const plan = withStep(
        {
          args: {
            key: 'validatorAddress',
            add: [
              {
                event: 'ValidatorStatusUpdate',
                when: { arg: 'isActive', equals: 'yes' },
              },
            ],
          },
        },
        1,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].args.add[0].when.equals',
          message:
            'ValidatorStatusUpdate.isActive is bool: expected a boolean, got "yes"',
        },
      ])
    })

    it('requires an integer-indexed method for range and untilRevert keys, and a sane range length', () => {
      const plan = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'validators(address)',
            keys: { untilRevert: { max: 50 } },
          },
          use: 'array@1',
          args: undefined,
        }),
        1,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[1].fetch.method',
          message:
            'range and untilRevert keys need a method with one integer argument; validators(address) takes (address)',
        },
      ])
      const length = withStep(
        (step) => ({
          ...step,
          fetch: {
            kind: 'callEach',
            method: 'validatorAt(uint256)',
            keys: { range: { length: 'ten' } },
          },
        }),
        3,
      )
      expect(errorsOf(length)).toEqual([
        {
          severity: 'error',
          path: 'steps[3].fetch.keys.range.length',
          message:
            'expected a non-negative integer or a reference such as $baseline.<lengthGetter>, got "ten"',
        },
      ])
    })

    it('rejects malformed storage slots', () => {
      const plan = withStep(
        { fetch: { kind: 'storage', slot: '0xzz', as: 'uint' } },
        6,
      )
      expect(errorsOf(plan)).toEqual([
        {
          severity: 'error',
          path: 'steps[6].fetch.slot',
          message:
            'expected a slot as a non-negative integer, a decimal string or a 0x hex string, got "0xzz"',
        },
      ])
    })
  })
})
