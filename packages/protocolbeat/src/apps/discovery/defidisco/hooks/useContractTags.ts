import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getContractTags, updateContractTag } from '../../../../api/api'
import type { ApiContractTagsUpdateRequest } from '../../../../api/types'
import type { OklchColor } from '../../panel-nodes/view/colors/oklch'
import oklchColors from '../../../../oklchColors.json'
import { findByAddress } from '../addressUtils'

export function useContractTags(project: string) {
  return useQuery({
    queryKey: ['contractTags', project],
    queryFn: () => getContractTags(project),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateContractTag(project: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ApiContractTagsUpdateRequest) =>
      updateContractTag(project, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['contractTags', project],
      })
      // Invalidate admins/dependencies since external contracts affect scoring
      await queryClient.invalidateQueries({
        queryKey: ['admins', project],
      })
      await queryClient.invalidateQueries({
        queryKey: ['dependencies', project],
      })
    },
  })
}

export function useIsContractExternal(
  project: string,
  contractAddress: string,
) {
  const { data: contractTags } = useContractTags(project)

  // Normalize both addresses for comparison (handle eth: prefix)
  const tag = contractTags?.tags
    ? findByAddress(
        contractTags.tags,
        (t) => t.contractAddress,
        contractAddress,
      )
    : undefined

  return tag?.isExternal ?? false
}

export function useIsContractGovernance(
  project: string,
  contractAddress: string,
) {
  const { data: contractTags } = useContractTags(project)

  const tag = contractTags?.tags
    ? findByAddress(
        contractTags.tags,
        (t) => t.contractAddress,
        contractAddress,
      )
    : undefined

  return tag?.isGovernance ?? false
}

/** Returns sorted list of unique entity names from project's contract tags. */
export function useProjectEntities(project: string): string[] {
  const { data: contractTags } = useContractTags(project)
  if (!contractTags?.tags) return []
  const entities = new Set<string>()
  for (const tag of contractTags.tags) {
    if (tag.entity) entities.add(tag.entity)
  }
  return Array.from(entities).sort()
}

/** Returns an OKLCH color override for node rendering based on contract tags. */
export function useContractTagColor(
  project: string,
  contractAddress: string,
): { color: OklchColor; isDark: boolean } | undefined {
  const { data: contractTags } = useContractTags(project)

  const tag = contractTags?.tags
    ? findByAddress(
        contractTags.tags,
        (t) => t.contractAddress,
        contractAddress,
      )
    : undefined

  if (tag?.isExternal) return { color: oklchColors.aux.orange, isDark: false }
  if (tag?.isGovernance) return { color: oklchColors.aux.green, isDark: false }
  return undefined
}
