import { getDiscoveryPaths } from '@l2beat/discovery'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { command, flag, number, option } from 'cmd-ts'
import { getBlobSenders } from '../implementations/blob-senders/getBlobSenders'
import {
  getContractInfo,
  getMappingStats,
  getProjectByReceiver,
  getReceiverName,
  getSequencerMapping,
  initMappings,
} from '../implementations/blob-senders/loadDiscoveryMappings'
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

    // Load all mappings in a single pass
    const paths = getDiscoveryPaths()
    console.log('Loading mappings from discovery...')
    initMappings(paths.discovery)
    const stats = getMappingStats()
    console.log(
      `Found ${stats.sequencers} sequencers, ${stats.receivers} inboxes, ${stats.contracts} contracts\n`,
    )

    const sequencerMapping = getSequencerMapping()

    const senders = await getBlobSenders(
      args.rpcUrl,
      args.blockCount,
      (current, total, count) => {
        const pct = current / total
        const width = 30
        const filled = Math.round(pct * width)
        const bar = '█'.repeat(filled) + '░'.repeat(width - filled)
        process.stdout.write(
          `\r[${bar}] ${(pct * 100).toFixed(0).padStart(3)}% | Senders: ${count}`,
        )
      },
    )

    console.log('\n')

    if (senders.length === 0) {
      console.log('No blob transactions found in the specified range.')
      return
    }

    // Enrich with project names (check sender first, then receiver)
    const enriched = senders.map((s) => {
      const mainReceiver = [...s.receivers.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0]

      const senderInfo = sequencerMapping.get(s.address)
      const isKnownInbox = mainReceiver
        ? getProjectByReceiver(mainReceiver)
        : undefined
      const receiverName = mainReceiver
        ? getReceiverName(mainReceiver)
        : undefined
      const contractInfo = mainReceiver
        ? getContractInfo(mainReceiver)
        : undefined

      // Determine receiver display: inbox > contract name > Multicall3 > address
      const getReceiverDisplay = (showInbox: boolean) => {
        if (showInbox && isKnownInbox) return 'inbox'
        if (contractInfo) return contractInfo.name
        if (receiverName) return receiverName
        return mainReceiver ?? ''
      }

      if (senderInfo) {
        return {
          ...s,
          project: senderInfo.project,
          role: senderInfo.role ?? '',
          receiver: getReceiverDisplay(true),
          source: 'sender',
        }
      }

      // Try to identify by receiver address
      if (isKnownInbox) {
        return {
          ...s,
          project: isKnownInbox,
          role: '(by inbox)',
          receiver: 'inbox',
          source: 'receiver',
        }
      }

      return {
        ...s,
        project: '???',
        role: '',
        receiver: getReceiverDisplay(false),
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

    const headers = ['Project', 'Address', 'Blobs', 'Txs', 'Receiver']
    const rows = filtered.map((s) => [
      s.project.slice(0, 15),
      s.address,
      s.blobCount.toString(),
      s.txCount.toString(),
      s.receiver,
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
