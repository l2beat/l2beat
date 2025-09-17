import type { Project } from '@l2beat/config'
import { Resvg } from '@resvg/resvg-js'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import satori from 'satori'
import { ProjectOpengraphImage } from '~/components/opengraph-image/Project'
import { ps } from '~/server/projects'

export async function generateProjectOgImages(
  size: { width: number; height: number },
  fonts: {
    robotoMedium: Buffer
    robotoBold: Buffer
  },
) {
  const projects = await ps.getProjects({
    optional: [
      'isScaling',
      'isBridge',
      'isZkCatalog',
      'isDaLayer',
      'zkCatalogInfo',
    ],
  })

  for (const project of projects) {
    const types = getOpengraphProjectTypes(project)
    if (types.length === 0) {
      console.log(`Skipping ${project.name} because it has no types`)
      continue
    }

    for (const type of types) {
      const outputDir = path.join(
        process.cwd(),
        `static/meta-images/${type}/projects/${project.slug}`,
      )
      const outputFile = path.join(outputDir, 'opengraph-image.png')
      if (existsSync(outputFile)) {
        continue
      }

      console.time(`[PROJECT DETAILS] ${project.name}`)
      const pngBuffer = await generateProjectOgImage(project, type, size, fonts)

      mkdirSync(outputDir, {
        recursive: true,
      })
      writeFileSync(outputFile, pngBuffer)
      console.timeEnd(`[PROJECT DETAILS] ${project.name}`)
    }
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
      baseUrl={'http://localhost:6464'}
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

export function getOpengraphProjectTypes(
  project: Project<
    never,
    'isScaling' | 'isBridge' | 'isZkCatalog' | 'isDaLayer' | 'zkCatalogInfo'
  >,
) {
  const types: ('scaling' | 'bridges' | 'zk-catalog' | 'data-availability')[] =
    []
  if (project.isScaling) {
    types.push('scaling')
  }
  if (project.isBridge) {
    types.push('bridges')
  }
  if (project.isZkCatalog || project.zkCatalogInfo) {
    types.push('zk-catalog')
  }
  if (project.isDaLayer) {
    types.push('data-availability')
  }
  return types
}
