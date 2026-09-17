import { cp, link, mkdir, readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { nodeFileTrace } from '@vercel/nft'

async function main() {
  const destination = process.argv[2]
  if (!destination) {
    throw new Error('Usage: tsx scripts/buildRuntime.ts <output-directory>')
  }

  const base = path.resolve('../..')
  const output = path.resolve(destination)
  const frontend = 'packages/frontend'
  const { fileList, warnings } = await nodeFileTrace(
    [path.join(base, frontend, 'dist/server/index.js')],
    { base, processCwd: process.cwd() },
  )

  // Optional native dependencies for other platforms can produce warnings.
  for (const warning of warnings) {
    console.warn(warning.message)
  }

  async function copy(file: string) {
    const target = path.join(output, file)
    await mkdir(path.dirname(target), { recursive: true })
    await cp(path.join(base, file), target, {
      recursive: true,
      verbatimSymlinks: true,
    })
  }

  for (const file of fileList) {
    await copy(file)
  }

  // These files are served or read using paths assembled at runtime.
  for (const file of [
    `${frontend}/dist`,
    `${frontend}/static`,
    `${frontend}/src/content`,
    'packages/config/build/db.sqlite',
  ]) {
    await copy(file)
  }

  const manifest = JSON.parse(
    await readFile(path.join(output, frontend, 'dist/manifest.json'), 'utf8'),
  ) as { names: Record<string, string> }

  // Keep both public URLs without storing each static asset twice. The final
  // Docker COPY preserves hard links when both paths are copied together.
  for (const [original, hashed] of Object.entries(manifest.names)) {
    const originalPath = path.join(output, frontend, 'static', original)
    const hashedPath = path.join(output, frontend, 'dist', hashed)
    await unlink(hashedPath)
    await link(originalPath, hashedPath)
  }

  console.log(`Prepared frontend runtime (${fileList.size} traced files)`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
