import { v } from '@l2beat/validate'
import { execSync } from 'child_process'
import { hashJson } from '../../../shared/build'

const TaskSchema = v.object({
  hash: v.string(),
})

const TurboOutputSchema = v.object({
  globalCacheInputs: v.object({
    hashOfExternalDependencies: v.string(),
    hashOfInternalDependencies: v.string(),
  }),
  packages: v.array(v.literal('@l2beat/dal')),
  tasks: v.array(TaskSchema),
})

export function getPackageHash() {
  const output = execSync('turbo run build --dry=json')
  const json = JSON.parse(output.toString())

  const validated = TurboOutputSchema.parse(json)

  return hashJson(validated)
}
