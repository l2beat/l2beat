import crypto from 'crypto'
import fs, { mkdirSync, readFileSync } from 'fs'
import { imageSize } from 'image-size'
import path from 'path'

interface Manifest {
  names: Record<string, string>
  images: Record<string, { src: string; width: number; height: number }>
}

void addHashes({
  inputDir: 'static',
  outputDir: 'dist/static',
  manifest: 'dist/manifest.json',
  ignore: ['.gitignore'],
  hashLength: 8,
})

interface AddHashesOptions {
  inputDir: string
  outputDir: string
  manifest: string
  ignore: string[]
  hashLength: number
}

function addHashes(options: AddHashesOptions) {
  const fullInputDir = path.resolve(options.inputDir)
  const fullOutputDir = path.resolve(options.outputDir)

  const files = getFileList(fullInputDir)
    .map((x) => path.relative(fullInputDir, x))
    .filter((x) => !options.ignore.includes(x))
  const manifest: Manifest = {
    names: {},
    images: {},
  }

  for (const file of files) {
    const full = path.join(fullInputDir, file)

    const buffer = readFileSync(full)

    const hash = crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex')
      .slice(0, options.hashLength)

    const dimensions = getDimensions(buffer)

    const { name, ext, dir } = path.parse(file)
    const itemWithHash = `${name}.${hash}${ext}`

    const output = path.join(fullOutputDir, dir, itemWithHash)
    mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(full, output)

    const oldName = path.join('/', dir, `${name}${ext}`)
    const newName = path.join('/static', dir, itemWithHash)

    manifest.names[oldName] = newName
    if (dimensions) {
      manifest.images[oldName] = {
        src: newName,
        width: dimensions.width,
        height: dimensions.height,
      }
    }
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

function getDimensions(buffer: Buffer) {
  try {
    return imageSize(buffer)
  } catch {
    return undefined
  }
}
