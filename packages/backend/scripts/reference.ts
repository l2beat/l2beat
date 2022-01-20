import { Contract, providers } from 'ethers'

import { compareResult } from './compare'

async function getReferenceImplementation(
  provider: providers.Provider,
  address: string,
  method: string,
  args: (string | number | boolean)[]
) {
  const contract = new Contract(address, [method], provider)
  const name = method.match(/^function (\w+)\(/)![1]
  const result: string = await contract[name](...args)
  return result
}

export async function checkReferenceImplementation(
  provider: providers.Provider,
  address: string,
  method: string,
  args: (string | number | boolean)[],
  expected: string
) {
  await compareResult(
    'Reference implementation',
    expected,
    getReferenceImplementation(provider, address, method, args)
  )
}
