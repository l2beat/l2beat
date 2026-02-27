import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type {
  ApiContractTagsResponse,
  ApiContractTagsUpdateRequest,
  ContractTag,
} from './types'

export function getContractTags(
  paths: DiscoveryPaths,
  project: string,
): ApiContractTagsResponse {
  const tagsPath = getContractTagsPath(paths, project)

  // Load user contract tags
  let contractTags: ContractTag[] = []
  if (fs.existsSync(tagsPath)) {
    try {
      const fileContent = fs.readFileSync(tagsPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiContractTagsResponse
      contractTags = data.tags
    } catch (error) {
      console.error('Error parsing contract tags file:', error)
    }
  }

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    tags: contractTags,
  }
}

export function updateContractTag(
  paths: DiscoveryPaths,
  project: string,
  updateRequest: ApiContractTagsUpdateRequest,
): void {
  const tagsPath = getContractTagsPath(paths, project)

  // Ensure eth: prefix, preserve original case
  const addressWithPrefix = updateRequest.contractAddress.startsWith('eth:')
    ? updateRequest.contractAddress
    : `eth:${updateRequest.contractAddress}`
  const normalizedForLookup = addressWithPrefix.toLowerCase()

  // Load existing contract tags
  let contractTags: ContractTag[] = []
  if (fs.existsSync(tagsPath)) {
    try {
      const fileContent = fs.readFileSync(tagsPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiContractTagsResponse
      contractTags = data.tags
    } catch (error) {
      console.error('Error parsing contract tags file:', error)
    }
  }

  // Find existing tag for the same contract (case-insensitive comparison)
  const existingTagIndex = contractTags.findIndex((tag) => {
    const existingNormalized = (
      tag.contractAddress.startsWith('eth:')
        ? tag.contractAddress
        : `eth:${tag.contractAddress}`
    ).toLowerCase()
    return existingNormalized === normalizedForLookup
  })

  // Determine the new values for all tag fields
  const existingTag =
    existingTagIndex >= 0 ? contractTags[existingTagIndex] : undefined
  const newIsExternal =
    updateRequest.isExternal ?? existingTag?.isExternal ?? false
  const newFetchBalances =
    updateRequest.fetchBalances ?? existingTag?.fetchBalances ?? false
  const newFetchPositions =
    updateRequest.fetchPositions ?? existingTag?.fetchPositions ?? false
  const newIsToken = updateRequest.isToken ?? existingTag?.isToken ?? false
  const newIsGovernance =
    updateRequest.isGovernance ?? existingTag?.isGovernance ?? false
  const newEntity =
    updateRequest.entity !== undefined
      ? updateRequest.entity === null
        ? undefined
        : updateRequest.entity
      : existingTag?.entity

  // Check if any meaningful tag data exists
  const hasAnyTagData =
    newIsExternal ||
    newIsGovernance ||
    newFetchBalances ||
    newFetchPositions ||
    newIsToken

  if (hasAnyTagData) {
    // Create or update tag entry
    const newTag: ContractTag = {
      contractAddress: existingTag?.contractAddress ?? addressWithPrefix,
      isExternal: newIsExternal,
      isGovernance: newIsGovernance || undefined, // Only store if true
      entity: newEntity || undefined,
      fetchBalances: newFetchBalances || undefined, // Only store if true
      fetchPositions: newFetchPositions || undefined, // Only store if true
      isToken: newIsToken || undefined, // Only store if true
      timestamp: new Date().toISOString(),
    }

    if (existingTagIndex >= 0) {
      contractTags[existingTagIndex] = newTag
    } else {
      contractTags.push(newTag)
    }
  } else if (existingTagIndex >= 0) {
    // Remove tag if all boolean fields are false
    contractTags.splice(existingTagIndex, 1)
  }

  // Create updated data
  const updatedData: ApiContractTagsResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    tags: contractTags,
  }

  // Ensure directory exists
  const dir = path.dirname(tagsPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Write updated data
  fs.writeFileSync(tagsPath, JSON.stringify(updatedData, null, 2))
}

function getContractTagsPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'contract-tags.json')
}
