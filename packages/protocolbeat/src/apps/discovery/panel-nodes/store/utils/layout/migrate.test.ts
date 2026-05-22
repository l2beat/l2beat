import { expect } from 'earl'
import { CURRENT_LAYOUT_VERSION, migrateLayout } from './migrate'

describe(migrateLayout.name, () => {
  it('accepts current-version payload as-is', () => {
    const input = {
      version: 2 as const,
      projectId: 'p',
      locations: { a: { x: 1, y: 2 } },
      colors: { a: 3 },
      hiddenFields: { a: ['f'] },
      hiddenNodes: ['b'],
    }
    const result = migrateLayout(input)
    if (!result.ok) throw new Error('expected success')
    expect(result.layout).toEqual(input)
    expect(result.migratedFrom).toEqual(2)
  })

  it('treats unversioned payload as v1 and migrates to current', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 0, y: 0 } },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.migratedFrom).toEqual(1)
    expect(result.layout.version).toEqual(CURRENT_LAYOUT_VERSION)
    expect(result.layout.projectId).toEqual('p')
  })

  it('drops legacy oklch color objects instead of forcing squash color 0', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 0, y: 0 }, b: { x: 1, y: 1 } },
      colors: { a: { l: 0.5, c: 0.1, h: 200 }, b: 4 },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.layout.colors).toEqual({ b: 4 })
  })

  it('omits colors when a v1 layout only contains legacy color objects', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 0, y: 0 } },
      colors: { a: { l: 0.5, c: 0.1, h: 200 } },
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.layout.colors).toEqual(undefined)
  })

  it('refuses payloads from a newer version with too-new reason', () => {
    const result = migrateLayout({
      version: CURRENT_LAYOUT_VERSION + 1,
      projectId: 'p',
      locations: {},
    })
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toEqual('too-new')
  })

  it('refuses payloads that do not match any version schema', () => {
    const result = migrateLayout({ projectId: 'p' })
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toEqual('invalid')
  })

  it('refuses non-object input', () => {
    expect(migrateLayout(null).ok).toEqual(false)
    expect(migrateLayout('not-a-layout').ok).toEqual(false)
    expect(migrateLayout(42).ok).toEqual(false)
  })

  it('refuses non-integer version values', () => {
    const result = migrateLayout({
      version: 1.5,
      projectId: 'p',
      locations: {},
    })
    if (result.ok) throw new Error('expected failure')
    expect(result.reason).toEqual('invalid')
  })

  it('preserves locations, hiddenFields, hiddenNodes through migration', () => {
    const result = migrateLayout({
      projectId: 'p',
      locations: { a: { x: 1, y: 2, width: 100 } },
      hiddenFields: { a: ['f1', 'f2'] },
      hiddenNodes: ['z'],
    })
    if (!result.ok) throw new Error('expected success')
    expect(result.layout.locations).toEqual({ a: { x: 1, y: 2, width: 100 } })
    expect(result.layout.hiddenFields).toEqual({ a: ['f1', 'f2'] })
    expect(result.layout.hiddenNodes).toEqual(['z'])
  })
})
