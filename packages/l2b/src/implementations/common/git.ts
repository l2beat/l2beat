import type { Logger } from '@l2beat/backend-tools'
import { execSync, type SpawnSyncReturns, spawnSync } from 'child_process'
import path from 'path'

const BUFFER_SIZE = 10 * 1024 * 1024

export function shellQuote(p: string): string {
  return `'${p.replaceAll("'", "'\\''")}'`
}

export function getFileVersionOnMainBranch(
  filePath: string,
  logger: Logger,
): {
  content: string
  mainBranchHash: string
} {
  // NOTE(radomski): Node when starting a process reserves a buffer of around
  // 200KB for STDIO output. This is not enough in cases where the
  // discovered.json is really big (e.g. transporter). Allocate a 10MB buffer
  // upfront, and propagate real git/buffer errors instead of mistaking them
  // for a missing file.
  const result = spawnSync('git', ['show', `main:${filePath}`], {
    maxBuffer: BUFFER_SIZE,
    encoding: 'utf-8',
  })
  return interpretGitShowResult(filePath, result, logger, getMainBranchHash)
}

export function interpretGitShowResult(
  filePath: string,
  result: Pick<
    SpawnSyncReturns<string>,
    'status' | 'stdout' | 'stderr' | 'error'
  >,
  logger: Logger,
  readMainHash: () => string,
): {
  content: string
  mainBranchHash: string
} {
  if (result.error !== undefined) {
    throw new Error('Failed to read file from main branch', {
      cause: { filePath, error: result.error },
    })
  }
  if (result.status === 0) {
    return { content: result.stdout, mainBranchHash: readMainHash() }
  }
  const stderr = result.stderr ?? ''
  if (isMissingOnMainError(stderr)) {
    logger.info(`No previous version of ${filePath} found`)
    return { content: '', mainBranchHash: '' }
  }
  throw new Error('Failed to read file from main branch', {
    cause: { filePath, status: result.status, stderr: stderr.trim() },
  })
}

function isMissingOnMainError(stderr: string): boolean {
  return (
    stderr.includes('does not exist in') ||
    stderr.includes('exists on disk, but not in')
  )
}

export function getGitUser(logger: Logger): { name: string; email: string } {
  try {
    const name = execSync('git config user.name').toString().trim()
    const email = execSync('git config user.email').toString().trim()
    return { name, email }
  } catch {
    logger.info('No git user found')
    return { name: 'unknown', email: 'unknown' }
  }
}

export function getMainBranchHash(): string {
  return execSync('git rev-parse main').toString().trim()
}

// `git show main:<path>` reads a path starting with ./ relative to the cwd.
export function toGitPath(file: string): string {
  return `.${path.sep}${path.relative(process.cwd(), file)}`
}
