import { EthereumAddress } from '@l2beat/shared-pure'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import z from 'zod'

export const FileStructure = z.record(z.boolean())
export type FileStructure = z.infer<typeof FileStructure>

export type VerificationMap = Record<string, boolean>
export type VerificationMapPerChain = Record<string, VerificationMap>

export const PROJECTS_OUTPUT_PATH = 'src/verification/projects.json'
export function getOutputPath(chain: string) {
  return `src/verification/${chain}/verified.json`
}

export async function loadPreviouslyVerifiedContracts(
  chain: string,
): Promise<Set<EthereumAddress>> {
  const filePath = getOutputPath(chain)
  if (!existsSync(filePath)) {
    mkdirSync(path.dirname(filePath))
    return new Set()
  }
  const verified = await loadVerifiedJson(filePath)
  const contractAddresses = Object.keys(verified)
  const verifiedAddresses = contractAddresses
    .filter((a) => !!verified[a])
    .map(EthereumAddress)
  console.log(
    `Loaded ${verifiedAddresses.length} previously verified contracts.`,
  )
  return new Set(verifiedAddresses)
}

export async function loadVerifiedJson(
  filePath: string,
): Promise<FileStructure> {
  const data = await readFile(filePath, 'utf-8')
  return FileStructure.parse(JSON.parse(data))
}

export async function saveResult<T>(
  filePath: string,
  result: Record<string, T>,
) {
  const output = sortObjectKeys(result)
  await writeFile(filePath, JSON.stringify(output, null, 2) + '\n')
}

function sortObjectKeys<T>(object: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(object).sort(([a], [b]) => a.localeCompare(b)),
  )
}
