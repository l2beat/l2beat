import { DiscoveryPaths } from '@l2beat/discovery'
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

  // Find existing tag for the same contract
  const existingTagIndex = contractTags.findIndex(
    (tag) => tag.contractAddress === updateRequest.contractAddress
  )

  if (updateRequest.isExternal !== undefined) {
    // Create new tag entry
    const newTag: ContractTag = {
      contractAddress: updateRequest.contractAddress,
      isExternal: updateRequest.isExternal,
      timestamp: new Date().toISOString(),
    }

    if (existingTagIndex >= 0) {
      // Update existing tag
      contractTags[existingTagIndex] = newTag
    } else {
      // Add new tag
      contractTags.push(newTag)
    }
  } else if (existingTagIndex >= 0) {
    // Remove tag if isExternal is undefined/null and tag exists
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

function getContractTagsPath(
  paths: DiscoveryPaths,
  project: string,
): string {
  return path.join(
    paths.discovery,
    project,
    'contract-tags.json',
  )
}