import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ColorConfig, ColorContract } from './ColorConfig'
import { makeEntryColorConfig, mergeColorContract } from './colorUtils'

const ADDRESS = ChainSpecificAddress(
  'eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
)

describe(mergeColorContract.name, () => {
  it('lets the override win on set scalars and keeps the base otherwise', () => {
    const base = ColorContract.parse({
      displayName: 'Base',
      description: 'base description',
      critical: true,
    })
    const override = ColorContract.parse({ description: 'override' })

    const result = mergeColorContract(base, override)

    expect(result.displayName).toEqual('Base')
    expect(result.description).toEqual('override')
    expect(result.critical).toEqual(true)
  })

  it('replaces references instead of merging them by index', () => {
    const base = ColorContract.parse({
      references: [
        { text: 'Docs', href: 'https://a.example/docs' },
        { text: 'Audit', href: 'https://a.example/audit' },
      ],
    })
    const override = ColorContract.parse({
      references: [{ text: 'Other', href: 'https://a.example/other' }],
    })

    const result = mergeColorContract(base, override)

    expect(result.references).toEqual([
      { text: 'Other', href: 'https://a.example/other' },
    ])
  })

  it('merges fields by name and replaces a field type wholesale', () => {
    const base = ColorContract.parse({
      fields: {
        owner: { severity: 'HIGH', type: ['PERMISSION', 'CODE_CHANGE'] },
        paused: { severity: 'LOW' },
      },
    })
    const override = ColorContract.parse({
      fields: {
        owner: { description: 'the owner', type: ['L2'] },
        extra: { severity: 'MEDIUM' },
      },
    })

    const result = mergeColorContract(base, override)

    expect(result.fields).toEqual({
      owner: { severity: 'HIGH', description: 'the owner', type: ['L2'] },
      paused: { severity: 'LOW' },
      extra: { severity: 'MEDIUM' },
    })
  })

  it('does not mutate either input', () => {
    const base = ColorContract.parse({
      fields: { owner: { severity: 'HIGH' } },
      manualSourcePaths: { a: 'https://a' },
    })
    const override = ColorContract.parse({
      fields: { owner: { description: 'x' } },
      manualSourcePaths: { b: 'https://b' },
    })
    const baseBefore = structuredClone(base)
    const overrideBefore = structuredClone(override)

    mergeColorContract(base, override)

    expect(base).toEqual(baseBefore)
    expect(override).toEqual(overrideBefore)
  })
})

describe(makeEntryColorConfig.name, () => {
  it('layers categories as template, then project, then override', () => {
    const template = ColorContract.parse({
      category: 'gov',
      categories: {
        gov: { name: 'Template', priority: 1 },
        core: { name: 'Core', priority: 2 },
      },
    })
    const config = ColorConfig.parse({
      categories: { gov: { name: 'Project', priority: 3 } },
      overrides: {
        [ADDRESS.toString()]: {
          categories: { core: { name: 'Override', priority: 4 } },
        },
      },
    })

    const result = makeEntryColorConfig(config, ADDRESS, template)

    expect(result.categories).toEqual({
      gov: { name: 'Project', priority: 3 },
      core: { name: 'Override', priority: 4 },
    })
  })

  it('does not leak override categories into the project config', () => {
    const config = ColorConfig.parse({
      categories: { gov: { name: 'Gov', priority: 1 } },
      overrides: {
        [ADDRESS.toString()]: {
          categories: { extra: { name: 'Extra', priority: 2 } },
        },
      },
    })

    makeEntryColorConfig(config, ADDRESS, ColorContract.parse({}))

    expect(config.categories).toEqual({ gov: { name: 'Gov', priority: 1 } })
  })

  it('takes the name from the project config names', () => {
    const config = ColorConfig.parse({
      names: { [ADDRESS.toString()]: 'Named' },
    })

    const result = makeEntryColorConfig(
      config,
      ADDRESS,
      ColorContract.parse({ displayName: 'Template' }),
    )

    expect(result.name).toEqual('Named')
    expect(result.displayName).toEqual('Template')
  })
})
