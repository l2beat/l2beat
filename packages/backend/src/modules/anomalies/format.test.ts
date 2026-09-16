import { describe, expect, it } from 'vitest'
import { formatDuration } from './format'

describe(formatDuration.name, () => {
  it('should format date', async () => {
    const seconds = 17
    const minutes = 35
    const hours = 7
    const days = 2

    expect(
      formatDuration(
        days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds + 0.1234,
      ),
    ).toStrictEqual(`${days} days ${hours} hours`)

    expect(
      formatDuration(hours * 60 * 60 + minutes * 60 + seconds + 0.1234),
    ).toStrictEqual(`${hours} hours ${minutes} minutes`)

    expect(formatDuration(minutes * 60 + seconds + 0.1234)).toStrictEqual(
      `${minutes} minutes ${seconds} seconds`,
    )

    expect(formatDuration(seconds + 0.1234)).toStrictEqual(`${seconds} seconds`)
  })
})
