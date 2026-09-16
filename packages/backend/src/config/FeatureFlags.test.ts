import { describe, expect, it } from 'vitest'

import { FeatureFlags } from './FeatureFlags'

describe(FeatureFlags.name, () => {
  describe(FeatureFlags.prototype.isEnabled.name, () => {
    const testCases: [string, string, boolean][] = [
      ['', 'foo', false],
      ['', 'foo.bar', false],
      ['foo', 'foo', true],
      ['foo', 'foo.bar', true],
      ['foo', 'bar', false],
      ['foo,bar', 'bar.baz', true],
      ['foo,bar', 'bar.baz', true],
      ['*', 'foo', true],
      ['*,!foo', 'foo', false],
      ['foo,!foo.*,foo.bar', 'foo', true],
      ['foo,!foo.*,foo.bar', 'foo.bar', true],
      ['foo,!foo.*,foo.bar', 'foo.baz', false],
      ['foo,!foo.bar', 'foo', true],
      ['foo,!foo.bar', 'foo.bar', false],
      ['foo,!foo.bar', 'foo.baz', true],
      ['foo,!foo', 'foo', false],
      ['!foo,foo', 'foo', false],
      ['!foo,foo.bar', 'foo', false],
      ['!foo,foo.bar', 'foo.bar', true],
      ['foo', 'foo.bar.baz', true],
    ]

    for (const [input, item, expected] of testCases) {
      it(`${item} is ${expected.toString()} for ${input}`, () => {
        const flags = new FeatureFlags(input)
        expect(flags.isEnabled(item)).toStrictEqual(expected)
      })
    }

    it('can be called with multiple arguments', () => {
      const flags = new FeatureFlags('foo,!foo.baz')
      expect(flags.isEnabled('foo', 'bar')).toStrictEqual(true)
      expect(flags.isEnabled('foo', 'baz')).toStrictEqual(false)
    })
  })

  describe(FeatureFlags.prototype.append.name, () => {
    it('returns a new instance with the given item added', () => {
      const flags = new FeatureFlags('foo')
      const newFlags = flags.append('bar')
      expect(newFlags).not.toBe(flags)
      expect(newFlags.isEnabled('foo')).toStrictEqual(true)
      expect(newFlags.isEnabled('bar')).toStrictEqual(true)
    })
  })

  describe(FeatureFlags.prototype.getResolved.name, () => {
    it('returns a sorted list of all queries', () => {
      const flags = new FeatureFlags('bbb,!bbb.xxx,aaa,ccc')

      flags.isEnabled('bbb')
      flags.isEnabled('bbb.xxx')
      flags.isEnabled('bbb.yyy')
      flags.isEnabled('ccc.zzz')

      expect(flags.getResolved()).toStrictEqual([
        { feature: 'aaa', enabled: true, used: false },
        { feature: 'bbb', enabled: true, used: true },
        { feature: 'bbb.xxx', enabled: false, used: true },
        { feature: 'bbb.yyy', enabled: true, used: true },
        { feature: 'ccc', enabled: true, used: false },
        { feature: 'ccc.zzz', enabled: true, used: true },
      ])
    })

    it('ignores star queries', () => {
      const flags = new FeatureFlags('*,aaa.*,!bbb.*')

      expect(flags.getResolved()).toStrictEqual([])
    })
  })
})
