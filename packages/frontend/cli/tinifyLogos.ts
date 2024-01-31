import dotenv from 'dotenv'
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import tinify from 'tinify'
import { z } from 'zod'

const TinifiedLogos = z.array(z.string())

dotenv.config()
const tinifiedLogosFile = path.join(__dirname, 'tinifiedLogos.json')

main().catch((e) => console.error(e))

async function main() {
  /*
    Default API key is associated with burner email.
    If the limit is reached (500 contributions), create a new one for yourself at https://tinypng.com/developers.
  */
  const apiKey =
    process.env.TINIFY_API_KEY ?? '7V2rB5RXN8DfJW04bGNvYs5MVVPk77KM'

  if (!apiKey) {
    throw new Error('Missing TINIFY_API_KEY')
  }
  tinify.key = apiKey

  const logos = readdirSync(
    path.join(__dirname, '..', 'src', 'static', 'icons'),
  )

  let tinifiedLogosCount = 0
  for (const logo of logos) {
    if (checkIfWasTinified(logo)) {
      continue
    }

    await tinifyLogo(logo)
    tinifiedLogosCount++
  }

  console.log(
    tinifiedLogosCount === 0
      ? 'Nothing to tinify'
      : `Done, tinified ${tinifiedLogosCount} logos`,
  )
}

async function tinifyLogo(fileName: string) {
  const pathToLogo = path.join(
    __dirname,
    '..',
    'src',
    'static',
    'icons',
    fileName,
  )

  const source = tinify.fromFile(pathToLogo)
  const resized = source.resize({
    method: 'fit',
    width: 128,
    height: 128,
  })
  await resized.toFile(pathToLogo)
  saveToJson(fileName)
}

function getTinifiedLogos() {
  const file = readFileSync(tinifiedLogosFile, 'utf8')
  const tinifiedLogos = TinifiedLogos.parse(JSON.parse(file))

  return tinifiedLogos
}

function saveToJson(fileName: string) {
  const tinifiedLogos = getTinifiedLogos()
  tinifiedLogos.push(fileName)

  writeFileSync(
    tinifiedLogosFile,
    JSON.stringify(tinifiedLogos, null, 2) + '\n',
  )
}

function checkIfWasTinified(fileName: string) {
  const tinifiedLogos = getTinifiedLogos()

  return tinifiedLogos.includes(fileName)
}
