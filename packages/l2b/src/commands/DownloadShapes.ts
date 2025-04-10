import { writeFileSync } from 'fs'
import { mkdirSync } from 'fs'
import { join } from 'path'
import {
  TemplateService,
  flattenStartingFrom,
  getChainConfig,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { flatteningHash } from '@l2beat/discovery/dist/flatten/utils'
import { getExplorerClient } from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { CliLogger, HttpClient } from '@l2beat/shared'
import { command, positional, string } from 'cmd-ts'
import { rimraf } from 'rimraf'

export const DownloadShapes = command({
  name: 'download-shapes',
  description: 'Download all Solidity files for shapes defined in a template',
  args: {
    template: positional({
      type: string,
      displayName: 'template',
      description: 'name of the template to download shapes for',
    }),
  },
  handler: async (args) => {
    const logger = new CliLogger()
    const paths = getDiscoveryPaths()
    const templateService = new TemplateService(paths.discovery)
    if (templateService.exists(args.template) === false) {
      logger.logLine(`Couldn't find template "${args.template}"`)
      return
    }

    const templatePath = templateService.getTemplatePath(args.template)
    const shapeSchema = templateService.readShapeSchema(
      join(templatePath, 'shapes.json'),
    )

    // 1. Remove and recreate the shapes folder
    // (helps if there are renames or removed shapes)
    const shapesFolder = join(templatePath, 'shapes')
    rimraf.sync(shapesFolder)
    mkdirSync(shapesFolder, { recursive: true })

    // 2. Download the source code and flatten it
    for (const shape of shapeSchema) {
      const chainConfig = getChainConfig(shape.chain)
      const httpClient = new HttpClient()
      const client = getExplorerClient(httpClient, chainConfig.explorer)
      logger.logLine(`Fetching source code of ${shape.description}`)
      const source = await client.getContractSource(shape.address)
      const flattenInput = Object.entries(source.files)
        .map(([fileName, content]) => ({
          path: fileName,
          content,
        }))
        .filter((e) => e.path.endsWith('.sol'))
      const flattenOutput = flattenStartingFrom(
        source.name,
        flattenInput,
        source.remappings,
      )
      // Make sure the hash matches shape.hash
      const hash = flatteningHash(flattenOutput)
      if (hash !== shape.hash) {
        logger.logLine(`Error: hash mismatch!`)
        return
      }
      // Write the flattened source code to the shapes folder
      const fileName = shape.description.endsWith('.sol')
        ? shape.description
        : `${shape.description}.sol`
      const filePath = join(shapesFolder, fileName)
      writeFileSync(filePath, flattenOutput)
    }
  },
})
