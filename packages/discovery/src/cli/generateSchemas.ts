import { command } from 'cmd-ts'
import { writeFileSync } from 'fs'
import { generateAllSchemas } from '../schemas/generate'

export const GenerateSchemasCommand = command({
  name: 'generate-schemas',
  args: {},
  handler: () => {
    const schemas = generateAllSchemas()
    for (const { filepath, schema } of schemas) {
      writeFileSync(filepath, schema)
    }
  },
})
