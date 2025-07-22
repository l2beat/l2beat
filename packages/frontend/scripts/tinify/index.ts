import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'
import tinify from 'tinify'
import { getImageDimensions } from '~/utils/project/getImageParams'
import { getAllStaticPngs } from './utils/getAllStaticPngs'
import {
  checkIfWasTinified,
  saveToTinifyMetadata,
} from './utils/tinifyMetadata'

dotenv.config()

const staticDir = path.join(__dirname, '../../static')

main().catch((e) => console.error(e))

async function main() {
  /*
    Default API key is associated with burner email.
    If the limit is reached (500 compressions), create a new one for yourself at https://tinypng.com/developers.
  */
  const apiKey =
    process.env.TINIFY_API_KEY ?? 'XTW3Qwl0dx5gRkc2TmsKtJJtY3c89790'

  tinify.key = apiKey

  const pngs = getAllStaticPngs(staticDir)

  let tinifiedCount = 0
  for (const png of pngs) {
    const sourceBuffer = readFileSync(png)
    if (checkIfWasTinified(png, sourceBuffer)) {
      continue
    }

    if (path.dirname(png) === path.join(staticDir, 'icons')) {
      tinifiedCount += await tinifyLogo(png, sourceBuffer)
      continue
    }

    tinifiedCount += await tinifyImage(png)
  }

  console.log(
    tinifiedCount === 0
      ? 'Nothing to tinify'
      : `Done, tinified ${tinifiedCount} images`,
  )
  process.exit(0)
}

async function tinifyImage(filePath: string) {
  console.time(`Tinifying ${filePath}`)
  await tinify.fromFile(filePath).toFile(filePath)
  const tinifiedBuffer = readFileSync(filePath)
  saveToTinifyMetadata(filePath, tinifiedBuffer)
  console.timeEnd(`Tinifying ${filePath}`)
  return 1
}

async function tinifyLogo(filePath: string, sourceBuffer: Buffer) {
  console.time(`Tinifying ${filePath}`)

  const source = tinify.fromFile(filePath)

  const dimensions = getImageDimensions(sourceBuffer)
  if (!dimensions) {
    console.error(`Skipping ${filePath} because it is not a valid image`)
    return 0
  }
  const { width, height } = dimensions

  if (width !== height) {
    console.error(
      `Skipping ${filePath} because it is not square, provide square logo`,
    )
    return 0
  }

  if (width < 128 || height < 128) {
    console.error(
      `Skipping ${filePath} because it is too small, provide minimum 128x128px logo`,
    )
    return 0
  }

  const tinified = source.resize({
    method: 'fit',
    width: 128,
    height: 128,
  })

  await tinified.toFile(filePath)

  const tinifiedBuffer = readFileSync(filePath)
  saveToTinifyMetadata(filePath, tinifiedBuffer)
  console.timeEnd(`Tinifying ${filePath}`)
  return 1
}
