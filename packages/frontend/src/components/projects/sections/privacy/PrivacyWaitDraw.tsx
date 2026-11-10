import { useState } from 'react'
import { Button } from '~/components/core/Button'
import { ADVICE, formatWait, getWaitNote } from '~/pages/privacy/adviceUi'

/**
 * Draws a waiting time, uniform over the window the anonymity set counts. A
 * fixed wait is a pattern an analyst subtracts, and people pick random numbers
 * badly. The draw happens on click, in the browser, and is sent nowhere.
 */
export function PrivacyWaitDraw({ windowDays }: { windowDays: number }) {
  const [minutes, setMinutes] = useState<number>()
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <Button
        variant="outline"
        size="sm"
        className="px-3 py-1"
        onClick={() => setMinutes(drawMinutes(windowDays))}
      >
        {minutes === undefined ? ADVICE.drawWaitLabel : ADVICE.redrawWaitLabel}
      </Button>
      {minutes !== undefined && (
        <span className="text-paragraph-15 md:text-paragraph-16">
          <span className="font-bold">{formatWait(minutes)}</span>{' '}
          {ADVICE.waitAfterDeposit}
        </span>
      )}
      <span className="text-paragraph-13 text-secondary">
        {getWaitNote(windowDays)}
      </span>
    </div>
  )
}

/** A uniform minute in [0, windowDays). Rejection sampling keeps it unbiased. */
function drawMinutes(windowDays: number): number {
  const range = windowDays * 1440
  const limit = Math.floor(2 ** 32 / range) * range
  const buffer = new Uint32Array(1)
  let value = limit
  while (value >= limit) {
    crypto.getRandomValues(buffer)
    value = buffer[0] ?? limit
  }
  return value % range
}
