import { toJsonSchema } from '@l2beat/validate'
import * as fs from 'fs'
import { ProjectTvsConfigSchema } from '../../src/types'

function main() {
  try {
    const schema = toJsonSchema(ProjectTvsConfigSchema)

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
