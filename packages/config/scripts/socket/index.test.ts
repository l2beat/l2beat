import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFile } from 'fs/promises'

import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery'
import { SocketVaults } from './schema'

describe('socket', () => {
  it('plugs should be up to date with the discovery output', async () => {
    const file = await readFile('src/bridges/socket-vaults.json', 'utf-8')
    const socketData = SocketVaults.parse(JSON.parse(file))
    const discovery = new ProjectDiscovery('socket')
    const plugs = discovery.getContractValue<string[]>('Socket', 'plugs')

    expect(socketData.plugs).toEqual(plugs)
    assert(
      socketData.plugs.length === plugs.length,
      'There are new plugs in the ethereum/socket discovery output. Go to packages/config and run yarn update-socket.',
    )
  })
})
