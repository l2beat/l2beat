import { utils } from 'ethers'

export function isProgramHashProven(
  r: { input: string },
  programHashes: string[],
) {
  const fnSignature =
    'verifyProofAndRegister(uint256[] proofParams, uint256[] proof, uint256[] taskMetadata, uint256[] cairoAuxInput, uint256 cairoVerifierId)'
  const i = new utils.Interface([`function ${fnSignature}`])
  const decodedInput = i.decodeFunctionData(fnSignature, r.input)
  const taskMetadata = (decodedInput[2] as bigint[]).map((n) => n.toString())

  return taskMetadata.some((h) => programHashes.includes(h))
}
