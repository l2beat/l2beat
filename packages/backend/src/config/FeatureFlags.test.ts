import { expect } from 'earl'

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
        expect(flags.isEnabled(item)).toEqual(expected)
      })
    }
  })

  describe(FeatureFlags.prototype.with.name, () => {
    it('returns a new instance with the given item added', () => {
      const flags = new FeatureFlags('foo')
      const newFlags = flags.with('bar')
      expect(newFlags).not.toExactlyEqual(flags)
      expect(newFlags.isEnabled('foo')).toEqual(true)
      expect(newFlags.isEnabled('bar')).toEqual(true)
    })
  })

  describe(FeatureFlags.prototype.getResolved.name, () => {
    it('returns a sorted list of all queries', () => {
      const flags = new FeatureFlags('foo,!foo.bar,baz')
      expect(flags.getResolved()).toEqual([])

      flags.isEnabled('foo')
      flags.isEnabled('foo.bar')
      flags.isEnabled('foo.baz')
      flags.isEnabled('baz')

      expect(flags.getResolved()).toEqual([
        { feature: 'baz', enabled: true },
        { feature: 'foo', enabled: true },
        { feature: 'foo.bar', enabled: false },
        { feature: 'foo.baz', enabled: true },
      ])
    })
  })
})
