import { utils } from 'ethers'

export function concatAbis(...abis: string[]) {
  const fragments = [...abis].reverse()

  // deduplicate abi entries
  const signatures = new Set<string>()
  return fragments
    .filter((fragment) => {
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
    .sort()
}
