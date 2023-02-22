import { load } from 'cheerio'
import { providers } from 'ethers'
import fetch from 'node-fetch'

import { getEnv } from '../checkVerifiedContracts/utils'

interface LZData {
  address: string
  deployer: string
  name: string
  count: number
  tvl: string
  ethValue: string
  isERC20: string
}

interface ChartPoint {
  from: number
  to: number
  value: number
}

export async function getLZ(
  provider: providers.JsonRpcProvider,
): Promise<{ data: LZData[]; chart: ChartPoint[] }> {
  console.log('fetching addresses... (this may take a while)')
  const start = 14388880
  // const start = 15688880
  const end = await provider.getBlockNumber()
  const batchSize = 10_000

  const data = []
  const chart: ChartPoint[] = []

  for (let i = start; i < end; i += batchSize) {
    console.log('fetching from', i, 'to', i + batchSize, '...')
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&startblock=${
        i - 1
      }&endblock=${
        i + batchSize
      }&action=txlistinternal&address=${'0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675'}&apikey=${getEnv(
        'ETHERSCAN_API_KEY',
      )})}`,
    )
    const d = (await response.json()) as unknown as {
      result: { from: string }[]
    }
    data.push(...d.result)
    chart.push({
      from: i,
      to: i + batchSize,
      value: d.result.length,
    })

    console.log('fetched results size', d.result.length, '\n')
    if (d.result.length === 10_000) {
      console.log('\n error MAX_SIZE exceeded\n')
    }
  }
  const interactions = new Map<string, number>()
  data.map((l) => {
    const current = interactions.get(l.from)
    if (current === undefined) {
      interactions.set(l.from, 1)
    } else {
      interactions.set(l.from, current + 1)
    }
  })
  console.log('addresses fetched: ', interactions.size)

  const result: LZData[] = []
  for (const [address, count] of interactions.entries()) {
    result.push({
      address,
      count,
      deployer: '',
      tvl: '0',
      ethValue: '0',
      name: '',
      isERC20: '',
    })
  }

  console.log('fetching TVLs...')
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < result.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('scraping Etherscan page for', result[i].address, '...')
    const a = await fetch(`https://etherscan.io/address/${result[i].address}`)
    if (a.ok) {
      const html = await a.text()
      if (html) {
        const $ = load(html)
        const button = $('#dropdownMenuBalance')
        if (button.text().length > 0) {
          result[i].tvl = button.text().slice(2).split('\n')[0]
        }

        const ethValue = $('div:contains("Eth Value")')
          .last()
          .text()
          .split('$')[1]
          .trim()
          .split(' ')[0]

        if (ethValue) {
          result[i].ethValue = ethValue
        }
      }
    }
  }
  console.log('TVLs fetched')

  console.log('fetching deployers...')
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < result.length; i++) {
    console.log('fetching deployer for', result[i].address, '...')
    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${
        result[i].address
      }&apikey=${getEnv('ETHERSCAN_API_KEY')})}`,
    )
    const data = (await response.json()) as unknown as {
      result: { contractCreator: string }[]
    }

    const deployer = data.result[0].contractCreator
    result[i].deployer = deployer
  }
  console.log('deployers fetched')

  console.log('fetching names and ABIs...')
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < result.length; i++) {
    console.log('fetching name and ABI for', result[i].address, '...')
    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${
        result[i].address
      }&apikey=${getEnv('ETHERSCAN_API_KEY')})}`,
    )
    const data = (await response.json()) as unknown as {
      result: { ABI: string; ContractName: string }[]
    }

    if (data.result[0].ContractName) {
      const name = data.result[0].ContractName
      result[i].name = name
    }

    if (data.result[0].ABI) {
      const isERC20 = data.result[0].ABI.includes('balanceOf')
      result[i].isERC20 = isERC20.toString()
    }
  }
  console.log('ABIs fetched')

  console.log(JSON.stringify(result, null, 2))
  return { data: result, chart }
}