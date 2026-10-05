import { expect } from 'earl'
import type { ContractFacts } from '../facts'
import { loadFixture } from '../test/fixtures'
import { checkNames } from './checkNames'
import { type Finding, Findings } from './Finding'

describe(checkNames.name, () => {
  const scroll = loadFixture('ScrollChain')
  const hardcoded = { handler: { type: 'hardcoded', value: 1 } }

  function names(
    entries: Record<string, Record<string, unknown>>,
    facts: ContractFacts = scroll,
  ): Finding[] {
    const findings = new Findings()
    checkNames(Object.entries(entries), facts, findings)
    return findings.list
  }

  function withBaseline(
    fields: ContractFacts['baseline']['fields'],
    abi = scroll.abi,
  ): ContractFacts {
    return {
      ...scroll,
      abi,
      baseline: { fields: { ...scroll.baseline.fields, ...fields } },
    }
  }

  it('does not judge whether a name is meaningful', () => {
    expect(
      names({ data1: hardcoded, sequencers: hardcoded, $odd: hardcoded }),
    ).toEqual([])
  })

  it('rejects a field that computes a value under the name of a baseline getter or a project config field, which it would replace', () => {
    const facts = withBaseline({
      fromConfig: { kind: 'override', value: 7 },
      broken: { kind: 'getter', error: 'Execution reverted' },
    })
    expect(
      names(
        {
          owner: hardcoded,
          fromConfig: { edit: ['format', 'FormatSeconds'] },
          broken: hardcoded,
        },
        facts,
      ),
    ).toEqual([
      {
        path: 'fields.owner',
        message:
          '"owner" is a baseline getter (V1 reads it as "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"); V1 keeps the first field of a name and template fields come first, so handler would replace that value: pick another name and reference it as {{ owner }} if you need it, or give this entry only severity, description, permissions',
      },
      {
        path: 'fields.fromConfig',
        message:
          '"fromConfig" is a field of the project config (V1 reads it as 7); V1 keeps the first field of a name and template fields come first, so edit would replace that value: pick another name and reference it as {{ fromConfig }} if you need it, or give this entry only severity, description, permissions',
      },
      {
        path: 'fields.broken',
        message:
          '"broken" is a baseline getter (V1 reads it, currently with an error: Execution reverted); V1 keeps the first field of a name and template fields come first, so handler would replace that value: pick another name and reference it as {{ broken }} if you need it, or give this entry only severity, description, permissions',
      },
    ])
  })

  it('lets an entry describe a baseline or proxy value without changing it', () => {
    const facts = { ...scroll, proxyValues: { $admin: 'eth:0x1' } }
    expect(
      names(
        {
          owner: { severity: 'HIGH', description: 'Can upgrade.' },
          $admin: { permissions: [{ type: 'upgrade' }] },
        },
        facts,
      ),
    ).toEqual([])
  })

  it('lets only an array over the probed function reuse a probe name', () => {
    const probed = withBaseline({
      committedBatches: { kind: 'probe', value: ['0x00'] },
    })
    expect(
      names(
        { committedBatches: { handler: { type: 'array', length: 3 } } },
        probed,
      ),
    ).toEqual([])
    expect(
      names(
        {
          committedBatches: {
            handler: { type: 'array', method: 'committedBatches', length: 3 },
          },
        },
        probed,
      ),
    ).toEqual([])
    expect(
      names(
        {
          committedBatches: {
            handler: { type: 'call', method: 'committedBatches', args: [1] },
          },
        },
        probed,
      ),
    ).toEqual([
      {
        path: 'fields.committedBatches',
        message:
          '"committedBatches" is V1\'s 5-index probe of committedBatches(uint256); only an `array` field reading committedBatches(uint256) may take this name (it replaces the probe with the whole array), so pick another name',
      },
    ])
  })

  it('requires the array to read the probed overload, resolved as V1 resolves it', () => {
    const probedUint256 =
      'function committedBatches(uint256) view returns (bytes32)'
    const narrower = 'function committedBatches(uint32) view returns (bytes32)'
    const probed = (abi: string[]) =>
      withBaseline(
        { committedBatches: { kind: 'probe', value: ['0x00'] } },
        abi,
      )
    const overloaded = probed([...scroll.abi, narrower])
    const narrowerFirst = probed([narrower, ...scroll.abi])
    const array = (method: string) => ({
      committedBatches: { handler: { type: 'array', method, length: 3 } },
    })
    const refused = [
      {
        path: 'fields.committedBatches',
        message:
          '"committedBatches" is V1\'s 5-index probe of committedBatches(uint256); only an `array` field reading committedBatches(uint256) may take this name (it replaces the probe with the whole array), and this one reads committedBatches(uint32): write the method as the full fragment of committedBatches(uint256), or pick another name',
      },
    ]

    expect(names(array(probedUint256), overloaded)).toEqual([])
    expect(names(array(narrower), overloaded)).toEqual(refused)
    // V1 resolves a bare name to the first array-keyed function of that
    // prefix in the ABI, so the same field passes or fails with the order.
    expect(names(array('committedBatches'), overloaded)).toEqual([])
    expect(names(array('committedBatches'), narrowerFirst)).toEqual(refused)
  })

  it('protects proxy detector values whose names do not start with a dollar sign', () => {
    const facts = { ...scroll, proxyValues: { GnosisSafe_modules: [] } }
    expect(names({ GnosisSafe_modules: hardcoded }, facts)).toEqual([
      {
        path: 'fields.GnosisSafe_modules',
        message:
          '"GnosisSafe_modules" is produced by the proxy detector; pick another name so this field does not replace it',
      },
    ])
  })
})
