import { readFile } from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import { generateExternalPublicationThumbnails } from './projects/generateExternalPublicationThumbnails'
import { generateGovernanceReviewOgImages } from './projects/generateGovernanceReviewOgImages'
import { generateMainPageOgImages } from './projects/generateMainPageOgImages'
import { generateMonthlyUpdateOgImages } from './projects/generateMonthlyUpdateOgImages'
import { generateProjectOgImages } from './projects/generateProjectOgImages'

const ogImageSize = { width: 1200, height: 630 }

async function main() {
  const app = express()
  app.use(express.static(path.join(__dirname, '../../static')))
  const server = app.listen(6464)

  const [robotoMedium, robotoBold, montserratBold, ptSerifBold] =
    await Promise.all([
      readFile(
        path.join(__dirname, '../../static/fonts/roboto/roboto-latin-500.ttf'),
      ),
      readFile(
        path.join(__dirname, '../../static/fonts/roboto/roboto-latin-700.ttf'),
      ),
      readFile(
        path.join(
          __dirname,
          '../../static/fonts/montserrat/montserrat-latin-700.ttf',
        ),
      ),
      readFile(
        path.join(__dirname, '../../static/fonts/pt-serif/pt-serif-700.ttf'),
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
  await generateMonthlyUpdateOgImages(ogImageSize, {
    montserratBold,
  })
  await generateGovernanceReviewOgImages(ogImageSize, {
    ptSerifBold,
  })
  await generateExternalPublicationThumbnails()

  server.close()
}

main().catch(console.error)
