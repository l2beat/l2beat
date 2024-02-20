import { Logger } from '@l2beat/backend-tools'
import { readFile, writeFile } from 'fs/promises'
import { basename } from 'path'

import { listFilesRecursively } from '../utils/fsLayer'
import { flattenStartingFrom } from './flattenStartingFrom'
import { ParsedFilesManager } from './ParsedFilesManager'

const DEFAULT_ETHERSCAN_REMAPPINGS: string[] = [
  '@base-contracts/=base-contracts/',
  '@eth-optimism-bedrock/=optimism/packages/contracts-bedrock/',
  '@gnosissafe/contracts/=safe-contracts/contracts/',
  '@openzeppelin/contracts-upgradeable/=openzeppelin-contracts-upgradeable/contracts/',
  '@openzeppelin/contracts/=openzeppelin-contracts/contracts/',
  '@rari-capital/solmate/=solmate/',
  'base-contracts/=base-contracts/',
  'ds-test/=forge-std/lib/ds-test/src/',
  'forge-std/=forge-std/src/',
  'openzeppelin-contracts-upgradeable/=openzeppelin-contracts-upgradeable/',
  'openzeppelin-contracts/=openzeppelin-contracts/',
  'optimism/=optimism/',
  'safe-contracts/=safe-contracts/contracts/',
  'solmate/=solmate/src/',
]

export async function runFlatten(
  path: string,
  rootContractName: string,
  logger: Logger,
): Promise<void> {
  logger.info(`Path: ${path}`)
  logger.info(`Root contract name: ${rootContractName}`)

  const allFiles = await listFilesRecursively(path)
  const solidityFiles = filterOutNonSolidityFiles(allFiles)
  const files = await Promise.all(solidityFiles.map((f) => read(f)))

  const parsedFileManager = ParsedFilesManager.parseFiles(
    files,
    DEFAULT_ETHERSCAN_REMAPPINGS,
  )
  const flattend = flattenStartingFrom(rootContractName, parsedFileManager)
  await writeFile('flattened.sol', flattend)

  process.exit(0)
}

export function filterOutNonSolidityFiles(files: string[]): string[] {
  return files.filter((f) => basename(f).endsWith('.sol'))
}

async function read(path: string): Promise<{ path: string; content: string }> {
  const content = await readFile(path, 'utf-8')
  return {
    path,
    content,
  }
}
