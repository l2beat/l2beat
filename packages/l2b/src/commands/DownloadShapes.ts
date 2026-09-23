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
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, positional, string } from 'cmd-ts'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { rimraf } from 'rimraf'
import {
  type CliLogger,
  createCliLogger,
} from '../implementations/common/CliLogger'

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
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const paths = getDiscoveryPaths()
    const templateService = new TemplateService(paths.discovery)

    if (templateService.exists(args.template) === false) {
      cli.log(`Couldn't find template "${args.template}"`)
      return
    }

    const downloadShape = createShapeDownloader(templateService, cli)
    const download = cli.status()
    const shapeCount = await downloadShape(args.template, (shapeName) =>
      download.update(`Downloading ${args.template}: ${shapeName}`),
    )
    download.done(`Downloaded ${shapeCount} shapes for ${args.template}`)
  },
})

export const DownloadAllShapes = command({
  name: 'download-all-shapes',
  description:
    'Download all Solidity files for shapes defined in all templates.',
  args: {},
  handler: async () => {
    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const paths = getDiscoveryPaths()
    const templateService = new TemplateService(paths.discovery)

    const allTemplates = templateService.listAllTemplates()

    const templatesWithShapes = Object.entries(allTemplates)
      .filter(([_, { shapePath }]) => shapePath !== undefined)
      .map(([templateId]) => templateId)

    const downloadShape = createShapeDownloader(templateService, cli)
    const total = templatesWithShapes.length
    const download = cli.status()
    let shapeCount = 0

    for (const [i, templateId] of templatesWithShapes.entries()) {
      shapeCount += await downloadShape(templateId, (shapeName) =>
        download.update(
          `Downloading [${i + 1}/${total}] ${templateId}: ${shapeName}`,
        ),
      )
    }
    download.done(`Downloaded ${shapeCount} shapes for ${total} templates`)
  },
})

function createShapeDownloader(
  templateService: TemplateService,
  cli: CliLogger,
) {
  return async (
    templateId: string,
    onShape: (shapeName: string) => void,
  ): Promise<number> => {
    const templatePath = templateService.getTemplatePath(templateId)
    const shapeSchema = templateService.readShapeSchema(
      join(templatePath, 'shapes.json'),
    )

    // 1. Remove and recreate the shapes folder
    // (helps if there are renames or removed shapes)
    const shapesFolder = join(templatePath, 'shapes')
    rimraf.sync(shapesFolder)
    mkdirSync(shapesFolder, { recursive: true })
    let shapeCount = 0
    for (const fileName in shapeSchema) {
      const outputFiles: Record<string, string> = {}

      const shape = shapeSchema[fileName]
      onShape(fileName)
      const sources = await getSources(shape.address)

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
          source.rootFile,
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
        cli.log(chalk.red(`${templateId}/${fileName}: hash mismatch`))
        return shapeCount
      }

      // 3. Create the directory for the shape under shape key
      mkdirSync(join(shapesFolder, fileName), { recursive: true })

      // 4. Write all the files to the designated shape folder
      for (const [filePath, content] of Object.entries(outputFiles)) {
        writeFileSync(filePath, content)
      }
      shapeCount += 1
    }
    return shapeCount
  }
}

async function getSources(
  address: ChainSpecificAddress | ChainSpecificAddress[],
) {
  const addresses = Array.isArray(address) ? address : [address]

  return await Promise.all(
    addresses.map(async (address) => {
      const chainConfig = getChainConfig(
        ChainSpecificAddress.longChain(address),
      )
      const httpClient = new HttpClient()
      const client = getExplorerClient(httpClient, chainConfig.explorer)
      return await client.getContractSource(
        ChainSpecificAddress.address(address),
      )
    }),
  )
}
