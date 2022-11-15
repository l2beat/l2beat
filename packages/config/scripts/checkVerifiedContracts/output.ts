import { EthereumAddress } from '@l2beat/types'
import { existsSync } from 'fs'
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
  const verified = await loadVerifiedJson(filePath)
  const contractAddresses = Object.keys(verified.contracts)
  const verifiedAddresses = contractAddresses
    .filter((a) => !!verified.contracts[a])
    .map(EthereumAddress)
  console.log(
    `Loaded ${verifiedAddresses.length} previously verified contracts.`,
  )
  return new Set(verifiedAddresses)
}

export async function loadVerifiedJson(
  filePath: string,
): Promise<FileStructure> {
  if (!existsSync(filePath)) {
    return { projects: {}, contracts: {} }
  }
  const data = await readFile(filePath, 'utf-8')
  return FileStructure.parse(JSON.parse(data))
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
      jsonStringifySorted(projectVerificationMap, 4).slice(0, -1) +
      '  },',
    '  "contracts": ' +
      jsonStringifySorted(addressVerificationMap, 4).slice(0, -1) +
      '  }',
    '}',
    '',
  ].join('\n')
  await writeFile(filePath, output)
}

function jsonStringifySorted(m: VerificationMap, space: number) {
  return JSON.stringify(m, Object.keys(m).sort(), space)
}
