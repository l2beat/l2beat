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

  // Normalize contract address to always include eth: prefix
  const normalizedAddress = updateRequest.contractAddress.startsWith('eth:')
    ? updateRequest.contractAddress
    : `eth:${updateRequest.contractAddress}`

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

  // Find existing tag for the same contract (normalize both for comparison)
  const existingTagIndex = contractTags.findIndex((tag) => {
    const existingNormalized = tag.contractAddress.startsWith('eth:')
      ? tag.contractAddress
      : `eth:${tag.contractAddress}`
    return existingNormalized === normalizedAddress
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
  const newCentralization =
    updateRequest.centralization !== undefined
      ? updateRequest.centralization
      : existingTag?.centralization
  const newLikelihood =
    updateRequest.likelihood !== undefined
      ? updateRequest.likelihood
      : existingTag?.likelihood

  // Check if any meaningful tag data exists (boolean fields true OR likelihood assigned)
  const hasAnyTagData =
    newIsExternal ||
    newFetchBalances ||
    newFetchPositions ||
    newIsToken ||
    newLikelihood !== undefined

  if (hasAnyTagData) {
    // Create or update tag entry
    const newTag: ContractTag = {
      contractAddress: normalizedAddress,
      isExternal: newIsExternal,
      centralization: newCentralization,
      likelihood: newLikelihood,
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
