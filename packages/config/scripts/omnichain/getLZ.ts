import { load } from 'cheerio'
import fetch from 'node-fetch'

import { getEnv } from '../checkVerifiedContracts/utils'

export interface LZData {
  address: string
  count: number
  deployer: string
  tvl: string
  ethValue: string
  name: string
  isERC20: string
}

export async function getLZ(blockNumber: number): Promise<LZData[]> {
  const internalTxs = []
  const start = 14388880
  const end = blockNumber
  const batchSize = 10_000
  console.log(`fetching addresses... (this may take a while)`)
  console.log(
    'start block',
    start,
    'end block',
    end,
    'batch size',
    batchSize,
    '\n',
  )

  for (let i = start; i < end; i += batchSize) {
    console.log('fetching from', i, 'to', i + batchSize, '...')

    const fetchedInternalTxs = await fetchInternalTxs(i, batchSize)
    internalTxs.push(...fetchedInternalTxs)

    console.log('fetched results size', fetchedInternalTxs.length, '\n')
    if (fetchedInternalTxs.length === 10_000) {
      console.log('\n error MAX_SIZE exceeded\n')
    }
  }

  const interactionsCount = internalTxsInteractionsCount(internalTxs)
  console.log('addresses fetched: ', interactionsCount.size)

  const lzData: LZData[] = []

  console.log('fetching rest of the data... (this may take a while)')
  let index = 0
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (const [address, count] of interactionsCount.entries()) {
    await avoidRateLimiting()
    console.log('processing address', index, 'of', interactionsCount.size)
    index++

    console.log('scraping Etherscan page for', address, '...')
    const { tvl, ethValue } = await scrapEtherscan(address)

    console.log('fetching deployer for', address, '...')
    const deployer = await fetchDeployer(address)

    console.log('fetching name and ABI for', address, '...')
    const { name, isERC20 } = await fetchNameAndABI(address)

    lzData.push({
      address,
      count,
      deployer,
      tvl,
      ethValue,
      name,
      isERC20,
    })
    console.log('\n')
  }

  return lzData
}

async function fetchInternalTxs(i: number, batchSize: number) {
  const response = await fetch(
    `https://api.etherscan.io/api?module=account&startblock=${i - 1}&endblock=${
      i + batchSize
    }&action=txlistinternal&address=${'0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675'}&apikey=${getEnv(
      'ETHERSCAN_API_KEY',
    )})}`,
  )

  const data = (await response.json()) as unknown as {
    result: { from: string }[]
  }

  return data.result
}

function internalTxsInteractionsCount(internalTxs: { from: string }[]) {
  const interactions = new Map<string, number>()
  internalTxs.map((l) => {
    const current = interactions.get(l.from)
    if (current === undefined) {
      interactions.set(l.from, 1)
    } else {
      interactions.set(l.from, current + 1)
    }
  })

  return interactions
}

async function avoidRateLimiting() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

async function scrapEtherscan(
  address: string,
): Promise<{ tvl: string; ethValue: string }> {
  const result = { tvl: '0', ethValue: '0' }

  const etherscanPage = await fetch(`https://etherscan.io/address/${address}`)

  const $ = load(await etherscanPage.text())

  const button = $('#dropdownMenuBalance')
  if (button.text().length > 0) {
    result.tvl = button.text().slice(2).split('\n')[0]
  }

  const ethValue = $('div:contains("Eth Value")')
    .last()
    .text()
    .split('$')[1]
    .trim()
    .split(' ')[0]

  if (ethValue) {
    result.ethValue = ethValue
  }

  return result
}

async function fetchDeployer(address: string): Promise<string> {
  const response = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${getEnv(
      'ETHERSCAN_API_KEY',
    )})}`,
  )
  const data = (await response.json()) as unknown as {
    result: { contractCreator: string }[]
  }

  return data.result[0].contractCreator
}

async function fetchNameAndABI(
  address: string,
): Promise<{ name: string; isERC20: string }> {
  const result = { name: '', isERC20: '' }

  const response = await fetch(
    `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${getEnv(
      'ETHERSCAN_API_KEY',
    )})}`,
  )
  const data = (await response.json()) as unknown as {
    result: { ABI: string; ContractName: string }[]
  }

  if (data.result[0].ContractName) {
    const name = data.result[0].ContractName
    result.name = name
  }

  if (data.result[0].ABI) {
    const isERC20 = data.result[0].ABI.includes('balanceOf')
    result.isERC20 = isERC20.toString()
  }

  return result
}
