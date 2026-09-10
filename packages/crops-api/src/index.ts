import { cpSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { absolutePath as swaggerUiPath } from 'swagger-ui-dist'
import { type GeneratedFile, generateCropsSite } from './generateCropsSite'
import { loadGeneratorInput } from './loadGeneratorInput'

const STATIC_DIR = resolve(__dirname, '../static')
const SWAGGER_UI_ASSETS = [
  'swagger-ui.css',
  'swagger-ui-bundle.js',
  'swagger-ui-standalone-preset.js',
  'favicon-16x16.png',
  'favicon-32x32.png',
]

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const outDir = resolve(process.argv[2] ?? 'out')
  const input = await loadGeneratorInput()
  const files = generateCropsSite(input)

  rmSync(outDir, { recursive: true, force: true })
  writeJsonFiles(outDir, files)
  cpSync(STATIC_DIR, outDir, { recursive: true })
  copySwaggerUi(outDir)

  console.log(
    `Wrote ${files.length} files for ${input.projects.length} projects at ${input.commit} to ${outDir}`,
  )
}

function writeJsonFiles(outDir: string, files: GeneratedFile[]) {
  for (const file of files) {
    const target = join(outDir, file.path)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, JSON.stringify(file.body))
  }
}

/** Bundled at build time so the site has no third-party runtime dependency. */
function copySwaggerUi(outDir: string) {
  const source = swaggerUiPath()
  for (const asset of SWAGGER_UI_ASSETS) {
    cpSync(join(source, asset), join(outDir, asset))
  }
}
