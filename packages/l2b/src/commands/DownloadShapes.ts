import type { Logger } from '@l2beat/backend-tools'
import {
  combineImplementationHashes,
  flatteningHash,
  flattenStartingFrom,
  getChainConfig,
  getDiscoveryPaths,
  getExplorerClient,
  TemplateService,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { command, positional, string } from 'cmd-ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { rimraf } from 'rimraf'
import { getPlainLogger } from '../implementations/common/getPlainLogger'

export const DownloadShapes = command({
  name: 'download-shapes',
  description: 'Download all Solidity files for shapes defined in a template.',
  args: {
    template: positional({
      type: string,
      displayName: 'template',
      description: 'name of the template to download shapes for.',
    }),
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    const paths = getDiscoveryPaths()
    const templateService = new TemplateService(paths.discovery)

    if (templateService.exists(args.template) === false) {
      logger.info(`Couldn't find template "${args.template}"`)
      return
    }

    const downloadShape = createShapeDownloader(templateService, logger)

    await downloadShape(args.template)
  },
})

export const DownloadAllShapes = command({
  name: 'download-all-shapes',
  description:
    'Download all Solidity files for shapes defined in all templates.',
  args: {},
  handler: async () => {
    const logger = getPlainLogger()
    const paths = getDiscoveryPaths()
    const templateService = new TemplateService(paths.discovery)

    const allTemplates = templateService.listAllTemplates()

    const templatesWithShapes = Object.entries(allTemplates)
      .filter(([_, { shapePath }]) => shapePath !== undefined)
      .map(([templateId]) => templateId)

    const downloadShape = createShapeDownloader(templateService, logger)
    let progress = 0
    const total = templatesWithShapes.length

    for (const templateId of templatesWithShapes) {
      await downloadShape(templateId)
      progress++
      const percent = (progress / total) * 100
      logger.info(`Last downloaded: ${templateId}`)
      logger.info(`Progress: ${percent.toFixed(2)}% (${progress}/${total})`)
    }
  },
})

function createShapeDownloader(
  templateService: TemplateService,
  logger: Logger,
) {
  return async (templateId: string) => {
    const templatePath = templateService.getTemplatePath(templateId)
    const shapeSchema = templateService.readShapeSchema(
      join(templatePath, 'shapes.json'),
    )

    // 1. Remove and recreate the shapes folder
    // (helps if there are renames or removed shapes)
    const shapesFolder = join(templatePath, 'shapes')
    logger.info('Emptying the shapes folder')
    rimraf.sync(shapesFolder)
    logger.info('Creating the shapes folder')
    mkdirSync(shapesFolder, { recursive: true })
    for (const fileName in shapeSchema) {
      const outputFiles: Record<string, string> = {}

      const shape = shapeSchema[fileName]
      const chainConfig = getChainConfig(shape.chain)
      const httpClient = new HttpClient()
      const client = getExplorerClient(httpClient, chainConfig.explorer)
      logger.info(`Fetching source code of ${fileName}`)

      // 2. Download the source code and flatten it
      const sources = await Promise.all(
        Array.isArray(shape.address)
          ? shape.address.map((address) => client.getContractSource(address))
          : [client.getContractSource(shape.address)],
      )

      const sourceHashes: string[] = []

      for (const source of sources) {
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

        const outputFile = source.name.endsWith('.sol')
          ? source.name
          : `${source.name}.sol`
        const filePath = join(shapesFolder, fileName, outputFile)
        outputFiles[filePath] = flattenOutput

        const hash = flatteningHash(flattenOutput)
        sourceHashes.push(hash)
      }

      const matchingHash =
        sourceHashes.length > 1
          ? combineImplementationHashes(sourceHashes)
          : sourceHashes[0]

      // Make sure the hash matches shape.hash
      if (matchingHash !== shape.hash) {
        logger.info('Error: hash mismatch!')
        return
      }

      // 3. Create the directory for the shape under shape key
      logger.info(`Creating directory for ${fileName}`)
      mkdirSync(join(shapesFolder, fileName), { recursive: true })

      // 4. Write all the files to the designated shape folder
      logger.info(
        `Writing shape files - ${Object.keys(outputFiles).length} files`,
      )
      for (const [filePath, content] of Object.entries(outputFiles)) {
        logger.info(`Writing ${filePath}`)
        writeFileSync(filePath, content)
      }
    }
  }
}
