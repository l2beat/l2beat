import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import type { MainPage } from '~/components/opengraph-image/MainPage'
import { MainPageOpengraphImage } from '~/components/opengraph-image/MainPage'

const mainPages: MainPage[] = [
  {
    type: 'scaling',
    title: 'Summary',
  },
  {
    type: 'scaling',
    title: 'Risk Analysis',
  },
  {
    type: 'scaling',
    title: 'Value Secured',
  },
  {
    type: 'scaling',
    title: 'Activity',
  },
  {
    type: 'scaling',
    title: 'Data Availability',
  },
  {
    type: 'scaling',
    title: 'Liveness',
  },
  {
    type: 'scaling',
    title: 'Costs',
  },
  {
    type: 'scaling',
    title: 'Upcoming',
  },
  {
    type: 'scaling',
    title: 'Archived',
  },
  {
    type: 'bridges',
    title: 'Summary',
  },
  {
    type: 'bridges',
    title: 'Risk Analysis',
  },
  {
    type: 'bridges',
    title: 'Archived',
  },
  {
    type: 'data-availability',
    title: 'Summary',
  },
  {
    type: 'data-availability',
    title: 'Risk Analysis',
  },
  {
    type: 'data-availability',
    title: 'Throughput',
  },
  {
    title: 'ZK Catalog',
  },
  {
    title: 'About Us',
  },
  {
    title: 'Donate',
  },
  {
    title: 'FAQ',
  },
  {
    title: 'Terms of Service',
  },
]

export async function generateMainPageOgImages(
  size: { width: number; height: number },
  fonts: {
    robotoMedium: Buffer
    robotoBold: Buffer
  },
) {
  for (const mainPage of mainPages) {
    const outputDir = path.join(
      process.cwd(),
      'static/meta-images',
      mainPage.type ?? '',
      `/${mainPage.title.toLowerCase().split(' ').join('-')}`,
    )
    const outputFile = path.join(outputDir, 'opengraph-image.png')
    if (existsSync(outputFile)) {
      continue
    }
    const label = mainPage.type
      ? `${mainPage.type.toUpperCase()} ${mainPage.title}`
      : mainPage.title
    console.time(`[MAIN PAGE] ${label}`)
    const pngBuffer = await generateMainPageOgImage(mainPage, size, fonts)
    mkdirSync(outputDir, {
      recursive: true,
    })
    writeFileSync(outputFile, pngBuffer)
    console.timeEnd(`[MAIN PAGE] ${label}`)
  }
}

export async function generateMainPageOgImage(
  mainPage: MainPage,
  size: { width: number; height: number },
  fonts: {
    robotoMedium: Buffer
    robotoBold: Buffer
  },
) {
  const svg = await satori(
    <MainPageOpengraphImage
      size={size}
      baseUrl={'http://localhost:6464'}
      {...mainPage}
    />,
    {
      ...size,
      fonts: [
        {
          name: 'roboto',
          data: fonts.robotoMedium,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'roboto',
          data: fonts.robotoBold,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
  const resvg = new Resvg(svg)
  return resvg.render().asPng()
}
