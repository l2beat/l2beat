import { readFile } from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import {
  loadOpengraphKit,
  OG_SIZE,
} from '~/components/opengraph-image/heartbeat/render'
import { generateExternalPublicationThumbnails } from './projects/generateExternalPublicationThumbnails'
import { generateGovernanceReviewOgImages } from './projects/generateGovernanceReviewOgImages'
import { generateMainPageOgImages } from './projects/generateMainPageOgImages'
import { generateMonthlyUpdateOgImages } from './projects/generateMonthlyUpdateOgImages'
import { generateProjectOgImages } from './projects/generateProjectOgImages'

async function main() {
  const app = express()
  app.use(express.static(path.join(__dirname, '../../static')))
  const server = app.listen(6464)

  const [kit, montserratBold, ptSerifBold] = await Promise.all([
    loadOpengraphKit(path.join(__dirname, '../../static')),
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

  await generateMainPageOgImages(kit)
  await generateProjectOgImages(kit)
  await generateMonthlyUpdateOgImages(OG_SIZE, {
    montserratBold,
  })
  await generateGovernanceReviewOgImages(OG_SIZE, {
    ptSerifBold,
  })
  await generateExternalPublicationThumbnails()

  server.close()
}

main().catch(console.error)
