import { expect } from 'earl'
import { editProblem, parseWhere, whereProblem } from './checkBlips'

describe(parseWhere.name, () => {
  it('reads the one comparison a where may make', () => {
    expect(parseWhere(['=', '#status', true])).toEqual({
      operator: '=',
      argument: 'status',
      literal: true,
    })
    expect(parseWhere(['!=', '#gameType', 1])).toEqual({
      operator: '!=',
      argument: 'gameType',
      literal: 1,
    })
  })

  it('refuses everything else, including a literal that blip would read as an argument', () => {
    expect(parseWhere(['=', '#status', '#other'])).toEqual(undefined)
    expect(parseWhere(['=', 'status', true])).toEqual(undefined)
    expect(parseWhere(['=', '#config.1', 1])).toEqual(undefined)
    expect(parseWhere(['and', ['=', '#a', 1], ['=', '#b', 2]])).toEqual(
      undefined,
    )
    expect(parseWhere(['=', '#a', 1, 2])).toEqual(undefined)
    expect(parseWhere(true)).toEqual(undefined)
  })
})

describe(whereProblem.name, () => {
  it('passes the two comparison forms and shows both in the message otherwise', () => {
    expect(whereProblem(['=', '#status', true])).toEqual(undefined)
    expect(whereProblem(['!=', '#account', 'eth:0x0'])).toEqual(undefined)
    expect(whereProblem(['>', '#value', 1])).toEqual(
      '`where` must be one comparison of an event argument with a literal: ["=", "#status", true] keeps logs whose `status` is true, ["!=", "#status", true] keeps the others; the argument is written "#name" and the literal is a string, number or boolean. Got [">","#value",1]',
    )
  })
})

describe(editProblem.name, () => {
  it('passes format with a whitelisted caster and get with keys', () => {
    expect(editProblem(['format', 'FormatSeconds'])).toEqual(undefined)
    expect(editProblem(['get', 'owner'])).toEqual(undefined)
    expect(editProblem(['get', 0, 'members'])).toEqual(undefined)
  })

  it('rejects other casters, empty gets and any other operation with one message', () => {
    const message = (got: string) =>
      `\`edit\` must be ["format", "FormatSeconds"] (render seconds as a duration) or ["get", key, …] (keep one part of the value: ["get", "owner"] for an object key, ["get", 0] for an array index); got ${got}`
    expect(editProblem(['format', 'Undecimal'])).toEqual(
      message('["format","Undecimal"]'),
    )
    expect(editProblem(['get'])).toEqual(message('["get"]'))
    expect(editProblem(['pipe', ['get', 'a'], ['length']])).toEqual(
      message('["pipe",["get","a"],["length"]]'),
    )
  })
})
