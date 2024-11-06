import { utils } from 'ethers'

export function deduplicateAbi(abis: string[]): string[] {
  const result = new Map<string, string>()
  for (const entry of abis) {
    const fragment = makeFragment(entry)
    if (!fragment) {
      continue
    }
    const signature = getSignature(fragment)
    if (!result.has(signature) || isViewOrPure(fragment)) {
      result.set(signature, entry)
    }
  }
  return [...result.values()].sort()
}

function getSignature(fragment: utils.Fragment): string {
  if (fragment.type === 'constructor') {
    return 'constructor'
  }
  return `${fragment.type} ${fragment.format()}`
}

export function makeFragment(entry: string): utils.Fragment | null {
  try {
    // this value can actually also be null because ethers lies
    return utils.Fragment.from(entry)
  } catch {
    return null
  }
}

function isViewOrPure(fragment: utils.Fragment): boolean {
  return fragment instanceof utils.FunctionFragment && fragment.constant
}
