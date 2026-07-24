import { utils } from 'ethers'

// The cache is bounded by the static tracked-tx configurations.
const interfaces = new Map<`function ${string}`, utils.Interface>()

export function decodeFunctionCallInput(
  signature: `function ${string}`,
  input: string,
): utils.Result {
  const functionFragment = signature.replace('function ', '')
  let iface = interfaces.get(signature)
  if (iface === undefined) {
    iface = new utils.Interface([signature])
    interfaces.set(signature, iface)
  }
  return iface.decodeFunctionData(functionFragment, input)
}
