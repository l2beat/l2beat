import { readFileSync } from 'fs'
import { assert } from '@l2beat/shared-pure'
import { generateAllSchemas } from './generate'

describe('schemas', async () => {
  const schemas = await generateAllSchemas()

  for (const { filepath, schema } of schemas) {
    it(`${filepath} schema should be up to date`, async () => {
      const current = readFileSync(filepath, 'utf8')
      assert(
        current === schema,
        `${filepath} schema is outdated. Run: pnpm generate-schemas`,
      )
    })
  }
})
