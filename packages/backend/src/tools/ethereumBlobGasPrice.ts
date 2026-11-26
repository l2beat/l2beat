/**
 * Trino SQL for the price of blob gas in an Ethereum block, in wei, from a row
 * of Dune's `ethereum.blocks` named `block`. It is EIP-4844's
 * fake_exponential(1, excess_blob_gas, update fraction), in whole numbers as
 * the protocol computes it: floor(exp()) is a wei off on some blocks. 128
 * terms cover prices past 1e16 wei. Null before Cancun, which has no blob gas.
 *
 * The update fraction changed with Prague (block 22,431,084), BPO1 (block
 * 23,975,778) and BPO2 (block 24,179,383).
 */
export function ethereumBlobGasPrice(block: string): string {
  const fraction = `cast(case
      when ${block}.number >= 24179383 then 11684671
      when ${block}.number >= 23975778 then 8346193
      when ${block}.number >= 22431084 then 5007716
      else 3338477
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
