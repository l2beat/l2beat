import { getDiscoveryPaths } from '@l2beat/discovery'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { command, flag, number, option } from 'cmd-ts'
import { getBlobSenders } from '../implementations/blob-senders/getBlobSenders'
import {
  getProjectByReceiver,
  getReceiverName,
} from '../implementations/blob-senders/getReceiverMapping'
import { getSequencerMappingExtended } from '../implementations/blob-senders/getSequencerMapping'
import { HttpUrl } from './types'

export const BlobSenders = command({
  name: 'blob-senders',
  description:
    'Finds all addresses that sent blob transactions in a given block range.',
  args: {
    blockCount: option({
      type: number,
      long: 'blocks',
      short: 'b',
      description: 'Number of blocks to scan from the tip',
      defaultValue: () => 1000,
      defaultValueIsSerializable: true,
    }),
    rpcUrl: option({
      type: HttpUrl,
      env: 'ETHEREUM_RPC_URL',
      long: 'rpc-url',
      short: 'r',
      description: 'Ethereum RPC URL',
      defaultValue: () => 'https://ethereum-rpc.publicnode.com',
      defaultValueIsSerializable: true,
    }),
    unknownOnly: flag({
      long: 'unknown-only',
      short: 'u',
      description: 'Only show addresses not found in discovery',
      defaultValue: () => false,
      defaultValueIsSerializable: true,
    }),
  },
  handler: async (args) => {
    console.log(`Scanning last ${args.blockCount} blocks for blob senders...`)
    console.log(`RPC: ${args.rpcUrl.slice(0, 50)}...\n`)

    // Load sequencer mapping from discovered.json files
    const paths = getDiscoveryPaths()
    const projectsPath = paths.discovery
    console.log('Loading sequencer mapping from discovery...')
    const sequencerMapping = getSequencerMappingExtended(projectsPath)
    console.log(`Found ${sequencerMapping.size} known sequencer addresses\n`)

    const senders = await getBlobSenders(
      args.rpcUrl,
      args.blockCount,
      (current, total, count) => {
        const pct = ((current / total) * 100).toFixed(1)
        process.stdout.write(`\rProgress: ${pct}% | Unique senders: ${count}`)
      },
    )

    console.log('\n')

    if (senders.length === 0) {
      console.log('No blob transactions found in the specified range.')
      return
    }

    // Enrich with project names (check sender first, then receiver)
    const enriched = senders.map((s) => {
      const senderInfo = sequencerMapping.get(s.address)
      if (senderInfo) {
        return {
          ...s,
          project: senderInfo.project,
          role: senderInfo.role ?? '',
          source: 'sender',
        }
      }

      // Try to identify by receiver address
      const mainReceiver = [...s.receivers.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0]
      if (mainReceiver) {
        const receiverProject = getProjectByReceiver(mainReceiver)
        if (receiverProject) {
          return {
            ...s,
            project: receiverProject,
            role: `-> ${mainReceiver.slice(0, 10)}...`,
            source: 'receiver',
          }
        }
      }

      // Check if receiver has a known name (like Multicall3)
      const receiverName = mainReceiver ? getReceiverName(mainReceiver) : undefined

      return {
        ...s,
        project: '???',
        role: receiverName
          ? `-> ${receiverName}`
          : mainReceiver
            ? `-> ${mainReceiver.slice(0, 10)}...`
            : '',
        source: 'unknown',
      }
    })

    // Filter if unknownOnly flag is set
    const filtered = args.unknownOnly
      ? enriched.filter((s) => s.project === '???')
      : enriched

    if (filtered.length === 0) {
      console.log('All blob senders are known projects (no unknown addresses).')
      return
    }

    const headers = ['Project', 'Address', 'Blobs', 'Txs', 'Receiver/Role']
    const rows = filtered.map((s) => [
      s.project.slice(0, 20),
      s.address,
      s.blobCount.toString(),
      s.txCount.toString(),
      s.role.slice(0, 18),
    ])

    console.log(formatAsAsciiTable(headers, rows))

    const knownCount = enriched.filter((s) => s.project !== '???').length
    const unknownCount = enriched.filter((s) => s.project === '???').length

    console.log(`\nTotal unique senders: ${enriched.length}`)
    console.log(`  Known projects: ${knownCount}`)
    console.log(`  Unknown: ${unknownCount}`)
    console.log(
      `Total blob transactions: ${enriched.reduce((sum, s) => sum + s.txCount, 0)}`,
    )
    console.log(
      `Total blobs: ${enriched.reduce((sum, s) => sum + s.blobCount, 0)}`,
    )
  },
})
