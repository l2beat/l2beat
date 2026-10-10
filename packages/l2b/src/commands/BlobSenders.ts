import { getDiscoveryPaths } from '@l2beat/discovery'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { command, flag, number, option } from 'cmd-ts'
import { loadEthereumDaTracking } from '../implementations/blob-senders/daTracking'
import { getBlobSenders } from '../implementations/blob-senders/getBlobSenders'
import {
  getContractInfo,
  getMappingStats,
  getProjectByReceiver,
  getReceiverName,
  getSequencerMapping,
  initMappings,
} from '../implementations/blob-senders/loadDiscoveryMappings'
import { createCliLogger } from '../implementations/common/CliLogger'
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
      description:
        'Only show senders with blobs the DA tracking does not attribute',
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
    const daTracking = loadEthereumDaTracking(paths.discovery)
    console.log(`Loaded ${daTracking.length} ethereum DA tracking configs\n`)

    const cli = createCliLogger({ output: process.stdout, quiet: false })
    const scan = cli.status()
    const { senders, topicsChecked } = await getBlobSenders(
      args.rpcUrl,
      args.blockCount,
      daTracking,
      (current, total, count) => {
        const pct = current / total
        const width = 30
        const filled = Math.round(pct * width)
        const bar = '█'.repeat(filled) + '░'.repeat(width - filled)
        scan.update(
          `[${bar}] ${(pct * 100).toFixed(0).padStart(3)}% | Senders: ${count}`,
        )
      },
    )
    scan.done(
      `Scanned ${args.blockCount} blocks, found ${senders.length} senders\n`,
    )

    if (senders.length === 0) {
      console.log('No blob transactions found in the specified range.')
      return
    }

    // A sender is known when the DA tracking (what the Ethereum DA page uses)
    // attributes its blobs. Discovery is only a hint for the unattributed ones.
    const enriched = senders.map((s) => {
      const mainReceiver = [...s.receivers.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0]
      const receiverName = mainReceiver
        ? getReceiverName(mainReceiver)
        : undefined
      const contractInfo = mainReceiver
        ? getContractInfo(mainReceiver)
        : undefined
      const receiver = contractInfo?.name ?? receiverName ?? mainReceiver ?? ''

      const topProject = [...s.attributedBlobs.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0]?.[0]
      const hint =
        sequencerMapping.get(s.address)?.project ??
        (mainReceiver ? getProjectByReceiver(mainReceiver) : undefined) ??
        contractInfo?.project ??
        ''

      return {
        ...s,
        project: topProject ?? '???',
        hint: s.unattributedBlobs > 0 ? hint : '',
        receiver,
      }
    })

    // Filter if unknownOnly flag is set
    const filtered = args.unknownOnly
      ? enriched.filter((s) => s.unattributedBlobs > 0)
      : enriched

    if (filtered.length === 0) {
      console.log('All blobs are attributed by the DA tracking.')
      return
    }

    const headers = [
      'Project',
      'Address',
      'Blobs',
      'Unattributed',
      'Txs',
      'Receiver',
      'Discovery hint',
    ]
    const rows = filtered.map((s) => [
      s.project.slice(0, 15),
      s.address,
      s.blobCount.toString(),
      s.unattributedBlobs.toString(),
      s.txCount.toString(),
      s.receiver,
      s.hint,
    ])

    console.log(formatAsAsciiTable(headers, rows))
    if (!topicsChecked) {
      console.log(
        '\nWARNING: the RPC refused eth_getLogs, so topic-tracked projects (e.g. Aztec) show as unattributed. Use an RPC that serves logs.',
      )
    }

    const knownCount = enriched.filter((s) => s.unattributedBlobs === 0).length
    const unknownCount = enriched.length - knownCount
    console.log(`\nTotal unique senders: ${enriched.length}`)
    console.log(`  Fully attributed: ${knownCount}`)
    console.log(`  With unattributed blobs: ${unknownCount}`)
    console.log(
      `Total blob transactions: ${enriched.reduce((sum, s) => sum + s.txCount, 0)}`,
    )
    console.log(
      `Total blobs: ${enriched.reduce((sum, s) => sum + s.blobCount, 0)}`,
    )
    console.log(
      `Unattributed blobs: ${enriched.reduce((sum, s) => sum + s.unattributedBlobs, 0)}`,
    )
  },
})
