import { EthereumAddress } from '@l2beat/types'
import { readFile, writeFile } from 'fs/promises'
import z from 'zod'

export const FileStructure = z.object({
  projects: z.record(z.boolean()),
  contracts: z.record(z.boolean()),
})
export type FileStructure = z.infer<typeof FileStructure>

export type VerificationMap = Record<string, boolean>

export async function loadPreviouslyVerifiedContracts(
  filePath: string,
): Promise<Set<EthereumAddress>> {
  const result = new Set<EthereumAddress>()

  try {
    const data = await readFile(filePath, 'utf-8')
    const parsed = FileStructure.parse(JSON.parse(data))
    const addresses = Object.keys(parsed.contracts)
    const result = new Set(
      addresses.filter((a) => parsed.contracts[a]).map(EthereumAddress),
    )
    console.log(`Loaded ${result.size} previously verified contracts.`)
    return result
  } catch (e) {
    console.log('Unable to load previously verified contracts.')
  }
  return result
}

export async function saveResult(
  filePath: string,
  addressVerificationMap: VerificationMap,
  projectVerificationMap: VerificationMap,
) {
  // We need to have a deterministic order of addresses to avoid unnecessary git diff changes in the file.
  // There's no simple way to do that with JSON.stringify for nested map, so we sort each internal map.
  const output = [
    '{',
    '  "projects": ' +
      JSON.stringify(
        projectVerificationMap,
        Object.keys(projectVerificationMap).sort(),
        4,
      ) +
      ',',
    '  "contracts": ' +
      JSON.stringify(
        addressVerificationMap,
        Object.keys(addressVerificationMap).sort(),
        4,
      ),
    '}',
  ].join('\n')
  await writeFile(filePath, output)
}
