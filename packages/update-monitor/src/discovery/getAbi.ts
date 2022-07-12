import { AnalyzedAddress } from '@l2beat/common'
import { utils } from 'ethers'

type FragmentFrom = typeof utils.Fragment.from extends (
  value: infer A,
) => utils.Fragment
  ? A
  : never
export type JsonFragment = FragmentFrom extends
  | string
  | utils.Fragment
  | infer T
  ? T
  : never

export function getAbi(
  ...analyses: (AnalyzedAddress | undefined | JsonFragment[])[]
) {
  const fragments: JsonFragment[] = []
  // we reverse to make sure that later arguments override earlier
  for (const analysis of [...analyses].reverse()) {
    if (Array.isArray(analysis)) {
      fragments.push(...analysis)
    } else if (analysis?.type === 'Contract' && analysis.verified) {
      fragments.push(...(analysis.abi as JsonFragment[]))
    }
  }

  // deduplicate abi entries
  const signatures = new Set<string>()
  return fragments.filter((fragment) => {
    const ethersFragment = utils.Fragment.from(fragment)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ethersFragment) {
      // this value can actually be null because ethers lies
      return false
    }
    const signature =
      ethersFragment.type === 'constructor'
        ? 'constructor'
        : `${ethersFragment.type} ${ethersFragment.format()}`
    if (signatures.has(signature)) {
      return false
    }
    signatures.add(signature)
    return true
  })
}
