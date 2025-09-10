import { assert } from '@l2beat/shared-pure'
import { Resvg } from '@resvg/resvg-js'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import satori from 'satori'
import { GovernanceReviewOpengraphImage } from '~/components/opengraph-image/GovernanceReview'
import { getCollection } from '~/content/getCollection'

export async function generateGovernanceReviewOgImages(
  size: { width: number; height: number },
  fonts: {
    ptSerifBold: Buffer
  },
) {
  const governancePublications = getCollection('governance-publications')
  const governanceReviews = governancePublications.filter((p) =>
    p.id.startsWith('governance-review-'),
  )

  for (const governanceReview of governanceReviews) {
    const outputDir = path.join(
      process.cwd(),
      'static/meta-images/publications/',
    )
    const outputFile = path.join(outputDir, `/${governanceReview.id}.png`)

    if (existsSync(outputFile)) {
      continue
    }

    const reviewNumber = governanceReview.id.split('governance-review-')[1]
    assert(reviewNumber, 'Review number is undefined')

    console.time(`[GOVERNANCE REVIEW] ${governanceReview.id}`)
    const pngBuffer = await generateGovernanceReviewOgImage(
      `Governance Review #${reviewNumber}`,
      size,
      fonts,
    )

    mkdirSync(outputDir, {
      recursive: true,
    })
    writeFileSync(outputFile, pngBuffer)
    console.timeEnd(`[GOVERNANCE REVIEW] ${governanceReview.id}`)
  }
}

async function generateGovernanceReviewOgImage(
  title: string,
  size: { width: number; height: number },
  fonts: {
    ptSerifBold: Buffer
  },
) {
  const svg = await satori(
    <GovernanceReviewOpengraphImage
      baseUrl={'http://localhost:6464'}
      title={title}
      size={size}
    />,
    {
      ...size,
      fonts: [
        {
          name: 'pt-serif',
          data: fonts.ptSerifBold,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
  const resvg = new Resvg(svg)
  return resvg.render().asPng()
}
