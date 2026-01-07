import { ProjectService } from '@l2beat/config'
import { HttpClient } from '@l2beat/shared'
import { RelayApiClient } from './RelayApiClient'

main()

async function main() {
  const client = new RelayApiClient(new HttpClient())
  const ps = new ProjectService()
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  chains.push({
    chainId: 792703809,
    name: 'solana',
    apis: [],
  })

  const known = new Set<string>()

  let lastTime = Math.floor(new Date().getTime() / 1000)
  while (true) {
    // await new Promise(r => setTimeout(r, 10_000))
    const res = await client.getAllRequests({
      limit: 50,
      startTimestamp: lastTime,
      sortBy: 'updatedAt',
      sortDirection: 'asc',
    })

    const successes = res.requests.filter((x) => x.status === 'success')
    const last =
      successes.length > 0 ? successes[successes.length - 1] : undefined
    if (last) {
      lastTime = Math.floor(new Date(last.updatedAt).getTime() / 1000)
    }
    for (const req of res.requests) {
      if (req.status !== 'success') {
        continue
      }
      if (known.has(req.id)) {
        continue
      }
      known.add(req.id)

      const srcId = req.data.inTxs?.[0]?.chainId
      const srcChain = srcId
        ? (chains.find((c) => c.chainId === srcId)?.name ?? srcId.toString())
        : '?'
      const dstId = req.data.outTxs?.[0]?.chainId
      const dstChain = dstId
        ? (chains.find((c) => c.chainId === dstId)?.name ?? dstId.toString())
        : '?'

      if (srcChain === dstChain && srcChain !== '?') continue

      if (srcChain !== 'ethereum') continue
      if (dstChain !== 'base') continue

      const srcAmount = {
        amount: req.data.metadata?.currencyIn?.amountFormatted,
        symbol: req.data.metadata?.currencyIn?.currency?.symbol,
      }
      const dstAmount = {
        amount: req.data.metadata?.currencyOut?.amountFormatted,
        symbol: req.data.metadata?.currencyOut?.currency?.symbol,
      }

      console.log(
        req.id.slice(0, 10),
        req.createdAt,
        srcChain,
        `(${srcAmount.amount} ${srcAmount.symbol})`,
        '->',
        dstChain,
        `(${dstAmount.amount} ${dstAmount.symbol})`,
      )

      const bsSrcChain = (srcChain as string) === 'ethereum' ? 'eth' : srcChain
      console.log(
        'src tx',
        `https://app.blocksec.com/explorer/tx/${bsSrcChain}/${req.data.inTxs?.[0]?.hash}`,
      )
      const bsDstChain = (dstChain as string) === 'ethereum' ? 'eth' : dstChain
      console.log(
        'dst tx',
        `https://app.blocksec.com/explorer/tx/${bsDstChain}/${req.data.outTxs?.[0]?.hash}`,
      )
    }
  }
}
