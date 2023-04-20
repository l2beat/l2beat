import { utils } from 'ethers'

export function deduplicateAbi(abis: string[]) {
  const signatures = new Set<string>()
  return abis
    .filter((entry) => {
      const signature = getSignature(entry)
      if (!signature || signatures.has(signature)) {
        return false
      }
      signatures.add(signature)
      return true
    })
    .sort()
}

function getSignature(entry: string) {
  const fragment = makeFragment(entry)
  if (!fragment) {
    return
  }
  if (fragment.type === 'constructor') {
    return 'constructor'
  }
  return `${fragment.type} ${fragment.format()}`
}

function makeFragment(entry: string) {
  try {
    // this value can actually also be null because ethers lies
    return utils.Fragment.from(entry)
  } catch {
    return null
  }
}
