#!/usr/bin/env ts-node
/**
 * Migration script to convert permission-overrides.json to functions.json
 *
 * This script:
 * 1. Finds all permission-overrides.json files in the projects directory
 * 2. Converts userClassification field to isPermissioned boolean
 * 3. Removes aiClassification field
 * 4. Renames the file to functions.json
 * 5. Deletes the old permission-overrides.json file
 */

import * as fs from 'fs'
import * as path from 'path'
import { getDiscoveryPaths } from '@l2beat/discovery'

interface OldPermissionOverride {
  functionName: string
  userClassification: 'permissioned' | 'non-permissioned'
  aiClassification?: 'permissioned' | 'non-permissioned'
  checked?: boolean
  score?: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk'
  reason?: string
  description?: string
  timestamp: string
  ownerDefinitions?: Array<{ path: string }>
  delay?: {
    contractAddress: string
    fieldName: string
  }
}

interface NewFunctionEntry {
  functionName: string
  isPermissioned: boolean
  checked?: boolean
  score?: 'unscored' | 'low-risk' | 'medium-risk' | 'high-risk'
  reason?: string
  description?: string
  timestamp: string
  ownerDefinitions?: Array<{ path: string }>
  delay?: {
    contractAddress: string
    fieldName: string
  }
}

interface OldFile {
  version: string
  lastModified: string
  contracts: Record<string, { functions: OldPermissionOverride[] }>
}

interface NewFile {
  version: string
  lastModified: string
  contracts: Record<string, { functions: NewFunctionEntry[] }>
}

function convertFunction(oldFunction: OldPermissionOverride): NewFunctionEntry {
  const newFunction: NewFunctionEntry = {
    functionName: oldFunction.functionName,
    isPermissioned: oldFunction.userClassification === 'permissioned',
    timestamp: oldFunction.timestamp,
  }

  // Copy over optional fields
  if (oldFunction.checked !== undefined) {
    newFunction.checked = oldFunction.checked
  }
  if (oldFunction.score) {
    newFunction.score = oldFunction.score
  }
  if (oldFunction.reason) {
    newFunction.reason = oldFunction.reason
  }
  if (oldFunction.description) {
    newFunction.description = oldFunction.description
  }
  if (oldFunction.ownerDefinitions) {
    newFunction.ownerDefinitions = oldFunction.ownerDefinitions
  }
  if (oldFunction.delay) {
    newFunction.delay = oldFunction.delay
  }

  // Note: aiClassification is intentionally not copied (removed in new structure)

  return newFunction
}

function migrateFile(oldPath: string, newPath: string): void {
  console.log(`Migrating: ${oldPath}`)

  // Read old file
  const oldContent = fs.readFileSync(oldPath, 'utf8')
  const oldData: OldFile = JSON.parse(oldContent)

  // Convert to new structure
  const newData: NewFile = {
    version: oldData.version,
    lastModified: new Date().toISOString(),
    contracts: {}
  }

  // Convert each contract's functions
  for (const [contractAddress, contractData] of Object.entries(oldData.contracts)) {
    newData.contracts[contractAddress] = {
      functions: contractData.functions.map(convertFunction)
    }
  }

  // Write new file
  fs.writeFileSync(newPath, JSON.stringify(newData, null, 2), 'utf8')
  console.log(`  ✓ Created: ${newPath}`)

  // Delete old file
  fs.unlinkSync(oldPath)
  console.log(`  ✓ Deleted: ${oldPath}`)
}

function findAndMigrateAll() {
  const paths = getDiscoveryPaths()
  const projectsDir = paths.discovery

  console.log(`Searching for permission-overrides.json files in: ${projectsDir}\n`)

  // Read all project directories
  const projects = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  let migratedCount = 0
  let skippedCount = 0

  for (const project of projects) {
    const oldFilePath = path.join(projectsDir, project, 'permission-overrides.json')
    const newFilePath = path.join(projectsDir, project, 'functions.json')

    if (fs.existsSync(oldFilePath)) {
      try {
        migrateFile(oldFilePath, newFilePath)
        migratedCount++
      } catch (error) {
        console.error(`  ✗ Error migrating ${project}:`, error)
      }
    } else if (fs.existsSync(newFilePath)) {
      console.log(`Skipping ${project}: functions.json already exists`)
      skippedCount++
    }
  }

  console.log(`\n=== Migration Complete ===`)
  console.log(`✓ Migrated: ${migratedCount} files`)
  console.log(`⊘ Skipped: ${skippedCount} files`)
  console.log(`Total projects checked: ${projects.length}`)
}

// Run the migration
findAndMigrateAll()
