import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFile } from 'fs/promises'

import { join } from 'path'
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery'
import { SocketVaults } from './schema'

describe('socket', () => {
  it('plugs should be up to date with the discovery output', async () => {
    const file = await readFile(
      join(__dirname, 'outfiles/socket-crawl-result.json'),
      'utf-8',
    )
    const socketData = SocketVaults.parse(JSON.parse(file))

    // Extract all addresses from the crawl-result JSON
    const addresses = Object.values(socketData)
      .flat()
      .map((entry: any) => entry.address)

    const discovery = new ProjectDiscovery('socket')
    const plugs = discovery.getContractValue<string[]>('Socket', 'plugs')

    // Check that all discovered plugs are in the addresses list from the socket script
    assert(
      plugs.length === addresses.length,
      'There are new plugs in the socket discovery output. Go to packages/config and run pnpm socket-crawl, then handle the crawl results from the script.',
    )
    try {
      expect(plugs.every((plug) => addresses.includes(plug))).toEqual(true)
    } catch (error) {
      console.error(
        'The crawl results from the socket script are outdated. Go to packages/config and run pnpm socket-crawl, then handle the crawl results from the script.',
      )
      throw error
    }
  })
})
