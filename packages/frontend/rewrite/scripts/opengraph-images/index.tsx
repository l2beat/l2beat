import type { Project } from '@l2beat/config'
import { Resvg } from '@resvg/resvg-js'
import express from 'express'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import satori from 'satori'
import { ProjectOpengraphImage } from '~/components/opengraph-image/project'
import { ps } from '~/server/projects'
const ogImageSize = { width: 1200, height: 630 }

async function main() {
  const app = express()
  app.use(express.static(path.join(__dirname, '../../static')))
  const server = app.listen(6464, () => {
    console.log('Server is running on port 6464')
  })

  const [projects, robotoMedium, robotoBold] = await Promise.all([
    ps.getProjects({
      optional: ['isScaling', 'isBridge', 'isZkCatalog', 'isDaLayer'],
    }),
    readFile(
      path.join(__dirname, '../../static/fonts/roboto/roboto-latin-500.ttf'),
    ),
    readFile(
      path.join(__dirname, '../../static/fonts/roboto/roboto-latin-700.ttf'),
    ),
  ])

  for (const project of projects) {
    const type = getType(project)
    if (!type) {
      console.log(`Skipping ${project.name} because it has no type`)
      continue
    }

    const outputDir = path.join(
      __dirname,
      `../../static/meta-images/projects/${type}`,
    )
    const outputFile = path.join(outputDir, `${project.slug}.png`)
    if (existsSync(outputFile)) {
      continue
    }

    console.time(`Generated og image for ${project.name}`)
    const svg = await satori(
      <ProjectOpengraphImage
        baseUrl={`http://localhost:6464`}
        slug={project.slug}
        name={project.name}
        size={ogImageSize}
      >
        {`${type.replace('-', ' ').toUpperCase()} • PROJECT PAGE`}
      </ProjectOpengraphImage>,
      {
        ...ogImageSize,
        fonts: [
          {
            name: 'roboto',
            data: robotoMedium,
            style: 'normal',
            weight: 500,
          },
          {
            name: 'roboto',
            data: robotoBold,
            style: 'normal',
            weight: 700,
          },
        ],
      },
    )
    const resvg = new Resvg(svg)
    const pngBuffer = resvg.render().asPng()

    mkdirSync(
      path.join(__dirname, `../../static/meta-images/projects/${type}`),
      {
        recursive: true,
      },
    )
    writeFileSync(outputFile, pngBuffer)
    console.timeEnd(`Generated og image for ${project.name}`)
  }
  server.close()
}

main().catch(console.error)

function getType(
  project: Project<
    never,
    'isScaling' | 'isBridge' | 'isZkCatalog' | 'isDaLayer'
  >,
) {
  if (project.isScaling) {
    return 'scaling'
  }
  if (project.isBridge) {
    return 'bridge'
  }
  if (project.isZkCatalog) {
    return 'zk-catalog'
  }
  if (project.isDaLayer) {
    return 'da-layer'
  }
}
