import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import type { Project } from '@l2beat/config'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { ps } from '~/server/projects'
import React from 'react'

export async function generateProjectOgImages(
  size: { width: number; height: number },
  fonts: {
    robotoMedium: Buffer
    robotoBold: Buffer
  },
) {
  const projects = await ps.getProjects({
    optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
  })

  for (const project of projects) {
    const type = getOpengraphProjectType(project)
    if (!type) {
      console.log(`Skipping ${project.name} because it has no type`)
      continue
    }

    const outputDir = path.join(
      process.cwd(),
      `rewrite/static/meta-images/${type}/projects`,
    )
    const outputFile = path.join(outputDir, `${project.slug}.png`)
    if (existsSync(outputFile)) {
      continue
    }

    console.time(`Generated og image for ${project.name}`)
    const pngBuffer = await generateProjectOgImage(project, type, size, fonts)

    mkdirSync(outputDir, {
      recursive: true,
    })
    writeFileSync(outputFile, pngBuffer)
    console.timeEnd(`Generated og image for ${project.name}`)
  }
}

async function generateProjectOgImage(
  project: Project,
  type: 'scaling' | 'bridges' | 'zk-catalog' | 'data-availability',
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
      {`${type.replace('-', ' ').toUpperCase()} • PROJECT PAGE`}
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

export function getOpengraphProjectType(
  project: Project<
    never,
    'isScaling' | 'isBridge' | 'isZkCatalog' | 'isDaLayer'
  >,
) {
  if (project.isScaling) {
    return 'scaling'
  }
  if (project.isBridge) {
    return 'bridges'
  }
  if (project.isZkCatalog) {
    return 'zk-catalog'
  }
  if (project.isDaLayer) {
    return 'data-availability'
  }
}
