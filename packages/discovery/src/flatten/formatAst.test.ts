import { join } from 'path'
import { parse } from '@mradomski/fast-solidity-parser'
import { expect } from 'earl'
import { readFile } from 'fs/promises'
import { formatAst } from './formatAst'

describe(formatAst.name, () => {
  it('correctly formats the test file', async () => {
    const [before, after] = await Promise.all([
      readFile(join(__dirname, 'test/Format.before.sol'), 'utf-8'),
      readFile(join(__dirname, 'test/Format.after.sol'), 'utf-8'),
    ])

    const parsed = parse(before)
    const formatted = formatAst(parsed)

    expect(formatted).toEqual(after)
  })
})
