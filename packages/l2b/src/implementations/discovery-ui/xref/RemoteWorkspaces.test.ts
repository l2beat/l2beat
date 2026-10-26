import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type {
  FlatSource,
  FlatSourceClient,
} from '../diffovery/FlatSourceClient'
import { addFlattenerNote } from '../getCode'
import { definitionAt } from './navigation'
import { RemoteWorkspaces } from './RemoteWorkspaces'

const PROXY = ChainSpecificAddress(`eth:0x${'1'.repeat(40)}`)
const IMPLEMENTATION = ChainSpecificAddress(`eth:0x${'2'.repeat(40)}`)
const OWNER = ChainSpecificAddress(`eth:0x${'3'.repeat(40)}`)
const BOX = `contract Box {
    uint256 internal value;
    function store(uint256 next) external {
        value = next;
    }
}
`

function discoveryOf(project: string): DiscoveryOutput {
  return {
    name: project,
    timestamp: 0,
    entries: [
      {
        type: 'Contract',
        name: 'Box',
        address: PROXY,
        values: { $implementation: IMPLEMENTATION },
        implementationNames: { [PROXY]: 'Proxy', [IMPLEMENTATION]: 'Box' },
      },
      { type: 'EOA', name: 'Owner', address: OWNER },
    ],
    abis: {},
    configHash: Hash256.ZERO,
    usedTemplates: {},
    modelledAgainst: {},
    usedBlockNumbers: {},
  }
}

function flat(text: string): FlatSource {
  return { kind: 'flat', name: 'Box', flat: text, constructorArguments: '' }
}

describe(RemoteWorkspaces.name, () => {
  const configReader = mockObject<ConfigReader>({
    readDiscoveryWithReferences: (project: string) => [discoveryOf(project)],
  })

  function setup(capacity: number) {
    const flatSourceClient = mockObject<FlatSourceClient>({
      getContractFlat: async (address: ChainSpecificAddress) =>
        flat(address === IMPLEMENTATION ? BOX : 'contract Proxy {}\n'),
    })
    const workspaces = new RemoteWorkspaces(
      configReader,
      flatSourceClient,
      capacity,
    )
    return { flatSourceClient, workspaces }
  }

  it('lists sources in the order the code panel shows them', async () => {
    const { flatSourceClient, workspaces } = setup(1)

    const workspace = await workspaces.get('project')
    const note = addFlattenerNote('')
    const result = definitionAt(
      workspace,
      PROXY,
      1,
      note.length + BOX.indexOf('value = next'),
    )

    expect(result.definitions.map((d) => [d.fileName, d.sourceIndex])).toEqual([
      ['Box.sol', 1],
    ])
    expect(workspace.entryAt(OWNER)?.sourcePaths).toEqual([])
    expect(flatSourceClient.getContractFlat).toHaveBeenCalledTimes(2)
  })

  it('fetches a project once while it stays among the most recent', async () => {
    const { flatSourceClient, workspaces } = setup(2)

    const first = await workspaces.get('a')
    await workspaces.get('b')
    expect(await workspaces.get('a')).toExactlyEqual(first)
    await workspaces.get('c')
    await workspaces.get('a')

    expect(flatSourceClient.getContractFlat).toHaveBeenCalledTimes(3 * 2)
    await workspaces.get('b')
    expect(flatSourceClient.getContractFlat).toHaveBeenCalledTimes(4 * 2)
  })

  it('loads a project again after a failed fetch', async () => {
    const { flatSourceClient, workspaces } = setup(1)
    flatSourceClient.getContractFlat.rejectsWithOnce(new Error('Rate limited'))

    await expect(workspaces.get('a')).toBeRejectedWith('Rate limited')
    const workspace = await workspaces.get('a')

    expect(workspace.entryAt(PROXY)?.sourcePaths.length).toEqual(2)
  })

  it('shares one load between concurrent lookups', async () => {
    const { flatSourceClient, workspaces } = setup(1)

    const [first, second] = await Promise.all([
      workspaces.get('a'),
      workspaces.get('a'),
    ])

    expect(first).toExactlyEqual(second)
    expect(flatSourceClient.getContractFlat).toHaveBeenCalledTimes(2)
  })
})
