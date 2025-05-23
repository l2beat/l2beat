import * as fs from 'fs'
import { z } from 'zod/v4'
import { ProjectTvsConfigSchema } from '../../src/types'

function main() {
  try {
    const schemaWithMeta = z
      .object({ $schema: z.string().optional() })
      .merge(ProjectTvsConfigSchema)

    const schema = z.toJSONSchema(schemaWithMeta, { unrepresentable: 'any' })

    fs.writeFileSync(
      './src/tvs/json/schema/tvs-config-schema.json',
      JSON.stringify(schema, null, 2),
    )

    console.log('Schema generated successfully!')
  } catch (e) {
    console.error('Error generating schema:', e)
  }
}

main()
