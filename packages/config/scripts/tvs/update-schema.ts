import * as fs from 'fs'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ProjectTvsConfigSchema } from '../../src/types'

function main() {
  try {
    const schemaWithMeta = z
      .object({ $schema: z.string().optional() })
      .merge(ProjectTvsConfigSchema)

    const schema = zodToJsonSchema(schemaWithMeta)

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
