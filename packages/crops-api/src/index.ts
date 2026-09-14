import { cpSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { absolutePath as swaggerUiPath } from 'swagger-ui-dist'
import { generateCropsApiFiles } from './generateCropsApiFiles'
import { loadGeneratorInput } from './loadGeneratorInput'
import { buildOpenApiDocument } from './openapi'

const OUT_DIR = resolve(__dirname, '../out')
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
  const input = await loadGeneratorInput()
  const files = generateCropsApiFiles(input)

  rmSync(OUT_DIR, { recursive: true, force: true })
  for (const file of files) {
    writeJson(file.path, file.body)
  }
  writeJson('v1/openapi.json', buildOpenApiDocument(input.ledger))
  cpSync(STATIC_DIR, OUT_DIR, { recursive: true })
  copySwaggerUi()

  console.log(
    `Wrote ${files.length + 1} files for ${input.projects.length} projects at ${input.commit} to ${OUT_DIR}`,
  )
}

function writeJson(path: string, body: unknown) {
  const target = join(OUT_DIR, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, JSON.stringify(body))
}

/** Bundled at build time so the site has no third-party runtime dependency. */
function copySwaggerUi() {
  const source = swaggerUiPath()
  for (const asset of SWAGGER_UI_ASSETS) {
    cpSync(join(source, asset), join(OUT_DIR, asset))
  }
}
