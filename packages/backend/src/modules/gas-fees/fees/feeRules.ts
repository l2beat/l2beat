/**
 * What a chain's transactions pay, as Trino SQL over its Dune tables: `t` is a
 * row of its `transactions`, `b` that transaction's row of its `blocks`.
 * Amounts are in wei, as doubles.
 *
 * Dune's own gas.fees is not used: it is wrong on Taiko, ZKsync Era, Abstract
 * and Mantle. Every rule here was checked against the chain's receipts and its
 * senders' balance changes, on a day of each month from November 2025 to
 * November 2026. Days before FEE_RULES_CHECKED_FROM are not covered.
 */
export interface FeeRules {
  /** The token the fees are paid in */
  token: GasToken
  /** A transaction's whole fee */
  fee: string
  /** The part of the fee paid for posting data to Ethereum. None when left out */
  l1Fee?: string
  /** The part of the fee paid for blobs. None when left out */
  blobFee?: string
}

export type GasToken = keyof typeof GAS_TOKENS

/** The tokens' addresses on Ethereum, where Dune's prices.hour has both */
export const GAS_TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000',
  MNT: '0x3c3a81e81dc49a522a592e7622a7e711c06bf354',
} as const

export const FEE_RULES_CHECKED_FROM = '2025-11-01'

const GAS = 'cast(t.gas_used as double)'
const PRICE = 'cast(t.gas_price as double)'
const L1_FEE = 'coalesce(cast(t.l1_fee as double), 0)'
// A deposit from Ethereum (type 126) uses gas and pays nothing
const unlessDeposit = (fee: string) => `if(t.type = '126', 0e0, ${fee})`

// EIP-4844's price of blob gas: its fake_exponential(1, excess_blob_gas, fraction),
// in whole numbers as the protocol computes it: floor(exp()) is a wei off on
// some blocks. 128 terms cover prices past 1e16 wei.
// Three forks changed the update fraction: Pectra from block 22,431,084, BPO1
// from block 23,975,778 and BPO2 from block 24,179,383
const BLOB_FRACTION = `cast(case
      when b.number >= 24179383 then 11684671
      when b.number >= 23975778 then 8346193
      when b.number >= 22431084 then 5007716
      else 3338477
    end as decimal(38, 0))`
const BLOB_EXCESS = 'cast(b.excess_blob_gas as decimal(38, 0))'
const TERMS = 'row(output decimal(38, 0), term decimal(38, 0))'
// Decimal division rounds, so the remainder is taken off first
const wholeDivide = (x: string, y: string) =>
  `(${x} - mod(${x}, ${y})) / (${y})`
const BLOB_GAS_PRICE = `reduce(
      sequence(1, 128),
      cast(row(0, ${BLOB_FRACTION}) as ${TERMS}),
      (s, k) -> cast(row(
        s.output + s.term,
        ${wholeDivide(`s.term * ${BLOB_EXCESS}`, `${BLOB_FRACTION} * k`)}
      ) as ${TERMS}),
      s -> ${wholeDivide('s.output', BLOB_FRACTION)}
    )`
const BLOB_FEE = `if(t.type = '3', cardinality(t.blob_versioned_hashes) * 131072e0 * cast(${BLOB_GAS_PRICE} as double), 0e0)`

// Mantle changed how it charges on 22 April 2026. Until block 94,355,695 the
// gas held the cost of posting data to Ethereum, and l1_fee only reported it.
// From block 94,369,145 an operator fee of 1e10 wei a gas comes on top. Dune has
// no column for it: if Mantle changes that rate, the rule has to follow
const MANTLE_FEE = `case
      when t.type = '126' then 0e0
      when b.number < 94355695 then ${GAS} * ${PRICE}
      when b.number < 94369145 then ${GAS} * ${PRICE} + ${L1_FEE}
      else ${GAS} * ${PRICE} + ${L1_FEE} + ${GAS} * 1e10
    end`

const eth = (rules: Omit<FeeRules, 'token'>): FeeRules => ({
  token: 'ETH',
  ...rules,
})

export const FEE_RULES = {
  ethereum: eth({ fee: `${GAS} * ${PRICE} + ${BLOB_FEE}`, blobFee: BLOB_FEE }),
  // gas_price is the bid here; effective_gas_price is what was charged, tips included.
  // The gas already holds the gas charged for posting data to Ethereum
  arbitrum: eth({
    fee: `${GAS} * cast(t.effective_gas_price as double)`,
    l1Fee:
      'cast(t.gas_used_for_l1 as double) * cast(t.effective_gas_price as double)',
  }),
  /** OP Stack chains and Scroll: the receipt's L1 fee comes on top of the gas */
  l1FeeOnTop: eth({
    fee: unlessDeposit(`${GAS} * ${PRICE} + ${L1_FEE}`),
    l1Fee: L1_FEE,
  }),
  mantle: { token: 'MNT', fee: MANTLE_FEE, l1Fee: L1_FEE },
  // gas_price is the bid here too: a transaction is charged the block's base fee,
  // except one sent from Ethereum (Priority), which pays its own price
  zkStack: eth({
    fee: `${GAS} * if(t.type = 'Priority', ${PRICE}, least(${PRICE}, cast(b.base_fee_per_gas as double)))`,
  }),
  gasTimesPrice: eth({ fee: `${GAS} * ${PRICE}` }),
  // The anchor transaction that starts every block carries a gas price, but
  // its sender's balance never changes
  taiko: eth({
    fee: `if(t."from" = 0x0000777735367b36bC9B61C50022d9D0700dB4Ec, 0e0, ${GAS} * ${PRICE})`,
  }),
} satisfies Record<string, FeeRules>
