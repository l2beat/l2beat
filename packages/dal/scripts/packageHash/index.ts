import { v } from '@l2beat/validate'
import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { writeFileSync } from 'fs'

const TaskSchema = v.object({
  hash: v.string(),
})

type TurboOutputSchema = v.infer<typeof TurboOutputSchema>
const TurboOutputSchema = v.object({
  globalCacheInputs: v.object({
    hashOfExternalDependencies: v.string(),
    hashOfInternalDependencies: v.string(),
  }),
  packages: v.array(v.literal('@l2beat/dal')),
  tasks: v.array(TaskSchema),
})

main()

function main() {
  const hash = getPackageHash()

  writeFileSync('./build/packageHash.txt', hash)
}

function getPackageHash() {
  const output = execSync(
    'pnpm turbo run build --dry=json --filter=@l2beat/dal',
    {
      stdio: 'pipe',
    },
  )
  const json = JSON.parse(output.toString())

  const validated = TurboOutputSchema.parse(json)
  return hashJson(validated).slice(0, 12)
}

function hashJson(value: TurboOutputSchema) {
  const message = JSON.stringify(value)
  return createHash('sha256').update(message).digest('hex')
}
