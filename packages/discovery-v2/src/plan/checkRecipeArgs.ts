/**
 * Cross-checks between a logs step's recipe arguments and the events it
 * fetches.
 *
 * Recipe argument schemas only know that `key` is a string; whether that
 * string names an argument of the fetched events is a fact about the ABI.
 * Checking it here means a typo in `key`, a rule naming an event the step
 * does not fetch, or a `when.equals` literal of the wrong type is reported
 * with its path instead of silently producing an empty set at run time.
 *
 * The walk is by convention over the library's shared vocabulary: rule
 * arrays `add`, `remove`, `set` hold `{ event, when }`; `events` lists event
 * names; `key`, `value`, `groupBy` name arguments of every fetched event; a
 * top-level `when` (count@1) applies to every listed event.
 */
import type { utils } from 'ethers'
import { checkLiteral } from '../abi/literals'
import { type Findings, joinPath } from './Finding'

const RULE_ARRAYS = ['add', 'remove', 'set'] as const
const ARGUMENT_NAMES = ['key', 'value', 'groupBy'] as const

export function checkRecipeArgs(
  args: Record<string, unknown>,
  fetched: readonly utils.EventFragment[],
  argsPath: string,
  findings: Findings,
): void {
  const byName = new Map(fetched.map((event) => [event.name, event]))
  const fetchedNames = [...byName.keys()]

  const eventOrReport = (name: unknown, path: string) => {
    if (typeof name !== 'string') {
      return undefined
    }
    const event = byName.get(name)
    if (event === undefined) {
      findings.error(
        path,
        `event "${name}" is not fetched by this step; fetch.events lists ${fetchedNames.join(', ')}`,
      )
    }
    return event
  }

  for (const name of ARGUMENT_NAMES) {
    const argument = args[name]
    if (typeof argument !== 'string') {
      continue
    }
    for (const event of fetched) {
      if (!hasInput(event, argument)) {
        findings.error(
          joinPath(argsPath, name),
          `event ${event.name} has no argument "${argument}"; its arguments are ${listInputs(event)}`,
        )
      }
    }
  }

  for (const name of RULE_ARRAYS) {
    const rules = args[name]
    if (!Array.isArray(rules)) {
      continue
    }
    rules.forEach((rule, i) => {
      if (!isObject(rule)) {
        return
      }
      const rulePath = `${joinPath(argsPath, name)}[${i}]`
      const event = eventOrReport(rule.event, joinPath(rulePath, 'event'))
      if (event !== undefined) {
        checkWhen(rule.when, [event], joinPath(rulePath, 'when'), findings)
      }
    })
  }

  const listed = args.events
  const listedEvents: utils.EventFragment[] = []
  if (Array.isArray(listed)) {
    listed.forEach((name, i) => {
      const event = eventOrReport(name, `${joinPath(argsPath, 'events')}[${i}]`)
      if (event !== undefined) {
        listedEvents.push(event)
      }
    })
  }
  checkWhen(
    args.when,
    listedEvents.length > 0 ? listedEvents : fetched,
    joinPath(argsPath, 'when'),
    findings,
  )
}

function checkWhen(
  when: unknown,
  events: readonly utils.EventFragment[],
  whenPath: string,
  findings: Findings,
): void {
  if (!isObject(when) || typeof when.arg !== 'string') {
    return
  }
  for (const event of events) {
    const input = event.inputs.find((param) => param.name === when.arg)
    if (input === undefined) {
      findings.error(
        joinPath(whenPath, 'arg'),
        `event ${event.name} has no argument "${when.arg}"; its arguments are ${listInputs(event)}`,
      )
      continue
    }
    const problem = checkLiteral(when.equals, input)
    if (problem !== undefined) {
      findings.error(
        joinPath(whenPath, 'equals'),
        `${event.name}.${when.arg} is ${input.format()}: ${problem}`,
      )
    }
  }
}

function hasInput(event: utils.EventFragment, name: string): boolean {
  return event.inputs.some((param) => param.name === name)
}

function listInputs(event: utils.EventFragment): string {
  const names = event.inputs.map((param, i) => param.name || `_${i}`)
  return names.length === 0 ? '(none)' : names.join(', ')
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
