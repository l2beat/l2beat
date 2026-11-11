import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

/** Renders `static/meta-images/<pagePath>/opengraph-image.png` unless it exists. */
export async function writeIfMissing(
  group: string,
  pagePath: string,
  name: string,
  render: () => Promise<Buffer>,
) {
  const outputDir = path.join(process.cwd(), 'static/meta-images', pagePath)
  const outputFile = path.join(outputDir, 'opengraph-image.png')
  if (existsSync(outputFile)) {
    return
  }
  console.time(`[${group}] ${name}`)
  const pngBuffer = await render()
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputFile, pngBuffer)
  console.timeEnd(`[${group}] ${name}`)
}
