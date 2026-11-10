const BLOCKS = 300
const SHOWN_BLOCKS = 60
/** Every second percentile up to the top, so a block's shares are good to 2% */
const SHARE_PERCENTILES = Array.from({ length: 50 }, (_, i) => (i + 1) * 2)
const WALLET_TIP_GWEI = 2
const HEAD_CHECK_MS = 2_000
const ETH_USD_FEED = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
const LATEST_ANSWER = '0x50d25bcd'
const ERC20_TRANSFER_GAS = 46_109
const WALLET_CHECK_MS = 60_000
/** Fee services rate limit, so a failed read keeps the last one this long, then the wallet is dropped */
const WALLET_KEEP_MS = 5 * 60_000
const METAMASK_FEES =
  'https://gas.api.cx.metamask.io/networks/1/suggestedGasFees'
const RABBY_FEES = 'https://api.rabby.io/v1/wallet/gas_market?chain_id=eth'
/** From ambire-common src/libs/gasPrice/gasPrice.ts, as of Oct 2026 */
const AMBIRE_BLOCKS = 3
const AMBIRE_PERCENTILES = [25, 50, 72]
const AMBIRE_MIN_TIP_GWEI = 0.0001
const AMBIRE_MIN_STEP = 1.25
/**
 * Used after ETH_RPC_URL, or alone when it is unset (previews), so the card
 * still runs live. All take a 300 block eth_feeHistory
 */
const PUBLIC_RPCS = [
  'https://ethereum-rpc.publicnode.com',
  'https://eth.drpc.org',
  'https://1rpc.io/eth',
]

/**
 * Each block must take the tip this often for 95% of transactions to land in time. With k chances and a
 * 1.7% chance of arriving too late for the first block: (1 - a * 0.983) * (1 - a)^(k - 1) = 0.05.
 */
const TIERS = [
  { key: 'slow', blockPercentile: 10, share: 0.4522 },
  { key: 'medium', blockPercentile: 25, share: 0.7829 },
  { key: 'fast', blockPercentile: 50, share: 0.9664 },
] as const

export interface GasFeesTip {
  key: (typeof TIERS)[number]['key']
  gwei: number
  usd: number
}

export interface GasFeesBlock {
  number: number
  /** Shares of the block's gas. They add up to 1, or are all 0 for an empty block */
  upToFast: number
  belowWallet: number
  atWallet: number
}

export interface GasFeesWalletTip {
  wallet: 'MetaMask' | 'Rabby' | 'Ambire'
  /** The wallet's own name for this option */
  option: string
  /** The tier it is shown beside. Wallets make their own promises, so this is not a match */
  beside: GasFeesTip['key']
  gwei: number
}

export interface GasFeesLiveTips {
  block: number
  tips: GasFeesTip[]
  /** The newest blocks, oldest first */
  blocks: GasFeesBlock[]
  /** Read from each wallet's fee service, or computed from its public code. A wallet with no good read for 5 minutes is left out */
  wallets: GasFeesWalletTip[]
}

let cached: GasFeesLiveTips | undefined
let checkedAt = 0
let wallets: GasFeesWalletTip[] = []
let walletsCheckedAt = 0
const lastReads: { tips: GasFeesWalletTip[]; readAt: number }[] = []

/** Reads past blocks only, so anyone with a node can compute the same numbers */
export async function getGasFeesTips(): Promise<GasFeesLiveTips | null> {
  if (cached && Date.now() - checkedAt < HEAD_CHECK_MS) return cached
  checkedAt = Date.now()
  const configured = process.env.ETH_RPC_URL
  const urls = configured ? [configured, ...PUBLIC_RPCS] : PUBLIC_RPCS
  let failure: unknown
  for (const url of urls) {
    try {
      return await readTips(url)
    } catch (error) {
      failure = error
    }
  }
  // A public node that rate limits us shouldn't blank the card
  if (cached) return cached
  throw new Error('No RPC answered', { cause: failure })
}

async function readTips(url: string): Promise<GasFeesLiveTips> {
  const head = await rpc<string>(url, 'eth_blockNumber', [])
  const block = Number(BigInt(head))
  if (cached?.block === block) return cached

  const [history, recent, answer, walletTips] = await Promise.all([
    rpc<{ reward: string[][] }>(url, 'eth_feeHistory', [
      `0x${BLOCKS.toString(16)}`,
      head,
      TIERS.map((tier) => tier.blockPercentile),
    ]),
    rpc<{ reward: string[][]; gasUsedRatio: number[] }>(url, 'eth_feeHistory', [
      `0x${SHOWN_BLOCKS.toString(16)}`,
      head,
      SHARE_PERCENTILES,
    ]),
    rpc<string>(url, 'eth_call', [
      { to: ETH_USD_FEED, data: LATEST_ANSWER },
      head,
    ]),
    getWalletTips(url),
  ])
  const ethUsd = Number(BigInt(answer)) / 1e8

  let floor = 0
  const tips = TIERS.map((tier, column) => {
    const values = history.reward
      .map((row) => Number(BigInt(row[column] ?? '0x0')) / 1e9)
      .sort((a, b) => a - b)
    const index = Math.floor(tier.share * values.length)
    floor = Math.max(floor, values[Math.min(values.length - 1, index)] ?? 0)
    return {
      key: tier.key,
      gwei: floor,
      usd: floor * ERC20_TRANSFER_GAS * 1e-9 * ethUsd,
    }
  })
  const blocks = recent.reward.map((row, i, shown) => {
    const number = block - shown.length + 1 + i
    if (!recent.gasUsedRatio[i]) {
      return { number, upToFast: 0, belowWallet: 0, atWallet: 0 }
    }
    const rewards = row.map((value) => Number(BigInt(value)) / 1e9)
    const shareOf = (limit: (tip: number) => boolean) =>
      rewards.filter(limit).length / rewards.length
    const upToFast = shareOf((tip) => tip <= floor)
    const belowTwo = shareOf((tip) => tip < WALLET_TIP_GWEI)
    return {
      number,
      upToFast,
      belowWallet: Math.max(0, belowTwo - upToFast),
      atWallet: 1 - Math.max(upToFast, belowTwo),
    }
  })
  cached = { block, tips, blocks, wallets: walletTips }
  return cached
}

async function getWalletTips(url: string) {
  if (Date.now() - walletsCheckedAt < WALLET_CHECK_MS) return wallets
  walletsCheckedAt = Date.now()
  const reads = await Promise.allSettled([
    readMetaMask(),
    readRabby(),
    computeAmbire(url),
  ])
  reads.forEach((read, i) => {
    if (read.status === 'fulfilled') {
      lastReads[i] = { tips: read.value, readAt: Date.now() }
    }
  })
  wallets = lastReads.flatMap((read) =>
    read && Date.now() - read.readAt < WALLET_KEEP_MS ? read.tips : [],
  )
  return wallets
}

async function readMetaMask(): Promise<GasFeesWalletTip[]> {
  type Option = { suggestedMaxPriorityFeePerGas: string }
  const fees =
    await getJson<Record<'low' | 'medium' | 'high', Option>>(METAMASK_FEES)
  const tip = (option: Option) => Number(option.suggestedMaxPriorityFeePerGas)
  return [
    { option: 'low', beside: 'slow', gwei: tip(fees.low) },
    { option: 'medium', beside: 'medium', gwei: tip(fees.medium) },
    { option: 'high', beside: 'fast', gwei: tip(fees.high) },
  ].map((row) => ({ ...row, wallet: 'MetaMask' }) as GasFeesWalletTip)
}

async function readRabby(): Promise<GasFeesWalletTip[]> {
  const levels =
    await getJson<{ level: string; priority_price?: number }[]>(RABBY_FEES)
  const tip = (level: string) => {
    const gwei = levels.find((row) => row.level === level)?.priority_price
    if (gwei === undefined) {
      throw new Error('Wallet option missing', { cause: { level } })
    }
    return gwei / 1e9
  }
  return [
    { option: 'slow', beside: 'slow', gwei: tip('slow') },
    { option: 'normal', beside: 'medium', gwei: tip('normal') },
    { option: 'fast', beside: 'fast', gwei: tip('fast') },
  ].map((row) => ({ ...row, wallet: 'Rabby' }) as GasFeesWalletTip)
}

/** Ambire's open source rule, run on our node. Each speed is at least 25% above the last */
async function computeAmbire(url: string): Promise<GasFeesWalletTip[]> {
  const [history, nodeTip] = await Promise.all([
    rpc<{ reward: string[][] }>(url, 'eth_feeHistory', [
      `0x${AMBIRE_BLOCKS.toString(16)}`,
      'latest',
      AMBIRE_PERCENTILES,
    ]),
    rpc<string>(url, 'eth_maxPriorityFeePerGas', []),
  ])
  const medians = AMBIRE_PERCENTILES.map((_, column) => {
    const tips = history.reward
      .map((row) => Number(BigInt(row[column] ?? '0x0')) / 1e9)
      .filter((tip) => tip > 0)
      .sort((a, b) => a - b)
    const middle = Math.floor(tips.length / 2)
    if (tips.length === 0) return 0
    return tips.length % 2
      ? (tips[middle] ?? 0)
      : ((tips[middle - 1] ?? 0) + (tips[middle] ?? 0)) / 2
  })
  const slow = Math.max(
    medians[0] ?? 0,
    Number(BigInt(nodeTip)) / 1e9,
    AMBIRE_MIN_TIP_GWEI,
  )
  const medium = Math.max(medians[1] ?? 0, slow * AMBIRE_MIN_STEP)
  const fast = Math.max(medians[2] ?? 0, medium * AMBIRE_MIN_STEP)
  return [
    { option: 'slow', beside: 'slow', gwei: slow },
    { option: 'medium', beside: 'medium', gwei: medium },
    { option: 'fast', beside: 'fast', gwei: fast },
  ].map((row) => ({ ...row, wallet: 'Ambire' }) as GasFeesWalletTip)
}

async function getJson<T>(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5_000) })
  if (!response.ok) {
    throw new Error('Wallet fee service error', {
      cause: { url, status: response.status },
    })
  }
  return (await response.json()) as T
}

async function rpc<T>(url: string, method: string, params: unknown[]) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(10_000),
  })
  const body = (await response.json()) as { result?: T; error?: unknown }
  if (body.error !== undefined || body.result === undefined) {
    throw new Error('RPC error', { cause: { method, error: body.error } })
  }
  return body.result
}
