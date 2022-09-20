import { expect } from 'earljs'
import { readdirSync } from 'fs'
import path from 'path'

describe('migrations', () => {
  it('migrations have consecutive numbering except for 20', () => {
    const migrationsDirectory = path.resolve(
      __dirname,
      '../../../src/peripherals/database/migrations',
    )
    const fileNames = readdirSync(migrationsDirectory).sort()
    for (const [i, fileName] of fileNames.entries()) {
      const number = parseInt(fileName.slice(0, 3))
      // account for a past mistake at migration 20
      const expected = i >= 20 ? i : i + 1
      expect(number).toEqual(expected)
    }
  })
})
