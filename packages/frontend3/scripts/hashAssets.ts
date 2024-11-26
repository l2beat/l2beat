import { createHash } from 'crypto'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { join, parse, relative } from 'path'

const INPUT_DIR = join(__dirname, '../client/static')
const OUTPUT_DIR = join(__dirname, '../dist/static')

const manifest: Record<string, string> = {}

const start = performance.now()
const count = hashAndCopyFiles()
const time = Math.floor(performance.now() - start)
console.log(`${count} files - ${time}ms`)

function hashAndCopyFiles() {
  let count = 0

  recursivelyWalkDirectory(
    INPUT_DIR,
    (dir) => {
      mkdirSync(join(OUTPUT_DIR, relative(INPUT_DIR, dir)))
    },
    (file) => {
      if (file.endsWith('.gitignore')) {
        return
      }
      const content = readFileSync(file)
      const hash = digest(content)
      const { dir, base } = parse(relative(INPUT_DIR, file))
      const fileName = `${hash}-${base}`

      manifest[join(dir, base)] = join(dir, fileName)
      writeFileSync(join(OUTPUT_DIR, dir, fileName), content)
      count++
    },
  )

  writeFileSync(
    join(OUTPUT_DIR, '../manifest.json'),
    JSON.stringify(manifest, null, 2),
  )

  return count
}

function recursivelyWalkDirectory(
  dir: string,
  cbDir: (dir: string) => void,
  cbFile: (file: string) => void,
) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      cbDir(path)
      recursivelyWalkDirectory(path, cbDir, cbFile)
    } else if (entry.isFile()) {
      cbFile(path)
    }
  }
}

function digest(content: Buffer) {
  // we use sha1 for speed
  // we don't care about cryptographic collision resistance
  return createHash('sha1').update(content).digest('hex').slice(0, 10)
}
