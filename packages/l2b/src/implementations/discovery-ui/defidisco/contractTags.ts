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
    // Create or update tag entry
    const newTag: ContractTag = {
      contractAddress: updateRequest.contractAddress,
      isExternal: updateRequest.isExternal,
      timestamp: new Date().toISOString(),
    }

    // Preserve existing centralization and mitigations if not explicitly updated
    if (existingTagIndex >= 0) {
      const existingTag = contractTags[existingTagIndex]
      newTag.centralization = updateRequest.centralization !== undefined
        ? updateRequest.centralization
        : existingTag.centralization
      newTag.mitigations = updateRequest.mitigations !== undefined
        ? updateRequest.mitigations
        : existingTag.mitigations
    } else {
      // New tag - apply provided values
      newTag.centralization = updateRequest.centralization
      newTag.mitigations = updateRequest.mitigations
    }

    if (existingTagIndex >= 0) {
      // Update existing tag
      contractTags[existingTagIndex] = newTag
    } else {
      // Add new tag
      contractTags.push(newTag)
    }
  } else if (updateRequest.centralization !== undefined || updateRequest.mitigations !== undefined) {
    // Update only centralization/mitigations for existing tag
    if (existingTagIndex >= 0) {
      const existingTag = contractTags[existingTagIndex]
      contractTags[existingTagIndex] = {
        ...existingTag,
        centralization: updateRequest.centralization !== undefined
          ? updateRequest.centralization
          : existingTag.centralization,
        mitigations: updateRequest.mitigations !== undefined
          ? updateRequest.mitigations
          : existingTag.mitigations,
        timestamp: new Date().toISOString(),
      }
    }
  } else if (existingTagIndex >= 0) {
    // Remove tag if all fields are undefined and tag exists
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