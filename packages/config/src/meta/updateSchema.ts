import { writeFileSync } from 'fs'
import { schema } from './schema'

writeFileSync(
  'src/projects/project.schema.json',
  JSON.stringify(schema, null, 2),
)
