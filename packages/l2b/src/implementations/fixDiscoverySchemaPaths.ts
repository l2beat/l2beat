import { type DiscoveryPaths, readJsonc } from '@l2beat/discovery'
import fs from 'fs'
import path from 'path'

const SCHEMA_CONFIG = {
  schemas: {
    'contract.v2.schema.json':
      'packages/discovery/schemas/contract.v2.schema.json',
    'config.v2.schema.json': 'packages/discovery/schemas/config.v2.schema.json',
  },
  filePatterns: [
    {
      pattern: 'template.jsonc',
      schema: 'contract.v2.schema.json',
    },
    {
      pattern: 'config.jsonc',
      schema: 'config.v2.schema.json',
    },
  ],
} as const

type SchemaConfig = typeof SCHEMA_CONFIG
type SchemaName = keyof SchemaConfig['schemas']

function getSchemaFilePaths(root: string, config: SchemaConfig) {
  const schemaPaths: Record<string, string> = {}

  for (const [schemaName, relativePath] of Object.entries(config.schemas)) {
    schemaPaths[schemaName] = path.join(root, relativePath)
  }

  return schemaPaths
}

function calculateRelativePath(fromPath: string, toPath: string) {
  const relativePath = path.relative(path.dirname(fromPath), toPath)
  return relativePath.replace(/\\/g, '/')
}

function getExpectedSchemaFile(
  filePath: string,
  config: SchemaConfig,
): SchemaName | null {
  for (const { pattern, schema } of config.filePatterns) {
    if (filePath.includes(pattern)) {
      return schema
    }
  }
  return null
}

function findJsoncFiles(dir: string, files: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules'
    ) {
      findJsoncFiles(fullPath, files)
    } else if (entry.isFile() && entry.name.endsWith('.jsonc')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8')
        if (content.includes('$schema')) {
          files.push(fullPath)
        }
      } catch (error: unknown) {
        console.warn(`Warning: Could not read file ${fullPath}: ${error}`)
      }
    }
  }

  return files
}

function fixSchemaPath(
  filePath: string,
  schemaPaths: Record<string, string>,
  config: SchemaConfig,
) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const expectedSchemaFile = getExpectedSchemaFile(filePath, config)

    if (!expectedSchemaFile) {
      console.log(`Skipping ${filePath}: Not a recognized file pattern`)
      return false
    }

    const schemaFilePath = schemaPaths[expectedSchemaFile]
    const correctRelativePath = calculateRelativePath(filePath, schemaFilePath)

    let jsonData
    try {
      jsonData = readJsonc(filePath)
    } catch (parseError: unknown) {
      console.warn(
        `Warning: Could not parse JSON in ${filePath}: ${parseError}`,
      )
      return false
    }

    if (!('$schema' in jsonData)) {
      console.log(`Skipping ${filePath}: No $schema field found`)
      return false
    }

    const currentSchema = jsonData.$schema
    const expectedSchema = correctRelativePath

    if (currentSchema === expectedSchema) {
      console.log(`✓ ${filePath}: Schema path is already correct`)
      return false
    }

    const schemaRegex = /("?\$schema"?\s*:\s*")([^"]+)(")/
    const match = content.match(schemaRegex)

    if (!match) {
      console.warn(`Warning: Could not find $schema pattern in ${filePath}`)
      return false
    }

    const newContent = content.replace(schemaRegex, `$1${expectedSchema}$3`)

    console.log(`🔧 Fixing ${filePath}:`)
    console.log(`   From: ${currentSchema}`)
    console.log(`   To:   ${expectedSchema}`)

    fs.writeFileSync(filePath, newContent, 'utf8')
    return true
  } catch (error: unknown) {
    console.error(`Error processing ${filePath}: ${error}`)
    return false
  }
}

export function lintJsonFiles(paths: DiscoveryPaths) {
  const workspaceRoot = paths.root
  console.log(
    `🔍 Scanning for .jsonc files with $schema references in: ${workspaceRoot}`,
  )

  const schemaPaths = getSchemaFilePaths(workspaceRoot, SCHEMA_CONFIG)

  for (const [schemaName, schemaPath] of Object.entries(schemaPaths)) {
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ Schema file not found: ${schemaPath} (${schemaName})`)
      process.exit(1)
    }
  }

  const jsoncFiles = findJsoncFiles(workspaceRoot)
  console.log(
    `📁 Found ${jsoncFiles.length} .jsonc files with $schema references`,
  )

  let fixedCount = 0
  let skippedCount = 0
  const skippedFiles: string[] = []

  for (const filePath of jsoncFiles) {
    const expectedSchema = getExpectedSchemaFile(filePath, SCHEMA_CONFIG)
    if (!expectedSchema) {
      skippedCount++
      skippedFiles.push(filePath)
      continue
    }

    if (fixSchemaPath(filePath, schemaPaths, SCHEMA_CONFIG)) {
      fixedCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   Fixed: ${fixedCount} files`)
  console.log(
    `   Skipped: ${skippedCount} files (not matching configured patterns)`,
  )
  if (skippedFiles.length > 0) {
    console.log('   Skipped files:')
    for (const file of skippedFiles) {
      console.log(`      ${file}`)
    }
  }
  console.log(`   Total processed: ${jsoncFiles.length} files`)

  if (fixedCount > 0) {
    console.log(
      '\n✅ Schema paths have been fixed! You may want to verify the changes.',
    )
  } else {
    console.log('\n✅ All schema paths are already correct!')
  }
}
