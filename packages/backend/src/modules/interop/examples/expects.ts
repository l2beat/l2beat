import { diffLines } from 'diff'
import type {
  InteropEvent,
  InteropMessage,
  InteropTransfer,
} from '../plugins/types'
import type { ExpectsType } from './core'
import { shapeMatches } from './shapeMatching'

export interface CheckResult {
  success: boolean
  missing: ExpectedShape[]
  unexpected: unknown[]
}

type ExpectedShape = string | Record<string, unknown>

const PASS = '[\x1B[1;32mPASS\x1B[0m]'
const XTRA = '[\x1B[1;34mXTRA\x1B[0m]'
const FAIL = '[\x1B[1;31mFAIL\x1B[0m]'
const MTCH = '[\x1B[1;32mMTCH\x1B[0m]'
const UNMT = '[\x1B[1;33mUNMT\x1B[0m]'

export function checkExpects(
  expects: ExpectsType,
  legacyExpects: {
    events?: string[]
    messages?: (string | { type: string; app?: string })[]
    transfers?: string[]
  },
  result: {
    events: InteropEvent[]
    matchedEventIds: Set<string>
    messages: InteropMessage[]
    transfers: InteropTransfer[]
  },
  verbose: boolean,
): {
  eventsResult: CheckResult
  messagesResult: CheckResult
  transfersResult: CheckResult
} {
  const expectedEvents = expects.events ?? legacyExpects.events ?? []
  const expectedMessages = expects.messages ?? legacyExpects.messages ?? []
  const expectedTransfers = expects.transfers ?? legacyExpects.transfers ?? []

  const eventsResult = checkEvents(
    'Event   ',
    [...expectedEvents],
    result.events,
    result.matchedEventIds,
    verbose,
  )
  const messagesResult = checkTypedWithApp(
    'Message ',
    [...expectedMessages],
    result.messages,
    verbose,
  )
  const transfersResult = checkTypedSimple(
    'Transfer',
    [...expectedTransfers],
    result.transfers,
    verbose,
  )

  return { eventsResult, messagesResult, transfersResult }
}

export function printExpectsResult(
  expects: ExpectsType | undefined,
  results: {
    eventsResult: CheckResult
    messagesResult: CheckResult
    transfersResult: CheckResult
  },
) {
  if (!expects) {
    return
  }

  const hasFailures =
    !results.eventsResult.success ||
    !results.messagesResult.success ||
    !results.transfersResult.success

  if (hasFailures) {
    printExpectsSummary({
      events: results.eventsResult,
      messages: results.messagesResult,
      transfers: results.transfersResult,
    })
  } else {
    const expectedCounts = [
      expects.events?.length || 0,
      expects.messages?.length || 0,
      expects.transfers?.length || 0,
    ]
    const total = expectedCounts.reduce((sum, count) => sum + count, 0)

    console.log(
      `\n\x1B[32m✓ All expects passed\x1B[0m (${total} expectation${total !== 1 ? 's' : ''})`,
    )
  }
}

function checkTypedSimple(
  name: string,
  expected: ExpectedShape[],
  values: InteropTransfer[],
  verbose: boolean,
): CheckResult {
  const normalizedExpected = [...expected]
  const unexpected: unknown[] = []

  for (const value of values) {
    const idx = normalizedExpected.findIndex((e) => matchesShape(value, e))
    if (idx !== -1) {
      normalizedExpected.splice(idx, 1)
    } else {
      unexpected.push(value)
    }
    const tag = idx !== -1 ? PASS : XTRA
    const display = verbose
      ? value
      : `${value.type} (${value.src.event.ctx.chain} → ${value.dst.event.ctx.chain})`
    console.log(tag, name, display)
  }
  for (const exp of normalizedExpected) {
    console.log(FAIL, name, displayExpectedShape(exp))
  }
  return {
    success: normalizedExpected.length === 0,
    missing: normalizedExpected,
    unexpected,
  }
}

function matchesShape(actual: unknown, expected: ExpectedShape): boolean {
  if (typeof expected === 'string') {
    // String format: match only the type
    return (actual as { type: string }).type === expected
  }

  // Object format: use shape matching
  return shapeMatches(actual, expected)
}

function displayExpectedShape(expected: ExpectedShape): string {
  if (typeof expected === 'string') return expected

  // For object format, show type and a hint about other properties
  const type = (expected as Record<string, unknown>).type
  const otherKeys = Object.keys(expected).filter((k) => k !== 'type')

  if (otherKeys.length === 0) {
    return type as string
  }

  return `${type} (+ ${otherKeys.length} properties)`
}

function checkEvents(
  name: string,
  expected: ExpectedShape[],
  events: InteropEvent[],
  matchedEventIds: Set<string>,
  verbose: boolean,
): CheckResult {
  const normalizedExpected = [...expected]
  const unexpected: unknown[] = []

  for (const event of events) {
    const idx = normalizedExpected.findIndex((e) => matchesShape(event, e))
    if (idx !== -1) {
      normalizedExpected.splice(idx, 1)
    } else {
      unexpected.push(event)
    }
    const isMatched = matchedEventIds.has(event.eventId)
    const matchTag = isMatched ? MTCH : UNMT
    const expectedTag = idx !== -1 ? PASS : XTRA
    const display = verbose
      ? event
      : `${event.type} (chain: ${event.ctx.chain})`
    console.log(expectedTag, matchTag, name, display)
  }
  for (const exp of normalizedExpected) {
    console.log(FAIL, name, displayExpectedShape(exp))
  }
  return {
    success: normalizedExpected.length === 0,
    missing: normalizedExpected,
    unexpected,
  }
}

function checkTypedWithApp(
  name: string,
  expected: ExpectedShape[],
  values: InteropMessage[],
  verbose: boolean,
): CheckResult {
  const normalizedExpected = [...expected]
  const unexpected: unknown[] = []

  for (const value of values) {
    const idx = normalizedExpected.findIndex((e) => matchesShape(value, e))
    if (idx !== -1) {
      normalizedExpected.splice(idx, 1)
    } else {
      unexpected.push(value)
    }
    const tag = idx !== -1 ? PASS : XTRA
    const display = verbose
      ? value
      : `${value.type} (app: ${value.app}, ${value.src.ctx.chain} → ${value.dst.ctx.chain})`
    console.log(tag, name, display)
  }
  for (const exp of normalizedExpected) {
    console.log(FAIL, name, displayExpectedShape(exp))
  }
  return {
    success: normalizedExpected.length === 0,
    missing: normalizedExpected,
    unexpected,
  }
}

function printExpectsSummary(results: {
  events: CheckResult
  messages: CheckResult
  transfers: CheckResult
}) {
  console.log('\n' + '='.repeat(80))
  console.log('EXPECTS SUMMARY - FAILURES DETECTED')
  console.log('='.repeat(80))

  const categories = [
    { name: 'Events', result: results.events },
    { name: 'Messages', result: results.messages },
    { name: 'Transfers', result: results.transfers },
  ]

  let totalMissing = 0
  let totalUnexpected = 0

  for (const { result } of categories) {
    totalMissing += result.missing.length
    totalUnexpected += result.unexpected.length
  }

  console.log(
    `\nMissing: \x1B[31m${totalMissing}\x1B[0m | Unexpected: \x1B[33m${totalUnexpected}\x1B[0m`,
  )

  for (const { name, result } of categories) {
    if (result.missing.length === 0 && result.unexpected.length === 0) {
      continue
    }

    console.log(`\n${name}:`)
    console.log('-'.repeat(80))

    // Show diffs when we have both expected and unexpected items
    const showDiff = result.missing.length > 0 && result.unexpected.length > 0

    if (showDiff) {
      for (
        let i = 0;
        i < Math.max(result.missing.length, result.unexpected.length);
        i++
      ) {
        const expected = result.missing[i]
        const actual = result.unexpected[i]

        if (expected && actual) {
          console.log('\n  Comparison ' + (i + 1) + ':')
          printDiff(expected, actual)
        } else if (expected) {
          console.log('\n  Missing (Expected but not found):')
          console.log(formatJson(expected, '\x1B[31m'))
        } else if (actual) {
          console.log('\n  Unexpected (Received but not expected):')
          console.log(formatJson(actual, '\x1B[33m'))
        }
      }
    } else {
      if (result.missing.length > 0) {
        console.log('\n  Missing (Expected but not found):')
        for (const expected of result.missing) {
          console.log(formatJson(expected, '\x1B[31m'))
        }
      }

      if (result.unexpected.length > 0) {
        console.log('\n  Unexpected (Received but not expected):')
        for (const actual of result.unexpected) {
          console.log(formatJson(actual, '\x1B[33m'))
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80) + '\n')
}

function formatJson(value: unknown, color?: string): string {
  const json = JSON.stringify(
    value,
    (_, v) => (typeof v === 'bigint' ? v.toString() : v),
    2,
  )
  const lines = json.split('\n').map((line) => '    ' + line)

  if (color) {
    return lines.map((line) => color + line + '\x1B[0m').join('\n')
  }
  return lines.join('\n')
}

function printDiff(expected: unknown, actual: unknown) {
  const expectedStr = formatJson(expected).trim()
  const actualStr = formatJson(actual).trim()

  const diff = diffLines(expectedStr, actualStr)

  for (const part of diff) {
    const lines = part.value.split('\n').filter((l: string) => l.trim())

    if (part.added) {
      // Green text for additions (received/actual in diff)
      for (const line of lines) {
        console.log(`\x1B[32m+ ${line}\x1B[0m`)
      }
    } else if (part.removed) {
      // Red text for removals (expected/missing in diff)
      for (const line of lines) {
        console.log(`\x1B[31m- ${line}\x1B[0m`)
      }
    } else {
      // Context lines in gray
      for (const line of lines) {
        console.log(`\x1B[90m  ${line}\x1B[0m`)
      }
    }
  }
}
