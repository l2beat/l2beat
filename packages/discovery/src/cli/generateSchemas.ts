import { writeFileSync } from 'fs'
import { command } from 'cmd-ts'
import { generateAllSchemas } from '../schemas/generate'

export const GenerateSchemasCommand = command({
  name: 'generate-schemas',
  args: {},
  handler: async () => {
    const schemas = await generateAllSchemas()
    for (const { filepath, schema } of schemas) {
      writeFileSync(filepath, schema)
    }
  },
})
