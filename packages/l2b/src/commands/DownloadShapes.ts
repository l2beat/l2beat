import { writeFileSync } from 'fs'
import { mkdirSync } from 'fs'
import { join } from 'path'
import {
  TemplateService,
  flattenStartingFrom,
  flatteningHash,
  getChainConfig,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { getExplorerClient } from '@l2beat/discovery'
import { combineImplementationHashes } from '@l2beat/discovery'
import { CliLogger, HttpClient } from '@l2beat/shared'
import { command, positional, string } from 'cmd-ts'
import { rimraf } from 'rimraf'

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
    logger.logLine('Emptying the shapes folder')
    rimraf.sync(shapesFolder)
    logger.logLine('Creating the shapes folder')
    mkdirSync(shapesFolder, { recursive: true })
    for (const fileName in shapeSchema) {
      const outputFiles: Record<string, string> = {}

      const shape = shapeSchema[fileName]
      const chainConfig = getChainConfig(shape.chain)
      const httpClient = new HttpClient()
      const client = getExplorerClient(httpClient, chainConfig.explorer)
      logger.logLine(`Fetching source code of ${fileName}`)

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

        // Make sure the hash matches shape.hash
        const hash = flatteningHash(flattenOutput)
        sourceHashes.push(hash)
      }

      const matchingHash = combineImplementationHashes(sourceHashes)

      if (matchingHash !== shape.hash) {
        logger.logLine(`Error: hash mismatch!`)
        return
      }

      // 3. Create the directory for the shape under shape key
      logger.logLine(`Creating directory for ${fileName}`)
      mkdirSync(join(shapesFolder, fileName), { recursive: true })

      // 4. Write all the files to the designated shape folder
      logger.logLine(
        `Writing shape files - ${Object.keys(outputFiles).length} files`,
      )
      for (const [filePath, content] of Object.entries(outputFiles)) {
        logger.logLine(`Writing ${filePath}`)
        writeFileSync(filePath, content)
      }
    }
  },
})
