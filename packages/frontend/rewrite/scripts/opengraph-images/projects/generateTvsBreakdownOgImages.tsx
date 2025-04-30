import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import type { Project } from '@l2beat/config'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { ps } from '~/server/projects'

export async function generateTvsBreakdownOgImages(
  size: { width: number; height: number },
  fonts: {
    robotoMedium: Buffer
    robotoBold: Buffer
  },
) {
  const projects = await ps.getProjects({
    where: ['isScaling'],
  })

  for (const project of projects) {
    const outputDir = path.join(
      process.cwd(),
      `rewrite/static/meta-images/scaling/projects/${project.slug}/tvs-breakdown`,
    )
    const outputFile = path.join(outputDir, 'opengraph-image.png')
    if (existsSync(outputFile)) {
      continue
    }

    console.time(`[TVS BREAKDOWN] ${project.name}`)
    const pngBuffer = await generateTvsBreakdownOgImage(project, size, fonts)

    mkdirSync(outputDir, {
      recursive: true,
    })
    writeFileSync(outputFile, pngBuffer)
    console.timeEnd(`[TVS BREAKDOWN] ${project.name}`)
  }
}

async function generateTvsBreakdownOgImage(
  project: Project,
  size: { width: number; height: number },
  fonts: {
    robotoMedium: Buffer
    robotoBold: Buffer
  },
) {
  const svg = await satori(
    <ProjectOpengraphImage
      baseUrl={`http://localhost:6464`}
      slug={project.slug}
      name={project.name}
      size={size}
    >
      TVS BREAKDOWN
    </ProjectOpengraphImage>,
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
