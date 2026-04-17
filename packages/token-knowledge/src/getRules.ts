import fs from 'node:fs'
import path from 'node:path'

const RULES_FILE_NAME = 'rules.lp'

export function getRulesPath(moduleDir = __dirname) {
  const candidatePaths = [
    path.resolve(moduleDir, '..', RULES_FILE_NAME),
    path.resolve(moduleDir, '..', '..', 'src', RULES_FILE_NAME),
  ]

  for (const candidatePath of new Set(candidatePaths)) {
    if (fs.existsSync(candidatePath)) {
      return candidatePath
    }
  }

  throw new Error(
    `Could not locate ${RULES_FILE_NAME}. Looked in: ${candidatePaths.join(', ')}`,
  )
}

export function getRulesContent(moduleDir = __dirname) {
  return fs.readFileSync(getRulesPath(moduleDir), 'utf-8')
}
