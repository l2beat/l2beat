import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

addHashes({
  prefix: '/static',
  contentDir: 'dist/static',
  manifest: 'dist/manifest.json',
})

/*
 * This function is used to add hashes to static files.
 * HASH_LENGTH - We are using sha256 so the maximum value can be 16. We are using 8 to keep the file names short. If you want to change this, you need to clean and rebuild the project.
 */
const HASH_LENGTH = 8

async function addHashes(options: {
  prefix: string
  contentDir: string
  manifest: string
}) {
  const files = await getFileList(path.resolve(options.contentDir))
  const manifest: Record<string, string> = {}

  for (const file of files) {
    const hash = (await sha256(file)).slice(0, HASH_LENGTH)
    const { name, ext, dir } = path.parse(file)
    const base = path.dirname(file.slice(dir.length))
    const itemWithHash = `${name}.${hash}${ext}`
    await fs.promises.rename(file, path.join(dir, itemWithHash))

    const oldName = path.join(options.prefix, base, `${name}${ext}`)
    const newName = path.join(options.prefix, base, itemWithHash)

    manifest[oldName] = newName
  }

  fs.writeFileSync(options.manifest, JSON.stringify(manifest, null, 2))
}

async function getFileList(dir: string): Promise<string[]> {
  const result = []
  const items = await fs.promises.readdir(dir)
  for (const item of items) {
    const fullName = path.join(dir, item)
    if (fs.statSync(fullName).isDirectory()) {
      result.push(...(await getFileList(fullName)))
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
