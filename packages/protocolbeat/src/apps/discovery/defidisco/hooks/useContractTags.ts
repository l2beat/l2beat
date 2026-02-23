import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getContractTags, updateContractTag } from '../../../../api/api'
import type { ApiContractTagsUpdateRequest } from '../../../../api/types'
import type { OklchColor } from '../../panel-nodes/view/colors/oklch'
import oklchColors from '../../../../oklchColors.json'

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
      // Invalidate V2 scores since external contracts affect scoring
      await queryClient.invalidateQueries({
        queryKey: ['v2-score', project],
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
  const normalizeAddress = (addr: string) => {
    return addr.toLowerCase().replace('eth:', '')
  }

  const normalizedNodeAddress = normalizeAddress(contractAddress)

  const tag = contractTags?.tags.find((tag) => {
    const normalizedTagAddress = normalizeAddress(tag.contractAddress)
    return normalizedTagAddress === normalizedNodeAddress
  })

  return tag?.isExternal ?? false
}

export function useIsContractGovernance(
  project: string,
  contractAddress: string,
) {
  const { data: contractTags } = useContractTags(project)

  const normalizeAddress = (addr: string) => {
    return addr.toLowerCase().replace('eth:', '')
  }

  const normalizedNodeAddress = normalizeAddress(contractAddress)

  const tag = contractTags?.tags.find((tag) => {
    const normalizedTagAddress = normalizeAddress(tag.contractAddress)
    return normalizedTagAddress === normalizedNodeAddress
  })

  return tag?.isGovernance ?? false
}

/** Returns an OKLCH color override for node rendering based on contract tags. */
export function useContractTagColor(
  project: string,
  contractAddress: string,
): { color: OklchColor; isDark: boolean } | undefined {
  const { data: contractTags } = useContractTags(project)

  const normalizeAddress = (addr: string) =>
    addr.toLowerCase().replace('eth:', '')
  const normalizedAddress = normalizeAddress(contractAddress)

  const tag = contractTags?.tags.find(
    (t) => normalizeAddress(t.contractAddress) === normalizedAddress,
  )

  if (tag?.isExternal) return { color: oklchColors.aux.orange, isDark: false }
  if (tag?.isGovernance) return { color: oklchColors.aux.green, isDark: false }
  return undefined
}
