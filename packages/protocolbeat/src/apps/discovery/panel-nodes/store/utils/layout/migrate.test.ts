import { describe, expect, it } from 'vitest'
import { CURRENT_LAYOUT_VERSION, migrateLayout } from './migrate'

describe(migrateLayout.name, () => {
  it('accepts current-version payload as-is', () => {
    const input = {
      version: 4 as const,
      projectId: 'p',
      metadata: {
        description: 'Useful for audits.',
      },
      locations: { a: { x: 1, y: 2 } },
      colors: { a: 3 },
      hiddenFields: { a: ['f'] },
      compressedRows: { a: ['$members'] },
      hiddenNodes: ['b'],
      groups: [
        {
          id: 'group:1',
          name: 'Group',
          color: 0,
          opened: false,
          box: { x: 0, y: 0 },
          members: ['a'],
        },
      ],
    }
    const result = migrateLayout(input)
    if (!result.ok) throw new Error('expected success')
    expect(result.layout).toStrictEqual(input)
    expect(result.migratedFrom).toStrictEqual(4)
  })

  it('migrates v3 payloads to current with no groups', () => {
    const result = migrateLayout({
      version: 3,
      projectId: 'p',
      locations: { a: { x: 0, y: 0 } },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.migratedFrom).toStrictEqual(3)
    expect(result.layout.version).toStrictEqual(CURRENT_LAYOUT_VERSION)
    expect(result.layout.groups).toStrictEqual(undefined)
  })

  it('treats unversioned payload as v1 and migrates to current', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 0, y: 0 } },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.migratedFrom).toStrictEqual(1)
    expect(result.layout.version).toStrictEqual(CURRENT_LAYOUT_VERSION)
    expect(result.layout.projectId).toStrictEqual('p')
  })

  it('drops legacy oklch color objects instead of forcing squash color 0', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 0, y: 0 }, b: { x: 1, y: 1 } },
      colors: { a: { l: 0.5, c: 0.1, h: 200 }, b: 4 },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.layout.colors).toStrictEqual({ b: 4 })
  })

  it('omits colors when a v1 layout only contains legacy color objects', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 0, y: 0 } },
      colors: { a: { l: 0.5, c: 0.1, h: 200 } },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.layout.colors).toStrictEqual(undefined)
  })

  it('migrates v2 payloads to current without inventing metadata', () => {
    const result = migrateLayout({
      version: 2,
      projectId: 'p',
      locations: { a: { x: 0, y: 0 } },
      colors: { a: 1 },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.migratedFrom).toStrictEqual(2)
    expect(result.layout.version).toStrictEqual(CURRENT_LAYOUT_VERSION)
    expect(result.layout.metadata).toStrictEqual(undefined)
    expect(result.layout.colors).toStrictEqual({ a: 1 })
  })

  it('refuses payloads from a newer version with too-new reason', () => {
    const result = migrateLayout({
      version: CURRENT_LAYOUT_VERSION + 1,
      projectId: 'p',
      locations: {},
    })
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toStrictEqual('too-new')
  })

  it('refuses payloads that do not match any version schema', () => {
    const result = migrateLayout({ projectId: 'p' })
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toStrictEqual('invalid')
  })

  it('refuses non-object input', () => {
    expect(migrateLayout(null).ok).toStrictEqual(false)
    expect(migrateLayout('not-a-layout').ok).toStrictEqual(false)
    expect(migrateLayout(42).ok).toStrictEqual(false)
  })

  it('refuses non-integer version values', () => {
    const result = migrateLayout({
      version: 1.5,
      projectId: 'p',
      locations: {},
    })
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toStrictEqual('invalid')
  })

  it('preserves locations, hiddenFields, hiddenNodes through migration', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 1, y: 2, width: 100 } },
      hiddenFields: { a: ['f1', 'f2'] },
      hiddenNodes: ['z'],
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.layout.locations).toStrictEqual({
      a: { x: 1, y: 2, width: 100 },
    })
    expect(result.layout.hiddenFields).toStrictEqual({ a: ['f1', 'f2'] })
    expect(result.layout.hiddenNodes).toStrictEqual(['z'])
  })
})
