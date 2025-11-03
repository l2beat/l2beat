import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getContractTags, updateContractTag } from '../api/api'
import type { ApiContractTagsUpdateRequest } from '../api/types'

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['contractTags', project],
      })
    },
  })
}

export function useIsContractExternal(project: string, contractAddress: string) {
  const { data: contractTags } = useContractTags(project)

  // Normalize both addresses for comparison (handle eth: prefix)
  const normalizeAddress = (addr: string) => {
    return addr.toLowerCase().replace('eth:', '')
  }

  const normalizedNodeAddress = normalizeAddress(contractAddress)

  const tag = contractTags?.tags.find(tag => {
    const normalizedTagAddress = normalizeAddress(tag.contractAddress)
    return normalizedTagAddress === normalizedNodeAddress
  })

  return tag?.isExternal ?? false
}