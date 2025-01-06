import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { assert } from '@l2beat/shared-pure'
import { readConfig } from '../config/readConfig'

export function initTempalte(name: string) {
  const config = readConfig()
  assert(config.projectRootPath, '.l2b file not found')
  assert(config.discoveryPath, '.l2b does not specify the discovery path')

  const templateDir = path.join(config.discoveryPath, '_templates', name)
  mkdirSync(templateDir, { recursive: true })

  const templatePath = path.join(templateDir, 'template.jsonc')
  assert(!existsSync(templatePath), 'Template already exists')

  const displayName = path.basename(name)
  const schemaPath = path.join(
    config.projectRootPath,
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
