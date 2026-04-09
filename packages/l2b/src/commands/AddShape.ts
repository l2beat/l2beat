import {
  ConfigReader,
  getChainConfig,
  getDiscoveryPaths,
  getExplorerClient,
  TemplateService,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { command, option, optional, positional, string } from 'cmd-ts'
import { extendTemplate } from '../implementations/extendTemplate'
import { initTemplate } from '../implementations/initTemplate'

export const AddShape = command({
  name: 'add-shape',
  description:
    "Add a contract shape to a template. Looks up the contract in the project's discovered.json, auto-resolves proxies to their implementation, and infers chain and block.",
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'project that contains the contract',
    }),
    addressOrName: positional({
      type: string,
      displayName: 'addressOrName',
      description:
        "chain-prefixed address (e.g. eth:0x...) or unique contract name from the project's discovered.json",
    }),
    template: option({
      type: optional(string),
      long: 'template',
      short: 't',
      description:
        'template path to add the shape to (default: <project>/<contract-name>)',
    }),
    name: option({
      type: optional(string),
      long: 'name',
      short: 'n',
      description:
        'entry name in shapes.json (default: contract name). Use this to add multiple impls to the same template under distinct keys.',
    }),
    description: option({
      type: optional(string),
      long: 'description',
      short: 'd',
      description:
        'set the template description in one shot. Insert-only: errors out if the template already has a description (edit it manually instead).',
    }),
    ignoreRelatives: option({
      type: optional(string),
      long: 'ignore-relatives',
      short: 'i',
      description:
        'comma-separated list of field names to add to the template ignoreRelatives. Insert-only: errors out if the template already has an ignoreRelatives array (edit it manually instead).',
    }),
  },
  handler: async (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const discovery = configReader.readDiscovery(args.project)

    // Resolve the entry from address or name
    const isAddress = args.addressOrName.includes(':')
    let entry
    if (isAddress) {
      entry = discovery.entries.find(
        (e) =>
          e.address.toString().toLowerCase() ===
          args.addressOrName.toLowerCase(),
      )
      assert(
        entry !== undefined,
        `No entry with address '${args.addressOrName}' in ${args.project}/discovered.json`,
      )
    } else {
      const matches = discovery.entries.filter(
        (e) => e.name === args.addressOrName,
      )
      assert(
        matches.length > 0,
        `No entry named '${args.addressOrName}' in ${args.project}/discovered.json`,
      )
      assert(
        matches.length === 1,
        `Found ${matches.length} entries named '${args.addressOrName}' in ${args.project}/discovered.json. Pass a chain-prefixed address (eth:0x...) to disambiguate.`,
      )
      // biome-ignore lint/style/noNonNullAssertion: just asserted
      entry = matches[0]!
    }

    assert(
      entry.type === 'Contract',
      `Entry '${entry.address}' is type ${entry.type}, not Contract. Templates only apply to contracts.`,
    )

    // Determine chain and block from the entry
    const csa = ChainSpecificAddress(entry.address.toString())
    const chain = ChainSpecificAddress.longChain(csa)
    const blockNumber = discovery.usedBlockNumbers[chain]
    assert(
      blockNumber !== undefined,
      `No block number recorded for chain '${chain}' in discovered.json`,
    )

    // Resolve to implementation if proxy. The proxy detector populates
    // $implementation (single) for normal proxies and $implementations
    // (plural, array) for diamond/multi-impl proxies.
    const impls = entry.values?.$implementations
    const singleImpl = entry.values?.$implementation
    let targetCsa: ChainSpecificAddress
    let proxyMessage: string | undefined

    if (Array.isArray(impls) && impls.length > 0) {
      assert(
        impls.length === 1,
        `Entry '${entry.address}' has ${impls.length} implementations (likely a diamond/multi-impl proxy). Templating diamonds via add-shape is not supported; pass a specific impl address directly.`,
      )
      targetCsa = ChainSpecificAddress(String(impls[0]))
      proxyMessage = `Detected ${entry.proxyType ?? 'proxy'} at ${entry.address}, using implementation ${targetCsa}`
    } else if (
      typeof singleImpl === 'string' &&
      singleImpl !== '' &&
      singleImpl !== ChainSpecificAddress.ZERO(chain)
    ) {
      targetCsa = ChainSpecificAddress(singleImpl)
      proxyMessage = `Detected ${entry.proxyType ?? 'proxy'} at ${entry.address}, using implementation ${targetCsa}`
    } else {
      targetCsa = csa
    }

    if (proxyMessage) {
      console.log(proxyMessage)
    }

    // Determine template path and entry name
    const contractName = entry.name
    assert(
      contractName !== undefined && contractName !== '',
      `Entry '${entry.address}' has no name; templates need a name to derive the default template path.`,
    )
    const templatePath = args.template ?? `${args.project}/${contractName}`
    const fileName = args.name ?? contractName

    // Auto-create template if missing
    const templateService = new TemplateService(paths.discovery)
    if (templateService.exists(templatePath) === false) {
      console.log(`Template "${templatePath}" does not exist, creating it.`)
      initTemplate(templatePath)
    }

    // Fetch source code via the chain explorer using the resolved address
    const chainConfig = getChainConfig(chain)
    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, chainConfig.explorer)

    console.log('Fetching contract source code...')
    const targetAddress = ChainSpecificAddress.address(targetCsa)
    const source = await client.getContractSource(targetAddress)
    assert(source !== undefined, 'No source found')

    templateService.addToShape(
      templatePath,
      chain,
      [targetAddress],
      fileName,
      blockNumber,
      [source],
    )
    console.log(`Added shape '${fileName}' to template '${templatePath}'.`)

    // Optional one-shot template extension. Insert-only to avoid clobbering
    // hand-written content; conflicts surface as a hard error so the user
    // notices and edits manually.
    const ignoreRelativesList = parseIgnoreRelatives(args.ignoreRelatives)
    if (args.description !== undefined || ignoreRelativesList !== undefined) {
      const result = extendTemplate(templatePath, {
        description: args.description,
        ignoreRelatives: ignoreRelativesList,
      })
      if (result.conflicts.length > 0) {
        const fields = result.conflicts.join(', ')
        const applied: string[] = []
        if (result.appliedDescription) applied.push('description')
        if (result.appliedIgnoreRelatives) applied.push('ignoreRelatives')
        const appliedNote =
          applied.length > 0
            ? ` (the other field${applied.length > 1 ? 's' : ''} ${applied.join(', ')} ${applied.length > 1 ? 'were' : 'was'} written successfully)`
            : ''
        throw new Error(
          `Template '${templatePath}' already has ${fields}. add-shape's --description / --ignore-relatives flags are insert-only; edit the template by hand to change ${fields}.${appliedNote}`,
        )
      }
      const written: string[] = []
      if (result.appliedDescription) written.push('description')
      if (result.appliedIgnoreRelatives) written.push('ignoreRelatives')
      if (written.length > 0) {
        console.log(
          `Wrote ${written.join(', ')} to template '${templatePath}'.`,
        )
      }
    }
  },
})

function parseIgnoreRelatives(raw: string | undefined): string[] | undefined {
  if (raw === undefined) return undefined
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  if (parts.length === 0) {
    throw new Error(
      '--ignore-relatives was passed but contained no field names',
    )
  }
  return parts
}
