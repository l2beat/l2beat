import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  'static',
])

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
}

function toCamelCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase())
}

function collectFiles(dir: string, baseDir = dir): string[] {
  const entries = fs.readdirSync(dir)
  let files: string[] = []

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry)) continue

    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files = files.concat(collectFiles(fullPath, baseDir))
    } else {
      files.push(path.relative(baseDir, fullPath))
    }
  }

  return files
}

function renameFiles(files: string[], rootDir: string): Map<string, string> {
  const renamedMap = new Map<string, string>()

  for (const relPath of files) {
    const ext = path.extname(relPath)
    if (ext !== '.tsx' && ext !== '.ts') continue

    const dirname = path.dirname(relPath)
    const oldBase = path.basename(relPath, ext)
    if (!oldBase.includes('-') && ext === '.ts') {
      continue
    }
    const newBase =
      ext === '.tsx' ? toPascalCase(oldBase) : toCamelCase(oldBase)

    if (oldBase === newBase) continue

    const oldFullPath = path.join(rootDir, relPath)
    const newRelPath = path.join(dirname, newBase + ext)
    const newFullPath = path.join(rootDir, newRelPath)

    try {
      execSync(`git mv -f ${oldFullPath} ${newFullPath}`)
      renamedMap.set(relPath, newRelPath)
      console.log(`Renamed via git: ${oldFullPath} → ${newFullPath}`)
    } catch (err) {
      console.error(`Failed to rename ${oldFullPath}:`, (err as Error).message)
    }
  }

  return renamedMap
}

function updateImportReferences(
  files: string[],
  renamedMap: Map<string, string>,
  rootDir: string,
) {
  for (const relPath of files) {
    const renamedPath = renamedMap.get(relPath)
    const fullPath = path.join(rootDir, renamedPath ?? relPath)
    const ext = path.extname(fullPath)
    if (ext !== '.ts' && ext !== '.tsx') continue

    let content = fs.readFileSync(fullPath, 'utf8')
    let updated = false

    for (const [oldRel, newRel] of renamedMap.entries()) {
      const oldImport = removeExtension(
        path.relative(path.dirname(relPath), oldRel),
      )
      const newImport = removeExtension(
        path.relative(path.dirname(relPath), newRel),
      )

      const regex = new RegExp(
        `(['"\`])(.*/)?${escapeRegex(path.basename(oldImport))}\\1`,
        'g',
      )

      content = content.replace(regex, (_, quote, prefix = '') => {
        updated = true
        let updatedPath = normalizeImportPath(
          path.join(prefix || '', path.basename(newImport)),
        )
        if (
          updatedPath.startsWith('./~') ||
          updatedPath.startsWith('./React')
        ) {
          updatedPath = updatedPath.slice(2)
        }

        return `${quote}${updatedPath}${quote}`
      })
    }

    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8')
      console.log(`Updated imports in: ${relPath}`)
    }
  }
}

function removeExtension(p: string): string {
  return p.replace(/\.[tj]sx?$/, '').replace(/\\/g, '/')
}

function normalizeImportPath(p: string): string {
  if (!p.startsWith('.')) return './' + p
  return p.replace(/\\/g, '/')
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 🚀 Entry point
function run(root: string) {
  const allFiles = collectFiles(root)
  const renamedMap = renameFiles(allFiles, root)
  updateImportReferences(allFiles, renamedMap, root)
}

run(path.resolve(process.cwd(), 'src')) // Change to your root dir if needed
