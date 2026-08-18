import { assert } from '../tools/assert.js'
import { pluralize } from './pluralize.js'

const units = ['y', 'mo', 'd', 'h', 'm', 's']
const fullUnits = ['year', 'month', 'day', 'hour', 'minute', 'second']
const secondsInUnit = [365n * 86400n, 30n * 86400n, 86400n, 3600n, 60n, 1n]

export function formatSeconds(
  seconds: number | bigint,
  opts?: { preventRoundingUp?: boolean; fullUnit?: boolean },
): string {
  assert(seconds !== undefined, 'seconds is required')
  assert(
    typeof seconds === 'bigint' || Number.isFinite(Number(seconds)),
    'seconds must be finite',
  )

  const total =
    typeof seconds === 'bigint' ? seconds : BigInt(Math.trunc(Number(seconds)))
  const negative = total < 0n

  let remaining = negative ? -total : total
  const parts = secondsInUnit.map((secondsPerUnit, index) => {
    const count = remaining / secondsPerUnit
    remaining %= secondsPerUnit
    return { count, index }
  })

  const nonZero = parts.filter((part) => part.count > 0n)
  const mostSignificant = nonZero.at(0)
  if (!mostSignificant) {
    return opts?.fullUnit ? '0 seconds' : '0s'
  }

  const shown = opts?.preventRoundingUp
    ? nonZero
    : nonZero.filter((part) => part.index <= mostSignificant.index + 1)

  const formatted = shown
    .map(({ count, index }) =>
      opts?.fullUnit
        ? `${count} ${pluralize(Number(count), fullUnits[index])}`
        : `${count}${units[index]}`,
    )
    .join(' ')

  return negative ? `-${formatted}` : formatted
}
