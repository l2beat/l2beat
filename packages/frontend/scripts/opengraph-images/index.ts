import { readFile } from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import { generateMainPageOgImages } from './projects/generateMainPageOgImages'
import { generateProjectOgImages } from './projects/generateProjectOgImages'

const ogImageSize = { width: 1200, height: 630 }

async function main() {
  const app = express()
  app.use(express.static(path.join(__dirname, '../../static')))
  const server = app.listen(6464)

  const [robotoMedium, robotoBold] = await Promise.all([
    readFile(
      path.join(__dirname, '../../static/fonts/roboto/roboto-latin-500.ttf'),
    ),
    readFile(
      path.join(__dirname, '../../static/fonts/roboto/roboto-latin-700.ttf'),
    ),
  ])

  await generateMainPageOgImages(ogImageSize, {
    robotoMedium,
    robotoBold,
  })
  await generateProjectOgImages(ogImageSize, {
    robotoMedium,
    robotoBold,
  })

  server.close()
}

main().catch(console.error)
