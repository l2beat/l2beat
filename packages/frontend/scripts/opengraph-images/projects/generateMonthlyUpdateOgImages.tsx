import { assert } from '@l2beat/shared-pure'
import { Resvg } from '@resvg/resvg-js'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import satori from 'satori'
import { MonthlyUpdateOpengraphImage } from '~/components/opengraph-image/MonthlyUpdate'
import { getCollection } from '~/content/getCollection'

export async function generateMonthlyUpdateOgImages(
  size: { width: number; height: number },
  fonts: {
    montserratBold: Buffer
  },
) {
  const monthlyUpdates = getCollection('monthly-updates')

  for (const monthlyUpdate of monthlyUpdates) {
    const outputDir = path.join(
      process.cwd(),
      'static/meta-images/publications/',
    )
    const outputFile = path.join(outputDir, `/${monthlyUpdate.id}.png`)

    if (existsSync(outputFile)) {
      continue
    }

    const dateFromId = monthlyUpdate.id.split('monthly-update-')[1]
    assert(dateFromId, 'Date from id is undefined')

    const date = new Date(dateFromId)
    const monthYear = date.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    console.time(`[MONTHLY UPDATE] ${monthlyUpdate.id}`)
    const pngBuffer = await generateMonthlyUpdateOgImage(monthYear, size, fonts)

    mkdirSync(outputDir, {
      recursive: true,
    })
    writeFileSync(outputFile, pngBuffer)
    console.timeEnd(`[MONTHLY UPDATE] ${monthlyUpdate.id}`)
  }
}

async function generateMonthlyUpdateOgImage(
  date: string,
  size: { width: number; height: number },
  fonts: {
    montserratBold: Buffer
  },
) {
  const svg = await satori(
    <MonthlyUpdateOpengraphImage
      baseUrl={'http://localhost:6464'}
      date={date}
      size={size}
    />,
    {
      ...size,
      fonts: [
        {
          name: 'montserrat',
          data: fonts.montserratBold,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
  const resvg = new Resvg(svg)
  return resvg.render().asPng()
}
