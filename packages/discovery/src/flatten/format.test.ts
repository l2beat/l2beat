import { expect } from 'earl'
import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { format } from './format.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
