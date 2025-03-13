import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { getDiscoveryPaths } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'

export function initTempalte(name: string) {
  const paths = getDiscoveryPaths()

  const templateDir = path.join(paths.discovery, '_templates', name)
  mkdirSync(templateDir, { recursive: true })

  const templatePath = path.join(templateDir, 'template.jsonc')
  assert(!existsSync(templatePath), 'Template already exists')

  const displayName = path.basename(name)
  const schemaPath = path.join(
    paths.root,
    'packages',
    'discovery',
    'schemas',
    'contract.v2.schema.json',
  )
  const relativeSchemaPath = path.relative(templateDir, schemaPath)

  const content = {
    $schema: relativeSchemaPath,
    displayName,
  }
  const json = JSON.stringify(content, null, 2)
  writeFileSync(templatePath, `${json}\n`)
}
