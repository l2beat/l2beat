import { CliLogger } from '@l2beat/shared'
import { z } from 'zod'
import { Column, FetchProjects, FetchResult } from './FetchInterface'

const receiverMapping: Record<string, string> = {
  '0x06a9ab27c7e2255df1815e6cc0168d7755feb19a': 'taiko',
  '0x68d30f47f19c07bccef4ac7fae2dc12fca3e0dc9': 'taiko',
  '0x9b17fda35ed7eb7bb11a73ab69d0462045364514': 'taiko',
  '0x99c8b2d32707e6c9aae8ccd3040b7778d110173a': 'taiko',
  '0xe2ab00d2539ed0f4bc195fd34c632107890e8ea5': 'taiko',
  '0xff00000000000000000000000000000000000010': 'optimism',
  '0xff00000000000000000000000000000000008453': 'base',
  '0x6f54ca6f6ede96662024ffd61bfd18f3f4e34dff': 'zora',
  '0xc83f7d9f2d4a76e81145849381aba02602373723': 'metal',
  '0xff00000000000000000000000000000000048900': 'zircuit',
  '0xa13baf47339d63b743e7da8741db5456dac1e556': 'scroll',
  '0xfff0000000000000000000000000000000000288': 'bobanetwork',
  '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6': 'arbitrum',
  '0xff00000000000000000000000000000000000255': 'kroma',
  '0x5d8ba173dc6c3c90c8f7c04c9288bef5fdbad06e': 'zksync',
  '0xff00000000000000000000000000000000081457': 'blast',
  '0x3a75346f81302aac0333fb5dcdd407e12a6cfa83': 'bob',
  '0x4e31448a098393727b786e25b54e59dca1b77fe1': 'mint',
  '0x24e59d9d3bd73ccc28dc54062af7ef7bff58bd67': 'mode',
  '0xf4ef823d57819ac7202a081a5b49376bd28e7b3a': 'kinto',
  '0xd19d4b5d358258f05d7b411e21a1460d11b0876f': 'linea',
  '0xff00000000000000000000000000000000001135': 'lisk',
  '0xf338cad020d506e8e3d9b4854986e0ece6c23640': 'paradex',
  '0xc662c410c0ecf747543f5ba90660f6abebd9c8c4': 'starknet',
  '0x0bd57e83b5e0f9ecd84d559bb58e1ecfeedd2565': 'polynomial',
  '0xfec57bd3729a5f930d4ee8ac5992fdc8988426e4': 'snaxchain',
  '0xa12cf34001e553dc254d131105364351f5174d75': 'superlumio',
  '0xff00000000000000000000000000000000006805': 'race',
  '0xff00000000000000000000000000000000000480': 'worldchain',
  '0xff00000000000000000000000000000000062050': 'optopia',
  '0xff00000000000000000000000000000000043111': 'hemi',
  '0xff00000000000000000000000000000000000624': 'thebinaryholdings',
  '0xff00000000000000000000000000000000042069': 'pegglecoin',
  '0xff00000000000000000000000000000020240603': 'dbk',
  '0xff00000000000000000000000000000000000254': 'swan',
  '0xff00000000000000000000000000000000007776': 'panda-sea',
  '0xff00000000000000000000000000000000328527': 'nal',
  '0xff00000000000000000000000000000000056026': 'lambda',
  '0xff00000000000000000000000000000000000360': 'shape',
  '0xff00000000000000000000000000000000001110':
    '0xff00000000000000000000000000000000001110 EOA',
  '0xff00000000000000000000000000000000002800':
    '0xff00000000000000000000000000000000002800 EOA',
  '0xff00000000000000000000000000000000000183':
    '0xff00000000000000000000000000000000000183 EOA',
  '0x9be0c82d5ba973a9e6861695626d4f9983e80c88':
    '0x9be0c82d5ba973a9e6861695626d4f9983e80c88 EOA',
  '0x8612014a343089f1ddbacfd42baf4afbf9133593':
    '0x8612014a343089f1ddbacfd42baf4afbf9133593 EOA',
  '0x3304ca7cdc632ef2acdc86e64e63686f2cee48a0':
    '0x0bd57e83b5e0f9ecd84d559bb58e1ecfeedd2565 EOA',
}

const EnvioResponseSchema = z.object({
  data: z.array(
    z.object({
      transactions: z.array(
        z.object({
          to: z.string(),
          blob_versioned_hashes: z
            .string()
            .transform((val) => ({ blobCount: (val.length - 2) / 64 })),
        }),
      ),
    }),
  ),
  archive_height: z.number().positive(),
  next_block: z.number().positive(),
  total_execution_time: z.number().positive(),
  rollback_guard: z.union([
    z.null(),
    z.object({
      block_number: z.number(),
      timestamp: z.number(),
      hash: z.string(),
      first_block_number: z.number(),
      first_parent_hash: z.string(),
    }),
  ]),
})

export class BlobsFetcher implements FetchProjects {
  constructor(
    private readonly logger: CliLogger,
    private readonly blocksToDownload: number,
  ) {}

  getInput(fromBlock: number, toBlock: number) {
    return {
      from_block: fromBlock,
      to_block: toBlock,
      max_num_transactions: 10000,
      transactions: [{ type: [3] }],
      field_selection: {
        transaction: ['to', 'blob_versioned_hashes'],
      },
    }
  }

  async getEnvioResponse(fromBlock: number, toBlock: number) {
    const input = this.getInput(fromBlock, toBlock)
    const req = await fetch('https://eth.hypersync.xyz/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
    return EnvioResponseSchema.parse(await req.json())
  }

  async getEnvioNodeTop() {
    const content = await this.getEnvioResponse(20000000, 20000100)
    return content.archive_height
  }

  async fetch(): Promise<FetchResult> {
    const TO_BLOCK = await this.getEnvioNodeTop()
    let blockNumber = TO_BLOCK - this.blocksToDownload
    const blobCounts: Record<string, number> = {}
    while (blockNumber < TO_BLOCK) {
      const content = await this.getEnvioResponse(blockNumber, TO_BLOCK)
      for (const batch of content.data) {
        for (const tx of batch.transactions) {
          blobCounts[tx.to] ??= 0
          blobCounts[tx.to] += tx.blob_versioned_hashes.blobCount
        }
      }

      this.logger.logLine(
        `Downloaded ${blockNumber}-${content.next_block} in ${content.total_execution_time}ms`,
      )
      blockNumber = content.next_block
    }

    const names = []
    const frequencyColumn: Column = { header: 'Blob frequency', rows: [] }
    for (const [address, blobCount] of Object.entries(blobCounts)) {
      names.push(receiverMapping[address.toLowerCase()] ?? address)
      const oneIn = Math.floor(this.blocksToDownload / blobCount).toString()
      frequencyColumn.rows.push(`${oneIn} blocks`)
    }

    return {
      sourcePretty: 'blobs',
      names,
      columns: [frequencyColumn],
    }
  }
}
