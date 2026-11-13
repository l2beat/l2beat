import type { Logger } from '@l2beat/backend-tools'
import { execSync } from 'child_process'
import path from 'path'

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
  try {
    // NOTE(radomski): Node when starting a process reserves a buffer of around
    // 200KB for STDIO output. This is not enough in cases where the
    // discovered.json is really big (e.g. transporter). In that case the git
    // command fails with "ENOBUFS" and we assume that there no old
    // discovered.json. Which in turn always causes the diffHistory.md to
    // include "all" the contracts as being created. To solve this problem we
    // allocate a 10MB buffer upfront so all the data can be stored. At the
    // time of writing this (21.10.2024) discovered.json of transporter is
    // around 1.2MB.
    const BUFFER_SIZE = 10 * 1024 * 1024
    // Wrap the path in single quotes to avoid the shell interpreting
    // characters like parentheses or spaces. We also escape any single quotes
    // inside the path (extremely unlikely in our repo layout).
    const quotedPath = shellQuote(filePath)
    const content = execSync(`git show main:${quotedPath} 2>/dev/null`, {
      maxBuffer: BUFFER_SIZE,
    }).toString()
    const mainBranchHash = execSync('git rev-parse main').toString().trim()
    return { content, mainBranchHash }
  } catch {
    logger.info(`No previous version of ${filePath} found`)
    return { content: '', mainBranchHash: '' }
  }
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
