import crypto from 'crypto'
import fs, { mkdirSync } from 'fs'
import path from 'path'

addHashes({
  prefix: '/static',
  inputDir: 'static',
  outputDir: 'dist/static',
  manifest: 'dist/manifest.json',
  ignore: ['.gitignore'],
})

/*
 * This function is used to add hashes to static files.
 * HASH_LENGTH - We are using sha256 so the maximum value can be 16. We are using 8 to keep the file names short. If you want to change this, you need to clean and rebuild the project.
 */
const HASH_LENGTH = 8

async function addHashes(options: {
  prefix: string
  inputDir: string
  outputDir: string
  manifest: string
  ignore: string[]
}) {
  const fullInputDir = path.resolve(options.inputDir)
  const fullOutputDir = path.resolve(options.outputDir)

  const files = getFileList(fullInputDir)
    .map((x) => path.relative(fullInputDir, x))
    .filter((x) => !options.ignore.includes(x))
  const manifest: Record<string, string> = {}

  for (const file of files) {
    const full = path.join(fullInputDir, file)

    const hash = (await sha256(full)).slice(0, HASH_LENGTH)
    const { name, ext, dir } = path.parse(file)
    const itemWithHash = `${name}.${hash}${ext}`

    const output = path.join(fullOutputDir, dir, itemWithHash)
    mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(full, output)

    const oldName = path.join(options.prefix, dir, `${name}${ext}`)
    const newName = path.join(options.prefix, dir, itemWithHash)

    manifest[oldName] = newName
  }

  fs.writeFileSync(options.manifest, JSON.stringify(manifest, null, 2))
}

function getFileList(dir: string): string[] {
  const result = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullName = path.join(dir, item)
    if (fs.statSync(fullName).isDirectory()) {
      result.push(...getFileList(fullName))
    } else {
      result.push(fullName)
    }
  }
  return result
}

async function sha256(file: string): Promise<string> {
  const fd = fs.createReadStream(file)
  const hash = crypto.createHash('sha256')
  hash.setEncoding('hex')
  return new Promise((resolve) => {
    fd.on('end', function () {
      hash.end()
      resolve(hash.read())
    })
    fd.pipe(hash)
  })
}
