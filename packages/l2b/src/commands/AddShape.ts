import {
  getChainConfig,
  getDiscoveryPaths,
  getExplorerClient,
  TemplateService,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { assert, formatAsciiBorder } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, number, positional, string } from 'cmd-ts'
import { EthereumAddressValue, Separated } from './types'

export const AddShape = command({
  name: 'add-shape',
  description: 'Add one or more contract shapes to a template.',
  args: {
    chain: positional({
      type: string,
      displayName: 'chain',
      description: 'chain to add the contracts to.',
    }),
    blockNumber: positional({
      type: number,
      displayName: 'blockNumber',
      description: 'block number of the contracts.',
    }),
    fileName: positional({
      type: string,
      displayName: 'fileName',
      description: 'fileName of the contracts.',
    }),
    template: positional({
      type: string,
      displayName: 'template',
      description: 'name of the template to add the shape to.',
    }),
    addresses: positional({
      type: Separated(EthereumAddressValue),
      description:
        'addresses of the contracts ultimate source hash will be calculated from',
    }),
  },
  handler: async (args) => {
    assert(args.addresses.length > 0, 'No addresses provided')

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
        '1. Check for typos in the template name. Make sure file is named correctly - template.jsonc',
        '2. Check template directory - maybe template lives in Foo/Bar/Baz directory yet you passed Bar/Baz as argument.',
        '3. If you have created shapes.json file manually for some reason, make sure JSON is valid - not empty, not malformed, etc. - in most cases you should delete it and let the command generate it.',
        '4. List available templates using:',
        `    [${chalk.green('src/projects/_templates/**/template.jsonc')}]`,
        '5. If this is a new template, create it first using:',
        `    [${chalk.green(`touch src/projects/_templates/${args.template}/template.jsonc`)}]`,
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

    const chainConfig = getChainConfig(args.chain)

    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, chainConfig.explorer)

    console.log('Fetching contract source code...')
    const sources = await Promise.all(
      args.addresses.map((address) => client.getContractSource(address)),
    )

    assert(sources.length > 0, 'No sources found')

    await templateService.addToShape(
      args.template,
      args.chain,
      args.addresses,
      args.fileName,
      args.blockNumber,
      sources,
    )
  },
})
