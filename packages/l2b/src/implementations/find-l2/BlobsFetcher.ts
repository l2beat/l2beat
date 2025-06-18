import { v } from '@l2beat/validate'
import type { Column, FetchProjects, FetchResult } from './FetchInterface'

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
  '0x3304ca7cdc632ef2acdc86e64e63686f2cee48a0':
    '0x0bd57e83b5e0f9ecd84d559bb58e1ecfeedd2565 EOA',
  '0x0004cb44c80b6fbf8ceb1d80af688c9f7c0b2ab5': 'hashkey',
  '0x005969bf0ecbf6edb6c47e5e94693b1c3651be97': 'ink',
  '0x005de5857e38dfd703a1725c0900e9c6f24cbde0': 'swell',
  '0x008dc74cecc9deda8595b2fe210ce5979f0bfa8e': 'soneium',
  '0x00f9bcee08dce4f0e7906c1f6cfb10c77802eed0': 'arenaz',
  '0x01e9eac07e96957c2335cf112e039bd766c68281':
    'unknown op-stack 0x01e9eac07e96957c2335cf112e039bd766c68281',
  '0x3b4d794a66304f130a4db8f2551b0070dfcf5ca7': 'zklighter',
  '0x5a2a0698355d06cd5c4e3872d2bc6b9f6a89d39b': 'phala',
  '0x60130ae3eff4334a4646d7a2240283bb8c05cb01':
    '?? 0x60130ae3eff4334a4646d7a2240283bb8c05cb01',
  '0x759894ced0e6af42c26668076ffa84d02e3cef60': 'morph',
  '0x8612014a343089f1ddbacfd42baf4afbf9133593': 'superseed',
  '0x9be0c82d5ba973a9e6861695626d4f9983e80c88': 'river',
  '0xea0337efc12e98ab118948da570c07691e8e4b37': 'fuel',
  '0xff00000000000000000000000000000000000116': 'xfair.ai (dead)',
  '0xff00000000000000000000000000000000000130': 'unichain',
  '0xff00000000000000000000000000000000000183': 'ethernity',
  '0xff00000000000000000000000000000000002800': 'layer.ai?',
  '0xff00000000000000000000000000000000074202': 'amc chain?',
  '0xff00000000000000000000000000000000086397': 'ethernity(2?)',
  '0xff00000000000000000000000000000000193939': 'r0ar',
  '0xff00000000000000000000000000000000420000': 'infinaeon.com',
}

const EnvioResponseSchema = v.object({
  data: v.array(
    v.object({
      transactions: v.array(
        v.object({
          to: v.string(),
          blob_versioned_hashes: v
            .string()
            .transform((val) => ({ blobCount: (val.length - 2) / 64 })),
        }),
      ),
    }),
  ),
  archive_height: v.number().check((v) => v > 0),
  next_block: v.number().check((v) => v > 0),
  total_execution_time: v.number().check((v) => v > 0),
  rollback_guard: v.union([
    v.null(),
    v.object({
      block_number: v.number(),
      timestamp: v.number(),
      hash: v.string(),
      first_block_number: v.number(),
      first_parent_hash: v.string(),
    }),
  ]),
})

export class BlobsFetcher implements FetchProjects {
  constructor(private readonly blocksToDownload: number) {}

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
