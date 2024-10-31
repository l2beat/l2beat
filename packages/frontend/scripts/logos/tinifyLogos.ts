import crypto from 'crypto'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import tinify from 'tinify'
import { z } from 'zod'

const TinifiedLogos = z.record(z.string(), z.string())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const tinifiedLogosFile = path.join(__dirname, 'tinifiedLogos.json')
const tinifiedLogos = getTinifiedLogos()

const iconDirectory = path.join(__dirname, '../../public/icons')

main().catch((e) => console.error(e))

async function main() {
  /*
    Default API key is associated with burner email.
    If the limit is reached (500 contributions), create a new one for yourself at https://tinypng.com/developers.
  */
  const apiKey =
    process.env.TINIFY_API_KEY ?? 'XTW3Qwl0dx5gRkc2TmsKtJJtY3c89790'

  if (!apiKey) {
    throw new Error('Missing TINIFY_API_KEY')
  }
  tinify.key = apiKey

  const logos = readdirSync(iconDirectory).filter((fileName) =>
    fileName.endsWith('.png'),
  )

  let tinifiedLogosCount = 0
  for (const logo of logos) {
    tinifiedLogosCount += await tinifyLogo(logo)
  }

  console.log(
    tinifiedLogosCount === 0
      ? 'Nothing to tinify'
      : `Done, tinified ${tinifiedLogosCount} logos`,
  )
  process.exit(0)
}

async function tinifyLogo(fileName: string) {
  console.time(`Tinifying ${fileName}`)
  const logoPath = path.join(iconDirectory, fileName)

  const sourceBuffer = readFileSync(logoPath)
  if (checkIfWasTinified(fileName, sourceBuffer)) return 0

  const source = tinify.fromFile(logoPath)

  const width = sourceBuffer.readUInt32BE(16)
  const height = sourceBuffer.readUInt32BE(20)
  if (width !== height) {
    console.error(
      `Skipping ${fileName} because it is not square, provide square logo`,
    )
    return 0
  }

  if (width < 128 || height < 128) {
    console.error(
      `Skipping ${fileName} because it is too small, provide minimum 128x128px logo`,
    )
    return 0
  }

  const tinified = source.resize({
    method: 'fit',
    width: 128,
    height: 128,
  })

  await tinified.toFile(path.join(iconDirectory, fileName))

  const tinifiedBuffer = readFileSync(logoPath)
  saveToJson(fileName, tinifiedBuffer)
  console.timeEnd(`Tinifying ${fileName}`)
  return 1
}

function getTinifiedLogos() {
  const file = readFileSync(tinifiedLogosFile, 'utf8')
  const tinifiedLogos = TinifiedLogos.parse(JSON.parse(file))

  return tinifiedLogos
}

function saveToJson(fileName: string, file: Buffer) {
  tinifiedLogos[fileName] = getHash(file)

  writeFileSync(
    tinifiedLogosFile,
    JSON.stringify(tinifiedLogos, null, 2) + '\n',
  )
}

function getHash(file: Buffer) {
  return crypto.createHash('md5').update(file).digest('hex')
}

function checkIfWasTinified(fileName: string, file: Buffer) {
  return tinifiedLogos[fileName] === getHash(file)
}
