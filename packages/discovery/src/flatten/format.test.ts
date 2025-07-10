import { expect } from 'earl'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { format } from './format'

describe(format.name, () => {
  it('correctly formats the test file', async () => {
    const [before, after] = await Promise.all([
      readFile(join(__dirname, 'test/Format.before.sol'), 'utf-8'),
      readFile(join(__dirname, 'test/Format.after.sol'), 'utf-8'),
    ])

    const formatted = format(before)
    expect(formatted).toEqual(after)
  })
})
