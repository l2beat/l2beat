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
    optional: ['isScaling', 'isDaLayer', 'zkCatalogInfo', 'interopConfig'],
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
  project: Project<never, 'interopConfig'>,
  type: 'scaling' | 'zk-catalog' | 'data-availability' | 'interop',
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
      name={
        type === 'interop'
          ? (project.interopConfig?.name ?? project.name)
          : project.name
      }
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
    'isScaling' | 'isDaLayer' | 'zkCatalogInfo' | 'interopConfig'
  >,
) {
  const types: ('scaling' | 'zk-catalog' | 'data-availability' | 'interop')[] =
    []
  if (project.isScaling) {
    types.push('scaling')
  }
  if (project.zkCatalogInfo) {
    types.push('zk-catalog')
  }
  if (project.isDaLayer) {
    types.push('data-availability')
  }
  if (project.interopConfig) {
    types.push('interop')
  }
  return types
}
