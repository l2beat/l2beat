import { EthereumAddress } from '@l2beat/shared-pure'
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
  const output = {
    updatedAt: new Date().toISOString(),
    projects: sortObjectKeys(projectVerificationMap),
    contracts: sortObjectKeys(addressVerificationMap),
  }
  await writeFile(filePath, JSON.stringify(output, null, 2) + '\n')
}

function sortObjectKeys<T>(object: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(object).sort(([a], [b]) => a.localeCompare(b)),
  )
}
