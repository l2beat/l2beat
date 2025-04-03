import { TemplateService, getDiscoveryPaths } from '@l2beat/discovery'
import {
  type ExplorerConfig,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { CliLogger, HttpClient } from '@l2beat/shared'
import { assert, formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, number, positional, string } from 'cmd-ts'
import { explorerApiKey, explorerType, explorerUrl } from './args'
import { EthereumAddressValue } from './types'

export const AddShape = command({
  name: 'add-shape',
  description: 'Add a new contract shape to a template',
  args: {
    template: positional({
      type: string,
      displayName: 'template',
      description: 'name of the template to add the shape to',
    }),
    chain: positional({
      type: string,
      displayName: 'chain',
      description: 'chain to add the contract to',
    }),
    address: positional({
      type: EthereumAddressValue,
      displayName: 'address',
      description: 'address of the contract to add',
    }),
    description: positional({
      type: string,
      displayName: 'description',
      description: 'description of the contract',
    }),
    blockNumber: positional({
      type: number,
      displayName: 'blockNumber',
      description: 'block number of the contract',
    }),
    explorerUrl,
    type: explorerType,
    apiKey: explorerApiKey,
  },
  handler: async (args) => {
    const logger = new CliLogger()
    const paths = getDiscoveryPaths()
    const templateService = new TemplateService(paths.discovery)
    if (templateService.exists(args.template) === false) {
      const errorMessage = formatAsciiBorder([
        `Couldn't find template "${args.template}"`,
        '',
        'WHAT HAPPENED?',
        '• The template you specified does not exist in the discovery directory.',
        '• This could be due to a typo or the template not being created yet.',
        '',
        'HOW TO FIX IT:',
        '1. Check for typos in the template name.',
        '2. List available templates using:',
        `    [${chalk.green('src/projects/_templates/**/template.jsonc')}]`,
        '3. If this is a new template, create it first using:',
        `    [${chalk.green(`touch src/projects/_templates/${args.template}/template.json`)}]`,
        '',
        chalk.yellowBright('NOTE:'),
        chalk.yellowBright(
          '• Templates should follow the standard format and be placed in the templates directory.',
        ),
        chalk.yellowBright(
          '• You can copy an existing template as a starting point.',
        ),
      ])

      console.log(errorMessage)
      return
    }

    assert(
      args.type !== 'etherscan' || args.apiKey !== undefined,
      'When using etherscan you should provide the API key using --etherscan-key.',
    )
    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, {
      type: args.type as ExplorerConfig['type'],
      url: args.explorerUrl.toString(),
      apiKey: args.apiKey ?? 'YourApiKeyToken',
    })

    logger.logLine('Fetching contract source code...')
    const source = await client.getContractSource(args.address)

    templateService.addToShape(
      args.template,
      args.chain,
      args.address,
      args.description,
      args.blockNumber,
      source,
    )
  },
})
