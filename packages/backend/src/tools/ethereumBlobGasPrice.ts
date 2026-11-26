/** The blob update fraction from each fork's first block, latest first */
export const BLOB_UPDATE_FRACTIONS = [
  { fork: 'BPO2', fromBlock: 24179383, fraction: 11684671 },
  { fork: 'BPO1', fromBlock: 23975778, fraction: 8346193 },
  { fork: 'Pectra', fromBlock: 22431084, fraction: 5007716 },
  { fork: 'Cancun', fromBlock: 19426587, fraction: 3338477 },
] as const

/**
 * Trino SQL for the price of blob gas in an Ethereum block, in wei, from a row
 * of Dune's `ethereum.blocks` named `block`. It is EIP-4844's
 * fake_exponential(1, excess_blob_gas, update fraction), in whole numbers as
 * the protocol computes it: floor(exp()) is a wei off on some blocks. 128
 * terms cover prices past 1e16 wei. Null before Cancun, which has no blob gas.
 */
export function ethereumBlobGasPrice(block: string): string {
  const fraction = `cast(case
      ${BLOB_UPDATE_FRACTIONS.map(
        ({ fromBlock, fraction }) =>
          `when ${block}.number >= ${fromBlock} then ${fraction}`,
      ).join('\n      ')}
    end as decimal(38, 0))`
  const excess = `cast(${block}.excess_blob_gas as decimal(38, 0))`
  const terms = 'row(output decimal(38, 0), term decimal(38, 0))'
  return `reduce(
      sequence(1, 128),
      cast(row(0, ${fraction}) as ${terms}),
      (s, k) -> cast(row(
        s.output + s.term,
        ${wholeDivide(`s.term * ${excess}`, `${fraction} * k`)}
      ) as ${terms}),
      s -> ${wholeDivide('s.output', fraction)}
    )`
}

// Decimal division rounds, so the remainder is taken off first
function wholeDivide(x: string, y: string) {
  return `(${x} - mod(${x}, ${y})) / (${y})`
}
