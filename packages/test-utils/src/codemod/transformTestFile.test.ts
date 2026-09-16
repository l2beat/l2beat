import { describe, expect, it } from 'vitest'
import { transformTestFile } from './transformTestFile.js'

/**
 * Methodology: each case feeds a minimal but syntactically complete file
 * through the transform and asserts on the emitted text, because the value of
 * the codemod is the exact text it produces, not its internal structure.
 */
describe(transformTestFile.name, () => {
  describe('imports', () => {
    it('lists exactly the runner API the file uses, sorted', () => {
      const output = run(`
        import { expect, mockFn } from 'earl'
        describe('x', () => {
          beforeEach(() => {})
          it('y', () => {
            expect(mockFn().returns(1)()).toEqual(1)
          })
        })
      `)

      expect(output).toContain(
        "import { beforeEach, describe, expect, it, vi } from 'vitest'",
      )
      expect(output).not.toContain('earl')
    })

    it('folds an explicit mocha import into the vitest one', () => {
      const output = run(`
        import { expect } from 'earl'
        import { describe } from 'mocha'
        describe('x', () => {
          it('y', () => {
            expect(1).toEqual(1)
          })
        })
      `)

      expect(output).toContain("import { describe, expect, it } from 'vitest'")
      expect(output).not.toContain("from 'mocha'")
    })

    it('points mockObject at the shared helper', () => {
      const output = run(`
        import { expect, type MockObject, mockObject } from 'earl'
        const x: MockObject<Date> = mockObject<Date>({})
        expect(x).toEqual(x)
      `)

      expect(output).toContain(
        "import { type MockObject, mockObject } from '@l2beat/test-utils'",
      )
    })
  })

  describe('mocha hooks', () => {
    it('maps before/after onto the once-per-suite vitest hooks', () => {
      const output = run(`
        import { expect } from 'earl'
        before(() => {})
        after(() => {})
        expect(1).toEqual(1)
      `)

      expect(output).toContain('beforeAll(() => {})')
      expect(output).toContain('afterAll(() => {})')
      expect(output).toContain(
        "import { afterAll, beforeAll, expect } from 'vitest'",
      )
    })
  })

  describe('shadowed names', () => {
    it('does not import a runner global the file declares itself', () => {
      const output = run(`
        import { expect } from 'earl'
        const before = { value: 1 }
        const after = { value: 2 }
        it('changes the value', () => {
          expect(after).toEqual(before)
        })
      `)

      expect(output).toContain("import { expect, it } from 'vitest'")
      expect(output).toContain('const before = { value: 1 }')
    })
  })

  describe('mock functions', () => {
    it('maps the whole earl MockFunction chain', () => {
      const output = run(`
        import { mockFn } from 'earl'
        const a = mockFn().resolvesTo(1)
        const b = mockFn().resolvesToOnce(1)
        const c = mockFn().rejectsWith(new Error('x'))
        const d = mockFn().rejectsWithOnce(new Error('x'))
        const e = mockFn().returns(1)
        const f = mockFn().returnsOnce(1)
        const g = mockFn().executes((x: number) => x)
        const h = mockFn().executesOnce((x: number) => x)
        const i = mockFn((x: number) => x)
      `)

      expect(output).toContain('vi.fn().mockResolvedValue(1)')
      expect(output).toContain('vi.fn().mockResolvedValueOnce(1)')
      expect(output).toContain("vi.fn().mockRejectedValue(new Error('x'))")
      expect(output).toContain("vi.fn().mockRejectedValueOnce(new Error('x'))")
      expect(output).toContain('vi.fn().mockReturnValue(1)')
      expect(output).toContain('vi.fn().mockReturnValueOnce(1)')
      expect(output).toContain('vi.fn().mockImplementation((x: number) => x)')
      expect(output).toContain(
        'vi.fn().mockImplementationOnce((x: number) => x)',
      )
      expect(output).toContain('vi.fn((x: number) => x)')
    })

    it('turns throws into an implementation, which is all vitest offers', () => {
      const output = run(`
        import { mockFn } from 'earl'
        const a = mockFn().throws(new Error('boom'))
      `)

      expect(output).toContain(
        "vi.fn().mockImplementation(() => { throw new Error('boom') })",
      )
    })

    it('keeps the generic argument, which vitest spells the same way', () => {
      const output = run(`
        import { mockFn } from 'earl'
        const a = mockFn<(x: number) => string>()
      `)

      expect(output).toContain('vi.fn<(x: number) => string>()')
    })

    it('leaves returns() alone on something that is not a mock', () => {
      const output = run(`
        import { expect } from 'earl'
        expect(builder.returns(1)).toEqual(1)
      `)

      expect(output).toContain('builder.returns(1)')
    })
  })

  describe('matchers', () => {
    it('tightens toEqual to toStrictEqual to keep earl semantics', () => {
      expect(run(matcher('toEqual({ a: 1 })'))).toContain(
        'toStrictEqual({ a: 1 })',
      )
    })

    it('maps the earl-only validators', () => {
      expect(run(matcher('toHaveSubset({ a: 1 })'))).toContain(
        'toMatchObject({ a: 1 })',
      )
      expect(run(matcher('toExactlyEqual(x)'))).toContain('toBe(x)')
      expect(run(matcher('toMatchRegex(/a/)'))).toContain('toMatch(/a/)')
      expect(run(matcher('toHaveBeenOnlyCalledWith(1)'))).toContain(
        'toHaveBeenCalledExactlyOnceWith(1)',
      )
      expect(run(matcher('toBeEmpty()'))).toContain('toHaveLength(0)')
      expect(run(matcher('toBeA(String)'))).toContain("toBeTypeOf('string')")
      expect(run(matcher('toBeA(UnixTime)'))).toContain(
        'toBeInstanceOf(UnixTime)',
      )
    })

    it('keeps toBeNullish exact by moving the check into the subject', () => {
      expect(run(matcher('toBeNullish()'))).toContain(
        'expect(subject == null).toBe(true)',
      )
      expect(run(matcher('not.toBeNullish()'))).toContain(
        'expect(subject == null).toBe(false)',
      )
    })

    it('picks toContain only when the item is a primitive literal', () => {
      expect(run(matcher("toInclude('a')"))).toContain("toContain('a')")
      expect(run(matcher('toInclude(item)'))).toContain('toContainEqual(item)')
    })

    it('asserts a multi-item toInclude against the whole subject', () => {
      const output = run(matcher("toInclude('a', 'b')"))

      expect(output).toContain("toEqual(expect.arrayContaining(['a', 'b']))")
    })

    it('reports the toContainEqual guess for review', () => {
      const { reviews } = transformTestFile('a.ts', matcher('toInclude(item)'))

      expect(reviews).toHaveLength(1)
      expect(reviews[0]?.note).toContain('toContainEqual')
    })

    it('uses the custom matcher when a class and a message are asserted', () => {
      const result = transformTestFile(
        'a.ts',
        matcher("toThrow(TypeError, 'nope')"),
      )

      expect(result.text).toContain("toThrowWithMessage(TypeError, 'nope')")
      expect(result.usesTestUtils).toEqual(true)
    })

    it('leaves a single-argument toThrow to vitest', () => {
      expect(run(matcher('toThrow(TypeError)'))).toContain('toThrow(TypeError)')
    })

    it('routes rejection assertions through the rejects modifier', () => {
      expect(run(matcher("toBeRejectedWith(TypeError, 'nope')"))).toContain(
        "rejects.toThrowWithMessage(TypeError, 'nope')",
      )
      expect(run(matcher("toBeRejectedWith('nope')"))).toContain(
        "rejects.toThrow('nope')",
      )
      expect(run(matcher('toBeRejected()'))).toContain('rejects.toThrow()')
    })

    it('moves the modifier in front of a negated rejection', () => {
      expect(run(matcher('not.toBeRejected()'))).toContain(
        'expect(subject).resolves.not.toThrow()',
      )
      expect(run(matcher("not.toBeRejectedWith(TypeError, 'nope')"))).toContain(
        "expect(subject).resolves.not.toThrowWithMessage(TypeError, 'nope')",
      )
    })

    it('maps the asymmetric matchers', () => {
      expect(run(matcher('toEqual(expect.a(String))'))).toContain(
        'expect.any(String)',
      )
      expect(run(matcher('toEqual(expect.subset({ a: 1 }))'))).toContain(
        'expect.objectContaining({ a: 1 })',
      )
      expect(run(matcher('toEqual(expect.includes(1))'))).toContain(
        'expect.arrayContaining([1])',
      )
    })

    it('does not touch methods that merely look like matchers', () => {
      const output = run(`
        import { expect } from 'earl'
        expect(timestamp.toStartOf('day')).toEqual(x.toNext('hour'))
      `)

      expect(output).toContain("timestamp.toStartOf('day')")
      expect(output).toContain("x.toNext('hour')")
    })
  })

  describe('recorded calls', () => {
    it('drops the args hop that vitest does not have', () => {
      const output = run(`
        import { expect, mockFn } from 'earl'
        const fn = mockFn()
        expect(fn.calls[0]?.args).toEqual([1])
        expect(fn.calls[0].args).toEqual([1])
        expect(fn.calls[0]!.args).toEqual([1])
        expect(fn.calls.length).toEqual(1)
      `)

      expect(output).toContain('fn.mock.calls[0]).toStrictEqual([1])')
      expect(output).toContain('fn.mock.calls[0]!).toStrictEqual([1])')
      expect(output).toContain('fn.mock.calls.length')
    })

    it('trusts a cast when that is the only sign the receiver is a mock', () => {
      const output = run(`
        import { expect, mockFn } from 'earl'
        const handler = (app.get as ReturnType<typeof mockFn>).calls[0].args[1]
        expect(handler).toEqual(1)
      `)

      expect(output).toContain(
        '(app.get as ReturnType<typeof vi.fn>).mock.calls[0][1]',
      )
    })

    it('drops the args hop when the history goes through a local', () => {
      const output = run(`
        import { expect, mockFn } from 'earl'
        const calls = (app.get as ReturnType<typeof mockFn>).calls
        expect(calls[calls.length - 1]?.args[1]).toEqual(1)
      `)

      expect(output).toContain('calls[calls.length - 1]?.[1]')
    })

    it('leaves calls on something that is not a mock', () => {
      const output = run(`
        import { expect } from 'earl'
        expect(schedule.calls.length).toEqual(1)
      `)

      expect(output).toContain('schedule.calls.length')
    })
  })

  describe('leftovers', () => {
    it('reports what it could not rewrite, with a line and a snippet', () => {
      const { blockers } = transformTestFile(
        'a.ts',
        [
          "import { expect, mockFn } from 'earl'",
          'const a = mockFn().given(1).returnsOnce(2)',
          'it("slow", async function () { this.timeout(5000) })',
        ].join('\n'),
      )

      expect(blockers.map((b) => b.line)).toEqual([2, 3])
      expect(blockers[0]?.note).toContain('given')
      expect(blockers[1]?.note).toContain('mocha timeout')
    })

    it('reports a timeout chained onto the test rather than on this', () => {
      const { blockers } = transformTestFile(
        'a.ts',
        [
          "import { expect } from 'earl'",
          'it("slow", async () => { expect(1).toEqual(1) }).timeout(15_000)',
        ].join('\n'),
      )

      expect(blockers[0]?.note).toContain('mocha timeout')
    })

    it('finds nothing in a file it fully understands', () => {
      const { blockers } = transformTestFile('a.ts', matcher('toEqual(1)'))

      expect(blockers).toEqual([])
    })
  })
})

function run(source: string): string {
  return transformTestFile('a.ts', dedent(source)).text
}

function matcher(assertion: string): string {
  return `import { expect } from 'earl'\nexpect(subject).${assertion}\n`
}

function dedent(source: string): string {
  return source
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n')
    .trim()
}
