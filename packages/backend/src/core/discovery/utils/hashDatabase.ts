import { ChainId, ConfigReader } from '@l2beat/discovery'
import { branded, Hash160 } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { z } from 'zod'

import { fileExistsCaseSensitive } from './fsLayer'

const HashesDatabase = z.record(branded(z.string(), Hash160))
export type HashesDatabase = z.infer<typeof HashesDatabase>

export async function getDiscoveryHash(
  projectName: string,
  chainId: ChainId,
): Promise<Hash160> {
  const configReader = new ConfigReader()
  const curDiscovery = await configReader.readDiscovery(projectName, chainId)
  const hasher = createHash('sha1')
  hasher.update(JSON.stringify(curDiscovery))
  return Hash160(`0x${hasher.digest('hex')}`)
}

export function getHashesDatabase(path: string): Record<string, Hash160> {
  let result: Record<string, Hash160> = {}

  if (fileExistsCaseSensitive(path)) {
    const hashContent = readFileSync(path, 'utf-8')
    result = HashesDatabase.parse(JSON.parse(hashContent))
  }

  return result
}

export async function updateProjectHash(
  projectName: string,
  chainId: ChainId,
  databasePath: string,
) {
  const shaSum = await getDiscoveryHash(projectName, chainId)
  const database = getHashesDatabase(databasePath)

  database[getHashesDatabaseKey(projectName, chainId)] = shaSum

  writeFileSync(databasePath, JSON.stringify(database, null, 2) + '\n')
}

export function getHashesDatabaseKey(
  projectName: string,
  chainId: ChainId,
): string {
  return `${ChainId.getName(chainId)}:${projectName}`
}
