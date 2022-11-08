import { execSync } from 'child_process'

export function getGitCommitHash() {
  return execSync('git rev-parse HEAD').toString().trim()
}
