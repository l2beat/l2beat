import { execSync } from 'child_process'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import path, { resolve } from 'path'

const outputPath = path.join(__dirname, '../build/package-hash.txt')
main()

function main() {
  try {
    const src = gitTreeHash('packages/dal').slice(0, 12)
    const deps = depsHash('@l2beat/dal').slice(0, 12)
    const lock = sha256Hex(
      readFileSync(resolve('../../pnpm-lock.yaml'), 'utf8'),
    ).slice(0, 12)
    writeFileSync(outputPath, `src-${src}:deps-${deps}:lock-${lock}`, 'utf8')
  } catch (err) {
    console.error(err)
    // Some environments do not have git, so we just write 'unknown'
    // Only known case for now is Preview environment on Heroku
    // We have an alert for checking if the hash is 'unknown' on prod
    writeFileSync(outputPath, 'unknown', 'utf8')
  }
}

function sha256Hex(s: string) {
  return createHash('sha256').update(s).digest('hex')
}

// 1) Hash only THIS workspace's tracked files (fast & precise)
function gitTreeHash(pkgDir: string): string {
  // Tree object hash for the directory at HEAD (changes when any file under it changes)
  const hash = execSync(`git rev-parse HEAD:${pkgDir}`, {
    encoding: 'utf8',
  }).trim()
  return hash
}

// 2) Hash the resolved dep graph for this workspace using pnpm
//    We ask pnpm for the filtered dependency tree and hash name@version pairs deterministically.
function depsHash(pkgNameOrFilter: string): string {
  const json = execSync(`pnpm ls --prod --json --filter "${pkgNameOrFilter}"`, {
    encoding: 'utf8',
  })
  // pnpm returns an array of trees; flatten to unique "name@version"
  const trees: Record<string, unknown> = JSON.parse(json)[0].dependencies

  const depsHashes = Object.keys(trees)
    .filter((key) => key.startsWith('@l2beat'))
    .map((key) => key.replace('@l2beat', 'packages'))
    .map((key) => gitTreeHash(key))

  return sha256Hex(depsHashes.join(':'))
}
