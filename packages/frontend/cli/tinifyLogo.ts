import dotenv from 'dotenv'
import path from 'path'
import tinify from 'tinify'

dotenv.config()
main().catch((e) => console.error(e))

async function main() {
  const apiKey = process.env.TINIFY_API_KEY
  const slug = process.argv[2]

  if (!apiKey) {
    throw new Error('Missing TINIFY_API_KEY')
  }
  tinify.key = apiKey

  if (!slug) {
    throw new Error('Missing slug')
  }

  await tinifyLogo(slug)
}

async function tinifyLogo(slug: string) {
  const fileName = `${slug}.png`
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
}
